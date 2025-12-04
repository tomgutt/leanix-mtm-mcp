import axios, { AxiosInstance } from 'axios';

export class LeanIXClient {
  private apiToken: string;
  private baseURL: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private axiosInstance: AxiosInstance;
  private initialized: boolean = false;

  constructor(apiToken: string, instance: string = 'app') {
    this.apiToken = apiToken;
    this.baseURL = `https://${instance}.leanix.net`;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
    });
  }

  /**
   * Initialize the client by fetching the access token
   * This should be called after construction before making any requests
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    await this.fetchAccessToken();
    this.initialized = true;
  }

  /**
   * Fetch a new OAuth 2.0 access token using the API token
   * Following the authentication flow from: https://help.sap.com/docs/leanix/ea/authentication-to-sap-leanix-services
   */
  private async fetchAccessToken(): Promise<void> {
    const now = Date.now();

    try {
      const response = await axios.post(
        `${this.baseURL}/services/mtm/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          auth: {
            username: 'apitoken',
            password: this.apiToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry time with 60 second buffer to avoid edge cases
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = now + (expiresIn - 60) * 1000;
    } catch (error: any) {
      throw new Error(`Failed to obtain LeanIX access token: ${error.message}`);
    }
  }

  /**
   * Get the current access token, checking if it's still valid
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    const now = Date.now();
    if (this.accessToken && this.tokenExpiry > now) {
      return this.accessToken as string;
    }

    // Token expired or doesn't exist, fetch a new one
    await this.fetchAccessToken();
    return this.accessToken as string;
  }

  /**
   * Invalidate the current access token to force a refresh
   */
  private invalidateToken(): void {
    this.accessToken = null;
    this.tokenExpiry = 0;
  }

  /**
   * Make an authenticated request to the LeanIX API
   * Automatically retries once with a new token if a 403 FORBIDDEN error occurs
   */
  async request<T = any>(method: string, endpoint: string, data?: any, isRetry: boolean = false): Promise<T> {
    if (!this.initialized) {
      throw new Error('LeanIXClient must be initialized before making requests. Call initialize() first.');
    }

    const token = await this.getAccessToken();
    
    try {
      const response = await this.axiosInstance.request({
        method,
        url: endpoint,
        data,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      // Check if it's a 403 FORBIDDEN error and we haven't retried yet
      if (error.response?.status === 403 && !isRetry) {
        // Invalidate the current token and fetch a new one
        this.invalidateToken();
        await this.fetchAccessToken();
        
        // Retry the request once with the new token
        return this.request<T>(method, endpoint, data, true);
      }
      
      throw new Error(`LeanIX API request failed: ${error.message}`);
    }
  }

  /**
   * Get method for convenience
   */
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  /**
   * Post method for convenience
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * Get the base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Decode the JWT access token and return its contents
   * @returns The decoded JWT payload or null if no token is available
   */
  getDecodedAccessToken(): any | null {
    if (!this.accessToken) {
      return null;
    }

    try {
      // JWT has 3 parts separated by dots: header.payload.signature
      const parts = this.accessToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // Decode the payload (second part)
      const payload = parts[1];
      
      // Base64 URL decode
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      
      return JSON.parse(jsonPayload);
    } catch (error: any) {
      throw new Error(`Failed to decode JWT token: ${error.message}`);
    }
  }
}

// Check env variables and create singleton instance
if (!process.env.LEANIX_TOKEN) {
  throw new Error("LEANIX_TOKEN environment variable is not set");
}

const instance = process.env.LEANIX_INSTANCE || 'app';
const client = new LeanIXClient(process.env.LEANIX_TOKEN, instance);

// Initialize the client immediately
export const leanixClient = (async () => {
  await client.initialize();
  return client;
})();

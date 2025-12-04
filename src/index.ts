#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { getAccountsTool } from "./tools/getAccounts.js";
import { getAccountTool } from "./tools/getAccount.js";
import { getWorkspacesTool } from "./tools/getWorkspaces.js";
import { getWorkspaceTool } from "./tools/getWorkspace.js";
import { getUsersTool } from "./tools/getUsers.js";
import { getUserTool } from "./tools/getUser.js";
import { getPermissionsTool } from "./tools/getPermissions.js";
import { getPermissionTool } from "./tools/getPermission.js";
import { getContractsTool } from "./tools/getContracts.js";
import { getContractTool } from "./tools/getContract.js";
import { getInstancesTool } from "./tools/getInstances.js";
import { getEventsTool } from "./tools/getEvents.js";
import { getTechnicalUsersTool } from "./tools/getTechnicalUsers.js";
import { leanixClient } from "./leanix/client.js";

async function main() {
  // Validate LeanIX connection on startup
  let leanix;
  try {
    console.error("Initializing LeanIX connection...");
    leanix = await leanixClient;
    console.error("✓ LeanIX connection established successfully");
    
    // Check if user has SUPERADMIN role
    console.error("Validating user permissions...");
    if (!leanix.isSuperAdmin()) {
      const decodedToken = leanix.getDecodedAccessToken();
      const role = decodedToken?.principal?.role || 'unknown';
      console.error(`✗ Access denied: User role '${role}' is not authorized. Only SUPERADMIN users can use this MCP server.`);
      process.exit(1);
    }
    console.error("✓ User has SUPERADMIN role");
  } catch (error: any) {
    console.error("✗ Failed to establish LeanIX connection:", error.message);
    console.error("Please check your LEANIX_TOKEN and LEANIX_INSTANCE environment variables.");
    process.exit(1);
  }

  const server = new Server({
    name: "leanix-mtm-mcp",
    version: "0.1.0"
  }, {
    capabilities: {
      tools: {}
    }
  });


  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "get_accounts",
          description: "List or search all accounts with pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              q: { 
                type: "string",
                description: "A part of the name to search for"
              },
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 30, max 100)",
                default: 30
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: ""
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of accounts matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Account UUID" 
                    },
                    name: { 
                      type: "string", 
                      minLength: 2,
                      maxLength: 128,
                      description: "Account name" 
                    },
                    fromAddress: { 
                      type: "string", 
                      format: "email",
                      description: "From email address" 
                    },
                    aiAvailable: { 
                      type: "boolean", 
                      description: "Whether AI features are available" 
                    },
                    sapCrmId: { 
                      type: "string", 
                      description: "SAP CRM ID" 
                    },
                    sapPaperCustomer: { 
                      type: "boolean", 
                      description: "SAP paper customer flag" 
                    },
                    sapAiUnitsAvailable: { 
                      type: "boolean", 
                      description: "SAP AI units available flag" 
                    },
                    passwordPolicy: { 
                      type: "string", 
                      enum: ["NORMAL", "STRICT"],
                      description: "Password policy type" 
                    },
                    responsibleUser: { 
                      type: "object", 
                      description: "Responsible user object" 
                    },
                    links: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Related links" 
                    }
                  }
                },
                description: "Array of account objects"
              }
            }
          }
        },
        {
          name: "get_account",
          description: "Retrieve a single account by its UUID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { 
                type: "string",
                description: "Account UUID"
              }
            },
            required: ["id"]
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total count (typically 1 for single account)"
              },
              data: {
                type: "object",
                required: ["name"],
                properties: {
                  id: { 
                    type: "string", 
                    format: "uuid",
                    description: "Account UUID" 
                  },
                  name: { 
                    type: "string", 
                    minLength: 2,
                    maxLength: 128,
                    description: "Account name" 
                  },
                  fromAddress: { 
                    type: "string", 
                    format: "email",
                    description: "From email address" 
                  },
                  aiAvailable: { 
                    type: "boolean", 
                    description: "Whether AI features are available" 
                  },
                  sapCrmId: { 
                    type: "string", 
                    description: "SAP CRM ID" 
                  },
                  sapPaperCustomer: { 
                    type: "boolean", 
                    description: "SAP paper customer flag" 
                  },
                  sapAiUnitsAvailable: { 
                    type: "boolean", 
                    description: "SAP AI units available flag" 
                  },
                  passwordPolicy: { 
                    type: "string", 
                    enum: ["NORMAL", "STRICT"],
                    description: "Password policy type" 
                  },
                  responsibleUser: { 
                    type: "object", 
                    description: "Responsible user object" 
                  },
                  links: { 
                    type: "array", 
                    items: { type: "object" },
                    description: "Related links" 
                  }
                },
                description: "Account object"
              }
            }
          }
        },
        {
          name: "get_workspaces",
          description: "List all workspaces for the requesting user with filtering and pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              q: { 
                type: "string",
                description: "Search query"
              },
              feature: { 
                type: "string",
                description: "Feature Flag Filter"
              },
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 30, max 100)",
                default: 30
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: "id-asc"
              },
              labels: { 
                type: "string",
                description: "Comma-separated list of label ids"
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of workspaces matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["contract", "identityManagement", "name"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Workspace UUID" 
                    },
                    name: { 
                      type: "string", 
                      minLength: 1,
                      description: "Workspace name" 
                    },
                    contract: { 
                      type: "object", 
                      description: "Contract object" 
                    },
                    instance: { 
                      type: "object", 
                      description: "Instance object" 
                    },
                    domain: { 
                      type: "object", 
                      description: "Domain object" 
                    },
                    featureBundleId: { 
                      type: "string", 
                      description: "Feature bundle ID" 
                    },
                    status: { 
                      type: "string", 
                      enum: ["ACTIVE", "BLOCKED"],
                      description: "Workspace status" 
                    },
                    type: { 
                      type: "string", 
                      enum: ["LIVE", "DEMO", "SANDBOX"],
                      description: "Workspace type" 
                    },
                    product: { 
                      type: "string", 
                      enum: ["EAM", "VSM", "SMP"],
                      description: "Product type" 
                    },
                    defaultRole: { 
                      type: "string", 
                      enum: ["ADMIN", "MEMBER", "VIEWER", "CONTACT", "SYSTEM_READ", "SYSTEM_WRITE", "SYSTEM_AS_USER", "TRANSIENT"],
                      description: "Default role for workspace" 
                    },
                    comment: { 
                      type: "string", 
                      description: "Comment" 
                    },
                    createdAt: { 
                      type: "string", 
                      format: "date-time",
                      description: "Creation timestamp" 
                    },
                    invitationOnly: { 
                      type: "boolean", 
                      description: "Whether workspace is invitation only" 
                    },
                    allowTransientUsers: { 
                      type: "boolean", 
                      description: "Whether transient users are allowed" 
                    },
                    replayed: { 
                      type: "boolean", 
                      description: "Whether workspace was replayed" 
                    },
                    replayedV2: { 
                      type: "boolean", 
                      description: "Whether workspace was replayed v2" 
                    },
                    sapTenantId: { 
                      type: "number", 
                      format: "int64",
                      description: "SAP tenant ID" 
                    },
                    managedBy: { 
                      type: "string", 
                      format: "uuid",
                      description: "Managed by UUID" 
                    },
                    identityManagement: { 
                      type: "string", 
                      enum: ["AUTHENTICATION_ONLY", "MANAGE_USER", "MANAGE_USER_AND_PERMISSIONS"],
                      description: "Identity management type" 
                    },
                    businessType: { 
                      type: "string", 
                      enum: ["ZH101", "ZH105", "ZH301", "ZH302", "ZH314", "ZH421", "ZH526", "ZH527", "ZH533", "ZH550", "ZH722"],
                      description: "Business type" 
                    },
                    active: { 
                      type: "boolean", 
                      description: "Whether workspace is active" 
                    },
                    url: { 
                      type: "string", 
                      description: "Workspace URL" 
                    },
                    createdFromTemplate: { 
                      type: "boolean", 
                      description: "Whether workspace was created from template" 
                    },
                    links: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Related links" 
                    }
                  }
                },
                description: "Array of workspace objects"
              }
            }
          }
        },
        {
          name: "get_workspace",
          description: "Retrieve a single workspace by its UUID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { 
                type: "string",
                description: "Workspace UUID"
              }
            },
            required: ["id"]
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total count (typically 1 for single workspace)"
              },
              data: {
                type: "object",
                required: ["contract", "identityManagement", "name"],
                properties: {
                  id: { 
                    type: "string", 
                    format: "uuid",
                    description: "Workspace UUID" 
                  },
                  name: { 
                    type: "string", 
                    minLength: 1,
                    description: "Workspace name" 
                  },
                  contract: { 
                    type: "object", 
                    description: "Contract object" 
                  },
                  instance: { 
                    type: "object", 
                    description: "Instance object" 
                  },
                  domain: { 
                    type: "object", 
                    description: "Domain object" 
                  },
                  featureBundleId: { 
                    type: "string", 
                    description: "Feature bundle ID" 
                  },
                  status: { 
                    type: "string", 
                    enum: ["ACTIVE", "BLOCKED"],
                    description: "Workspace status" 
                  },
                  type: { 
                    type: "string", 
                    enum: ["LIVE", "DEMO", "SANDBOX"],
                    description: "Workspace type" 
                  },
                  product: { 
                    type: "string", 
                    enum: ["EAM", "VSM", "SMP"],
                    description: "Product type" 
                  },
                  defaultRole: { 
                    type: "string", 
                    enum: ["ADMIN", "MEMBER", "VIEWER", "CONTACT", "SYSTEM_READ", "SYSTEM_WRITE", "SYSTEM_AS_USER", "TRANSIENT"],
                    description: "Default role for workspace" 
                  },
                  comment: { 
                    type: "string", 
                    description: "Comment" 
                  },
                  createdAt: { 
                    type: "string", 
                    format: "date-time",
                    description: "Creation timestamp" 
                  },
                  invitationOnly: { 
                    type: "boolean", 
                    description: "Whether workspace is invitation only" 
                  },
                  allowTransientUsers: { 
                    type: "boolean", 
                    description: "Whether transient users are allowed" 
                  },
                  replayed: { 
                    type: "boolean", 
                    description: "Whether workspace was replayed" 
                  },
                  replayedV2: { 
                    type: "boolean", 
                    description: "Whether workspace was replayed v2" 
                  },
                  sapTenantId: { 
                    type: "number", 
                    format: "int64",
                    description: "SAP tenant ID" 
                  },
                  managedBy: { 
                    type: "string", 
                    format: "uuid",
                    description: "Managed by UUID" 
                  },
                  identityManagement: { 
                    type: "string", 
                    enum: ["AUTHENTICATION_ONLY", "MANAGE_USER", "MANAGE_USER_AND_PERMISSIONS"],
                    description: "Identity management type" 
                  },
                  businessType: { 
                    type: "string", 
                    enum: ["ZH101", "ZH105", "ZH301", "ZH302", "ZH314", "ZH421", "ZH526", "ZH527", "ZH533", "ZH550", "ZH722"],
                    description: "Business type" 
                  },
                  active: { 
                    type: "boolean", 
                    description: "Whether workspace is active" 
                  },
                  url: { 
                    type: "string", 
                    description: "Workspace URL" 
                  },
                  createdFromTemplate: { 
                    type: "boolean", 
                    description: "Whether workspace was created from template" 
                  },
                  links: { 
                    type: "array", 
                    items: { type: "object" },
                    description: "Related links" 
                  }
                },
                description: "Workspace object"
              }
            }
          }
        },
        {
          name: "get_users",
          description: "List or search all users with pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              email: { 
                type: "string",
                description: "Search by email address (optional)"
              },
              userName: { 
                type: "string",
                description: "Search by userName address (optional)"
              },
              q: { 
                type: "string",
                description: "Search in user name or name (optional)"
              },
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 30, max 100)",
                default: 30
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: ""
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of users matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["account", "role", "status", "userName"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "User UUID" 
                    },
                    account: { 
                      type: "object", 
                      description: "Account object" 
                    },
                    userName: { 
                      type: "string", 
                      format: "email",
                      minLength: 6,
                      maxLength: 256,
                      description: "Username (email format)" 
                    },
                    technicalUserName: { 
                      type: "string", 
                      minLength: 1,
                      maxLength: 256,
                      description: "Technical username" 
                    },
                    email: { 
                      type: "string", 
                      format: "email",
                      minLength: 2,
                      maxLength: 256,
                      description: "User email" 
                    },
                    technicalUserEmail: { 
                      type: "string", 
                      minLength: 0,
                      maxLength: 256,
                      description: "Technical user email" 
                    },
                    firstName: { 
                      type: "string", 
                      minLength: 1,
                      maxLength: 128,
                      description: "First name" 
                    },
                    lastName: { 
                      type: "string", 
                      minLength: 1,
                      maxLength: 128,
                      description: "Last name" 
                    },
                    department: { 
                      type: "string", 
                      description: "Department" 
                    },
                    lastLogin: { 
                      type: "string", 
                      format: "date-time",
                      description: "Last login timestamp" 
                    },
                    currentLogin: { 
                      type: "string", 
                      format: "date-time",
                      description: "Current login timestamp" 
                    },
                    role: { 
                      type: "string", 
                      enum: ["SUPERADMIN", "SYSTEM", "APICLIENT", "ACCOUNTADMIN", "ACCOUNTUSER", "TOKEN_EXCHANGE_CLIENT"],
                      description: "User role" 
                    },
                    status: { 
                      type: "string", 
                      enum: ["ACTIVE", "ARCHIVED"],
                      description: "User status" 
                    },
                    crmTags: { 
                      type: "string", 
                      description: "CRM tags" 
                    },
                    crmLink: { 
                      type: "string", 
                      description: "CRM link" 
                    },
                    technicalUser: { 
                      type: "boolean", 
                      description: "Whether user is a technical user" 
                    },
                    scimManaged: { 
                      type: "boolean", 
                      description: "Whether user is SCIM managed" 
                    },
                    transientUser: { 
                      type: "boolean", 
                      description: "Whether user is transient" 
                    },
                    permissions: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Array of permission objects" 
                    },
                    replayed: { 
                      type: "boolean", 
                      description: "Whether user was replayed" 
                    },
                    active: { 
                      type: "boolean", 
                      description: "Whether user is active" 
                    },
                    displayName: { 
                      type: "string", 
                      description: "Display name" 
                    },
                    links: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Related links" 
                    }
                  }
                },
                description: "Array of user objects"
              }
            }
          }
        },
        {
          name: "get_user",
          description: "Retrieve a single user by their UUID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { 
                type: "string",
                description: "User UUID"
              },
              returnSinglePermission: { 
                type: "boolean",
                description: "If true returns only the permission for the workspace of the auth user"
              }
            },
            required: ["id"]
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total count (typically 1 for single user)"
              },
              data: {
                type: "object",
                required: ["account", "role", "status", "userName"],
                properties: {
                  id: { 
                    type: "string", 
                    format: "uuid",
                    description: "User UUID" 
                  },
                  account: { 
                    type: "object", 
                    description: "Account object" 
                  },
                  userName: { 
                    type: "string", 
                    format: "email",
                    minLength: 6,
                    maxLength: 256,
                    description: "Username (email format)" 
                  },
                  technicalUserName: { 
                    type: "string", 
                    minLength: 1,
                    maxLength: 256,
                    description: "Technical username" 
                  },
                  email: { 
                    type: "string", 
                    format: "email",
                    minLength: 2,
                    maxLength: 256,
                    description: "User email" 
                  },
                  technicalUserEmail: { 
                    type: "string", 
                    minLength: 0,
                    maxLength: 256,
                    description: "Technical user email" 
                  },
                  firstName: { 
                    type: "string", 
                    minLength: 1,
                    maxLength: 128,
                    description: "First name" 
                  },
                  lastName: { 
                    type: "string", 
                    minLength: 1,
                    maxLength: 128,
                    description: "Last name" 
                  },
                  department: { 
                    type: "string", 
                    description: "Department" 
                  },
                  lastLogin: { 
                    type: "string", 
                    format: "date-time",
                    description: "Last login timestamp" 
                  },
                  currentLogin: { 
                    type: "string", 
                    format: "date-time",
                    description: "Current login timestamp" 
                  },
                  role: { 
                    type: "string", 
                    enum: ["SUPERADMIN", "SYSTEM", "APICLIENT", "ACCOUNTADMIN", "ACCOUNTUSER", "TOKEN_EXCHANGE_CLIENT"],
                    description: "User role" 
                  },
                  status: { 
                    type: "string", 
                    enum: ["ACTIVE", "ARCHIVED"],
                    description: "User status" 
                  },
                  crmTags: { 
                    type: "string", 
                    description: "CRM tags" 
                  },
                  crmLink: { 
                    type: "string", 
                    description: "CRM link" 
                  },
                  technicalUser: { 
                    type: "boolean", 
                    description: "Whether user is a technical user" 
                  },
                  scimManaged: { 
                    type: "boolean", 
                    description: "Whether user is SCIM managed" 
                  },
                  transientUser: { 
                    type: "boolean", 
                    description: "Whether user is transient" 
                  },
                  permissions: { 
                    type: "array", 
                    items: { type: "object" },
                    description: "Array of permission objects" 
                  },
                  replayed: { 
                    type: "boolean", 
                    description: "Whether user was replayed" 
                  },
                  active: { 
                    type: "boolean", 
                    description: "Whether user is active" 
                  },
                  displayName: { 
                    type: "string", 
                    description: "Display name" 
                  },
                  links: { 
                    type: "array", 
                    items: { type: "object" },
                    description: "Related links" 
                  }
                },
                description: "User object"
              }
            }
          }
        },
        {
          name: "get_permissions",
          description: "List user permissions with extensive filtering and pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              userId: { 
                type: "string",
                description: "User UUID"
              },
              workspaceId: { 
                type: "string",
                description: "Workspace UUID"
              },
              q: { 
                type: "string",
                description: "Query string to search the related user"
              },
              email: { 
                type: "string",
                description: "Email to search for, may also be a comma separated list of emails"
              },
              status: { 
                type: "string",
                description: "Optional status to search for"
              },
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 50, max 100)",
                default: 50
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: ""
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of permissions matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["role", "status", "user", "workspace"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Permission UUID" 
                    },
                    workspaceId: { 
                      type: "string", 
                      format: "uuid",
                      description: "Workspace UUID" 
                    },
                    role: { 
                      type: "string", 
                      enum: ["ADMIN", "MEMBER", "VIEWER", "CONTACT", "SYSTEM_READ", "SYSTEM_WRITE", "SYSTEM_AS_USER", "TRANSIENT"],
                      description: "Permission role" 
                    },
                    status: { 
                      type: "string", 
                      enum: ["NOTINVITED", "ACTIVE", "ARCHIVED", "INVITED", "REQUESTED", "ANONYMIZED"],
                      description: "Permission status" 
                    },
                    user: { 
                      type: "object", 
                      description: "User object associated with this permission" 
                    },
                    workspace: { 
                      type: "object", 
                      description: "Workspace object associated with this permission" 
                    },
                    lastLogin: { 
                      type: "string", 
                      format: "date-time",
                      description: "Last login timestamp" 
                    },
                    invitedByUser: { 
                      type: "object", 
                      description: "User who invited this permission" 
                    },
                    reviewedByUser: { 
                      type: "object", 
                      description: "User who reviewed this permission" 
                    },
                    customerRoles: { 
                      type: "string", 
                      description: "Customer roles" 
                    },
                    accessControlEntities: { 
                      type: "string", 
                      description: "Access control entities" 
                    },
                    ignoreBlacklist: { 
                      type: "boolean", 
                      description: "Whether to ignore blacklist" 
                    },
                    count: { 
                      type: "number", 
                      format: "int64",
                      description: "Count value" 
                    },
                    replayed: { 
                      type: "boolean", 
                      description: "Whether permission was replayed" 
                    },
                    active: { 
                      type: "boolean", 
                      description: "Whether permission is active" 
                    },
                    links: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Related links" 
                    }
                  }
                },
                description: "Array of permission objects"
              }
            }
          }
        },
        {
          name: "get_permission",
          description: "Retrieve a single permission by its UUID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { 
                type: "string",
                description: "Permission UUID"
              }
            },
            required: ["id"]
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total count (typically 1 for single permission)"
              },
              data: {
                type: "object",
                required: ["role", "status", "user", "workspace"],
                properties: {
                  id: { 
                    type: "string", 
                    format: "uuid",
                    description: "Permission UUID" 
                  },
                  workspaceId: { 
                    type: "string", 
                    format: "uuid",
                    description: "Workspace UUID" 
                  },
                  role: { 
                    type: "string", 
                    enum: ["ADMIN", "MEMBER", "VIEWER", "CONTACT", "SYSTEM_READ", "SYSTEM_WRITE", "SYSTEM_AS_USER", "TRANSIENT"],
                    description: "Permission role" 
                  },
                  status: { 
                    type: "string", 
                    enum: ["NOTINVITED", "ACTIVE", "ARCHIVED", "INVITED", "REQUESTED", "ANONYMIZED"],
                    description: "Permission status" 
                  },
                  user: { 
                    type: "object", 
                    description: "User object associated with this permission" 
                  },
                  workspace: { 
                    type: "object", 
                    description: "Workspace object associated with this permission" 
                  },
                  lastLogin: { 
                    type: "string", 
                    format: "date-time",
                    description: "Last login timestamp" 
                  },
                  invitedByUser: { 
                    type: "object", 
                    description: "User who invited this permission" 
                  },
                  reviewedByUser: { 
                    type: "object", 
                    description: "User who reviewed this permission" 
                  },
                  customerRoles: { 
                    type: "string", 
                    description: "Customer roles" 
                  },
                  accessControlEntities: { 
                    type: "string", 
                    description: "Access control entities" 
                  },
                  ignoreBlacklist: { 
                    type: "boolean", 
                    description: "Whether to ignore blacklist" 
                  },
                  count: { 
                    type: "number", 
                    format: "int64",
                    description: "Count value" 
                  },
                  replayed: { 
                    type: "boolean", 
                    description: "Whether permission was replayed" 
                  },
                  active: { 
                    type: "boolean", 
                    description: "Whether permission is active" 
                  },
                  links: { 
                    type: "array", 
                    items: { type: "object" },
                    description: "Related links" 
                  }
                },
                description: "Permission object"
              }
            }
          }
        },
        {
          name: "get_contracts",
          description: "List all contracts with search and pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              q: { 
                type: "string",
                description: "Search for account, type or status"
              },
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 30, max 100)",
                default: 30
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: ""
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of contracts matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["application", "featureBundleId", "status", "type"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Contract UUID" 
                    },
                    featureBundleId: { 
                      type: "string", 
                      minLength: 3,
                      maxLength: 64,
                      description: "Feature bundle ID" 
                    },
                    startDate: { 
                      type: "string", 
                      format: "date-time",
                      description: "Contract start date" 
                    },
                    endDate: { 
                      type: "string", 
                      format: "date-time",
                      description: "Contract end date" 
                    },
                    type: { 
                      type: "string", 
                      enum: ["REGULAR", "TRIAL"],
                      description: "Contract type" 
                    },
                    status: { 
                      type: "string", 
                      enum: ["ACTIVE", "BLOCKED"],
                      description: "Contract status" 
                    },
                    comment: { 
                      type: "string", 
                      description: "Comment" 
                    },
                    account: { 
                      type: "object", 
                      description: "Account object" 
                    },
                    application: { 
                      type: "object", 
                      description: "Application object" 
                    },
                    active: { 
                      type: "boolean", 
                      description: "Whether contract is active" 
                    },
                    displayName: { 
                      type: "string", 
                      description: "Display name" 
                    },
                    links: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Related links" 
                    }
                  }
                },
                description: "Array of contract objects"
              }
            }
          }
        },
        {
          name: "get_contract",
          description: "Retrieve a single contract by its UUID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { 
                type: "string",
                description: "Contract UUID"
              }
            },
            required: ["id"]
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total count (typically 1 for single contract)"
              },
              data: {
                type: "object",
                required: ["application", "featureBundleId", "status", "type"],
                properties: {
                  id: { 
                    type: "string", 
                    format: "uuid",
                    description: "Contract UUID" 
                  },
                  featureBundleId: { 
                    type: "string", 
                    minLength: 3,
                    maxLength: 64,
                    description: "Feature bundle ID" 
                  },
                  startDate: { 
                    type: "string", 
                    format: "date-time",
                    description: "Contract start date" 
                  },
                  endDate: { 
                    type: "string", 
                    format: "date-time",
                    description: "Contract end date" 
                  },
                  type: { 
                    type: "string", 
                    enum: ["REGULAR", "TRIAL"],
                    description: "Contract type" 
                  },
                  status: { 
                    type: "string", 
                    enum: ["ACTIVE", "BLOCKED"],
                    description: "Contract status" 
                  },
                  comment: { 
                    type: "string", 
                    description: "Comment" 
                  },
                  account: { 
                    type: "object", 
                    description: "Account object" 
                  },
                  application: { 
                    type: "object", 
                    description: "Application object" 
                  },
                  active: { 
                    type: "boolean", 
                    description: "Whether contract is active" 
                  },
                  displayName: { 
                    type: "string", 
                    description: "Display name" 
                  },
                  links: { 
                    type: "array", 
                    items: { type: "object" },
                    description: "Related links" 
                  }
                },
                description: "Contract object"
              }
            }
          }
        },
        {
          name: "get_instances",
          description: "List all instances with filtering and pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              q: { 
                type: "string",
                description: "A part of the name or URL to search for"
              },
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 30, max 100)",
                default: 30
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: ""
              },
              application: { 
                type: "string",
                description: "Comma separated list of application names"
              },
              url: { 
                type: "string",
                description: "URL"
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of instances matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["application", "name", "url"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Instance UUID" 
                    },
                    name: { 
                      type: "string", 
                      minLength: 2,
                      maxLength: 64,
                      description: "Instance name" 
                    },
                    url: { 
                      type: "string", 
                      minLength: 4,
                      maxLength: 256,
                      description: "Instance URL" 
                    },
                    identityManagement: { 
                      type: "string", 
                      enum: ["FULLY_EXTERNAL", "MTM_BASED_ROLES", "FULLY_MTM_BASED"],
                      description: "Identity management type" 
                    },
                    isDefault: { 
                      type: "boolean", 
                      description: "Whether instance is default" 
                    },
                    isPrimary: { 
                      type: "boolean", 
                      description: "Whether instance is primary" 
                    },
                    entityId: { 
                      type: "string", 
                      minLength: 4,
                      maxLength: 255,
                      description: "Entity ID" 
                    },
                    application: { 
                      type: "object", 
                      description: "Application object" 
                    },
                    account: { 
                      type: "object", 
                      description: "Account object" 
                    },
                    identityProvider: { 
                      type: "object", 
                      description: "Identity provider object" 
                    },
                    type: { 
                      type: "string", 
                      enum: ["DEMO", "PROD"],
                      description: "Instance type" 
                    },
                    prodPreferred: { 
                      type: "boolean", 
                      description: "Whether production is preferred" 
                    },
                    demoPreferred: { 
                      type: "boolean", 
                      description: "Whether demo is preferred" 
                    },
                    thirdParty: { 
                      type: "boolean", 
                      description: "Whether instance is third party" 
                    },
                    links: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Related links" 
                    }
                  }
                },
                description: "Array of instance objects"
              }
            }
          }
        },
        {
          name: "get_events",
          description: "Retrieve all events for the requesting user with pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              since: { 
                type: "string",
                description: "ISO 8601 formatted date to fetch events from"
              },
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 100, max 100)",
                default: 100
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: ""
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of events matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["actor", "type"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Event UUID" 
                    },
                    type: { 
                      type: "string", 
                      enum: ["TEST_EVENT", "APITOKEN_CREATE", "APITOKEN_UPDATE", "APITOKEN_DELETE", "ACCOUNT_CREATE", "ACCOUNT_UPDATE", "ACCOUNT_DELETE", "CONTRACT_CREATE", "CONTRACT_UPDATE", "CONTRACT_DELETE", "WORKSPACE_CREATE", "WORKSPACE_UPDATE", "WORKSPACE_DELETE", "WORKSPACE_INITIALIZE", "TECHNICAL_USER_ARCHIVE_PERMISSION", "USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_WELCOME", "USER_WELCOME_SSO", "USER_LOGIN", "USER_LOGIN_FAILED", "USER_ACCESS_WORKSPACE", "USER_PERMISSION_CREATE", "USER_PERMISSION_UPDATE", "USER_ACTIVATE", "USER_INVITE", "USER_INVITE_CONFIRM", "USER_INVITE_REJECT", "USER_INVITE_APPROVE", "USER_INVITE_REMIND", "USER_PASSWORD_CREATE", "USER_PASSWORD_UPDATE", "USER_PASSWORD_RESET", "DOMAIN_UPDATE", "DOMAIN_DELETE", "WORKSPACE_STATISTICS", "INSTANCE_DELETE", "IDENTITY_PROVIDER_DELETE", "DAILY_SCIM_STATISTICS_CALCULATED", "USER_MAILJET_DELETE_FAILURE", "USER_MAILJET_DELETE_SUCCESS"],
                      description: "Event type" 
                    },
                    application: { 
                      type: "string", 
                      description: "Application name" 
                    },
                    version: { 
                      type: "string", 
                      description: "Version" 
                    },
                    status: { 
                      type: "string", 
                      enum: ["STARTED", "FINISHED"],
                      description: "Event status" 
                    },
                    createdAt: { 
                      type: "string", 
                      format: "date-time",
                      description: "Creation timestamp" 
                    },
                    finishedAt: { 
                      type: "string", 
                      format: "date-time",
                      description: "Finished timestamp" 
                    },
                    actor: { 
                      type: "object", 
                      description: "Actor user object" 
                    },
                    account: { 
                      type: "object", 
                      description: "Account object" 
                    },
                    user: { 
                      type: "object", 
                      description: "User object" 
                    },
                    workspace: { 
                      type: "object", 
                      description: "Workspace object" 
                    },
                    contract: { 
                      type: "object", 
                      description: "Contract object" 
                    },
                    instance: { 
                      type: "object", 
                      description: "Instance object" 
                    },
                    identityProvider: { 
                      type: "object", 
                      description: "Identity provider object" 
                    },
                    payload: { 
                      type: "object", 
                      additionalProperties: { type: "object" },
                      description: "Event payload data" 
                    },
                    links: { 
                      type: "array", 
                      items: { type: "object" },
                      description: "Related links" 
                    }
                  }
                },
                description: "Array of event objects"
              }
            }
          }
        },
        {
          name: "get_technical_users",
          description: "List or search all technical users with pagination support.",
          inputSchema: {
            type: "object",
            properties: {
              page: { 
                type: "number",
                description: "The page number to access (1 indexed, defaults to 1)",
                default: 1
              },
              size: { 
                type: "number",
                description: "The page size requested (defaults to 30, max 100)",
                default: 30
              },
              queryUserName: { 
                type: "string",
                description: "Search in technical user name (optional)"
              },
              sort: { 
                type: "string",
                description: "Comma-separated list of sorting (optional)",
                default: "userName-ASC"
              },
              workspaceId: { 
                type: "string",
                description: "The id of the workspace the technical user belong to"
              }
            }
          },
          outputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["OK", "ERROR"],
                description: "Response status"
              },
              type: {
                type: "string",
                description: "Response type"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  description: "API error details"
                },
                description: "Array of errors if status is ERROR"
              },
              total: {
                type: "number",
                format: "int64",
                description: "Total number of technical users matching the query"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  required: ["permissionRole", "userName", "workspaceId"],
                  properties: {
                    id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Technical user UUID" 
                    },
                    userName: { 
                      type: "string", 
                      description: "Username" 
                    },
                    email: { 
                      type: "string", 
                      description: "Email address" 
                    },
                    permissionRole: { 
                      type: "string", 
                      enum: ["ADMIN", "MEMBER", "VIEWER", "CONTACT", "SYSTEM_READ", "SYSTEM_WRITE", "SYSTEM_AS_USER", "TRANSIENT"],
                      description: "Permission role" 
                    },
                    customerRoles: { 
                      type: "string", 
                      description: "Customer roles" 
                    },
                    accessControlEntities: { 
                      type: "string", 
                      description: "Access control entities" 
                    },
                    apiTokenData: { 
                      type: "object", 
                      properties: {
                        id: { type: "string", format: "uuid" },
                        token: { type: "string" },
                        description: { type: "string" },
                        expiry: { type: "object" }
                      },
                      description: "API token data" 
                    },
                    accountId: { 
                      type: "string", 
                      format: "uuid",
                      description: "Account UUID" 
                    },
                    workspaceId: { 
                      type: "string", 
                      format: "uuid",
                      description: "Workspace UUID" 
                    }
                  }
                },
                description: "Array of technical user objects"
              }
            }
          }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const name = req.params.name;
    const args = (req.params.arguments as any) ?? {};

    try {
      if (name === "get_accounts") {
        const result = await getAccountsTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_account") {
        const result = await getAccountTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_workspaces") {
        const result = await getWorkspacesTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_workspace") {
        const result = await getWorkspaceTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_users") {
        const result = await getUsersTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_user") {
        const result = await getUserTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_permissions") {
        const result = await getPermissionsTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_permission") {
        const result = await getPermissionTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_contracts") {
        const result = await getContractsTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_contract") {
        const result = await getContractTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_instances") {
        const result = await getInstancesTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_events") {
        const result = await getEventsTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }
      if (name === "get_technical_users") {
        const result = await getTechnicalUsersTool(leanix, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
      }

      throw new Error(`Unknown tool: ${name}`);
    } catch (err: any) {
      return { content: [{ type: "text", text: `Error: ${err.message || String(err)}` }] } as any;
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

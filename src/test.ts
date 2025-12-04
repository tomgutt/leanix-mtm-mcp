import { leanixClient } from "./leanix/client.js";

async function main() {
    // get leanix client
    const leanix = await leanixClient;
    const decodedAccessToken = leanix.getDecodedAccessToken();
    console.log("Decoded access token:", decodedAccessToken);

    try {
        // Get user details for tom.guttermann@leanix.net
        const email = "tom.guttermann@leanix.net";
        console.log(`Fetching user details for: ${email}`);
        
        const response = await leanix.get(`/services/mtm/v1/users?email=${encodeURIComponent(email)}`);
        
        console.log("User details:");
        console.log(JSON.stringify(response, null, 2));
    } catch (error: any) {
        console.error("Error fetching user details:", error.message);
    }
}

main();

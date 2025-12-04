import { leanixClient } from "./leanix/client.js";
import { getLabelsByWorkspaceTool } from "./tools/getLabelsByWorkspace.js";
import { getTechnicalUsersTool } from "./tools/getTechnicalUsers.js";
import { getUsersTool } from "./tools/getUsers.js";

async function main() {
    // get leanix client
    const leanix = await leanixClient;
    const decodedAccessToken = leanix.getDecodedAccessToken();
    console.log("Decoded access token:", decodedAccessToken);

    try {
        // Get user details for tom.guttermann@leanix.net
        const email = "tom.guttermann@leanix.net";
        console.log(`Fetching user details for: ${email}`);
        
        const getUsersResponse = await getUsersTool(leanix, { email });
        
        console.log("User details:");
        //console.log(JSON.stringify(response, null, 2));

        // Get technical users for workspace
        const workspaceId = "32a3fd1a-cf74-4390-8143-e0b4c9807472";
        const technicalUsersResponse = await getTechnicalUsersTool(leanix, { workspaceId });
        console.log("Technical users:");
        console.log(JSON.stringify(technicalUsersResponse, null, 2));

        // Get labels for workspace
        const labelsResponse = await getLabelsByWorkspaceTool(leanix, { workspaceId });
        console.log("Labels:");
        console.log(JSON.stringify(labelsResponse, null, 2));
    } catch (error: any) {
        console.error("Error fetching user details:", error.message);
    }
}

main();

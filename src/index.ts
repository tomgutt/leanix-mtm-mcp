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
  const leanix = await leanixClient;

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

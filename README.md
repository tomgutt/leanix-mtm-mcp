## LeanIX MTM MCP Server

Integrate the LeanIX Multi-Tenant Management (MTM) API into agentic workflows via MCP.

## Tools

This MCP server provides 13 read-only tools for accessing LeanIX MTM data:

### Account Management
1. `get_accounts` - List or search all accounts with pagination
2. `get_account` - Retrieve a single account by UUID

### Workspace Management
3. `get_workspaces` - List workspaces with filtering (features, labels) and pagination
4. `get_workspace` - Retrieve a single workspace by UUID

### User Management
5. `get_users` - List or search all users with pagination
6. `get_user` - Retrieve a single user by UUID

### Permission Management
7. `get_permissions` - List user permissions with extensive filtering and pagination
8. `get_permission` - Retrieve a single permission by UUID

### Contract Management
9. `get_contracts` - List all contracts with search and pagination
10. `get_contract` - Retrieve a single contract by UUID

### Instance Management
11. `get_instances` - List all instances with filtering and pagination

### Event Management
12. `get_events` - Retrieve all events with date filtering and pagination

### Technical User Management
13. `get_technical_users` - List or search all technical users with pagination

## Setup

### API Token

Create a LeanIX API token for authentication.

Required environment variables (can be set in your shell or a `.env` file):

- `LEANIX_TOKEN` - Your LeanIX API token
- `LEANIX_INSTANCE` - Your LeanIX instance (e.g., 'app', 'demo-eu-1', defaults to 'app')

Example `.env`:

```ini
LEANIX_TOKEN=your-api-token-here
LEANIX_INSTANCE=app
```

## Usage with Claude Desktop

To use this with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "leanix-mtm": {
      "command": "node",
      "args": [
        "-y",
        "leanix-mtm-mcp"
      ],
      "env": {
        "LEANIX_TOKEN": "your-api-token-here",
        "LEANIX_INSTANCE": "eu-8"
      }
    }
  }
}
```

## Run locally

Build:

```bash
npm run build
```

Use the mcp inspector:

```bash
npm run inspector
```

## Features

- ✅ Read-only operations (no data modifications)
- ✅ Comprehensive pagination support
- ✅ Extensive filtering options
- ✅ OAuth 2.0 authentication with automatic token refresh
- ✅ Proper error handling
- ✅ TypeScript support

## License

This MCP server is licensed under the MIT License. See `LICENSE` for details.

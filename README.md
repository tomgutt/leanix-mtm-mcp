## LeanIX MTM MCP Server

Integrate the LeanIX Multi-Tenant Management (MTM) API into agentic workflows via MCP.

## Tools

This MCP server provides 29 read-only tools for accessing LeanIX MTM data:

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
12. `get_instance` - Retrieve a single instance by UUID

### Event Management
13. `get_account_events` - Retrieve all events for a specific account with date filtering and pagination
14. `get_workspace_events` - Retrieve all events for a specific workspace with date filtering, event type filter, and pagination
15. `get_contract_events` - Retrieve all events for a specific contract with date filtering and pagination
16. `get_user_events` - Retrieve all events for a specific user with date filtering and pagination
17. `get_instance_events` - Retrieve all events for a specific instance with date filtering and pagination
18. `get_identity_provider_events` - Retrieve all events for a specific identity provider with date filtering and pagination
19. `get_event` - Retrieve a single event by UUID

### Technical User Management
20. `get_technical_users` - List or search all technical users with pagination
21. `get_technical_user` - Retrieve a single technical user by UUID

### Domain Management
22. `get_domains` - List all domains with filtering (FQDN, instance) and pagination
23. `get_domain` - Retrieve a single domain by UUID

### Identity Provider Management
24. `get_identity_providers` - List all identity providers with filtering and pagination
25. `get_identity_provider` - Retrieve a single identity provider by UUID

### Custom Feature Management
26. `get_custom_features` - List all custom features filtered by contract or workspace
27. `get_custom_feature` - Retrieve a single custom feature by UUID

### Label Management
28. `get_labels` - Get all labels (optionally filtered by name)
29. `get_labels_by_workspace` - Get all labels attached to a specific workspace

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
      "command": "npx",
      "args": [
        "-y",
        "leanix-mtm-mcp@latest"
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

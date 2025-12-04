import type { LeanIXClient } from "../leanix/client.js";

export type GetWorkspaceParams = {
  workspace_id: string;
};

export async function getWorkspaceTool(leanix: LeanIXClient, params: GetWorkspaceParams) {
  const { workspace_id } = params;
  if (!workspace_id) throw new Error("workspace_id is required");

  const result = await leanix.get(`/services/mtm/v1/workspaces/${workspace_id}`);
  return result;
}

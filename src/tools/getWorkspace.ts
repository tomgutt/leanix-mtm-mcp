import type { LeanIXClient } from "../leanix/client.js";

export type GetWorkspaceParams = {
  id: string;
};

export async function getWorkspaceTool(leanix: LeanIXClient, params: GetWorkspaceParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/workspaces/${id}`);
  return result;
}

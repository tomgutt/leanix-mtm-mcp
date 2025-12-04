import type { LeanIXClient } from "../leanix/client.js";

export type GetLabelsByWorkspaceParams = {
  workspaceId: string;
};

export async function getLabelsByWorkspaceTool(leanix: LeanIXClient, params: GetLabelsByWorkspaceParams) {
  const { workspaceId } = params;
  if (!workspaceId) throw new Error("workspaceId is required");

  const result = await leanix.get(`/services/mtm/v1/labels/workspaces/${workspaceId}/labels`);
  return result;
}


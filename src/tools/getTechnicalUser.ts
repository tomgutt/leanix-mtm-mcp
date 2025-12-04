import type { LeanIXClient } from "../leanix/client.js";

export type GetTechnicalUserParams = {
  id: string;
  workspaceId?: string;
};

export async function getTechnicalUserTool(leanix: LeanIXClient, params: GetTechnicalUserParams) {
  const { id, workspaceId } = params;
  if (!id) throw new Error("id is required");

  const queryParams = new URLSearchParams();
  if (workspaceId) queryParams.append("workspaceId", workspaceId);

  const endpoint = `/services/mtm/v1/technicalusers/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);
  return result;
}


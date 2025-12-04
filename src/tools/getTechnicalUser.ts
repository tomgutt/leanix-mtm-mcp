import type { LeanIXClient } from "../leanix/client.js";

export type GetTechnicalUserParams = {
  technical_user_id: string;
  workspaceId?: string;
};

export async function getTechnicalUserTool(leanix: LeanIXClient, params: GetTechnicalUserParams) {
  const { technical_user_id, workspaceId } = params;
  if (!technical_user_id) throw new Error("technical_user_id is required");

  const queryParams = new URLSearchParams();
  if (workspaceId) queryParams.append("workspaceId", workspaceId);

  const endpoint = `/services/mtm/v1/technicalusers/${technical_user_id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);
  return result;
}


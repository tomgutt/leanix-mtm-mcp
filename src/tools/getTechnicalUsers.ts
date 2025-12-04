import type { LeanIXClient } from "../leanix/client.js";

export type GetTechnicalUsersParams = {
  page?: number;
  size?: number;
  queryUserName?: string;
  sort?: string;
  workspaceId?: string;
};

export async function getTechnicalUsersTool(leanix: LeanIXClient, params: GetTechnicalUsersParams) {
  const queryParams = new URLSearchParams();
  
  // Include default values as per OpenAPI spec
  queryParams.append("page", (params.page ?? 1).toString());
  queryParams.append("size", (params.size ?? 30).toString());
  if (params.queryUserName) queryParams.append("queryUserName", params.queryUserName);
  queryParams.append("sort", params.sort ?? "userName-ASC");
  if (params.workspaceId) queryParams.append("workspaceId", params.workspaceId);

  const endpoint = `/services/mtm/v1/technicalusers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

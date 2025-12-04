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
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.queryUserName) queryParams.append("queryUserName", params.queryUserName);
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.workspaceId) queryParams.append("workspaceId", params.workspaceId);

  const endpoint = `/services/mtm/v1/technicalUsers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

import type { LeanIXClient } from "../leanix/client.js";

export type GetPermissionsParams = {
  userId?: string;
  workspaceId?: string;
  q?: string;
  email?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getPermissionsTool(leanix: LeanIXClient, params: GetPermissionsParams) {
  const queryParams = new URLSearchParams();
  
  if (params.userId) queryParams.append("userId", params.userId);
  if (params.workspaceId) queryParams.append("workspaceId", params.workspaceId);
  if (params.q) queryParams.append("q", params.q);
  if (params.email) queryParams.append("email", params.email);
  if (params.status) queryParams.append("status", params.status);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/permissions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

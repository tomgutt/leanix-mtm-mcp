import type { LeanIXClient } from "../leanix/client.js";

export type GetUsersParams = {
  email?: string;
  userName?: string;
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getUsersTool(leanix: LeanIXClient, params: GetUsersParams) {
  const queryParams = new URLSearchParams();
  
  if (params.email) queryParams.append("email", params.email);
  if (params.userName) queryParams.append("userName", params.userName);
  if (params.q) queryParams.append("q", params.q);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

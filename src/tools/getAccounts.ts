import type { LeanIXClient } from "../leanix/client.js";

export type GetAccountsParams = {
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getAccountsTool(leanix: LeanIXClient, params: GetAccountsParams) {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append("q", params.q);
  queryParams.append("page", (params.page ?? 1).toString());
  queryParams.append("size", (params.size ?? 30).toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

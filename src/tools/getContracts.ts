import type { LeanIXClient } from "../leanix/client.js";

export type GetContractsParams = {
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getContractsTool(leanix: LeanIXClient, params: GetContractsParams) {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append("q", params.q);
  queryParams.append("page", (params.page ?? 1).toString());
  queryParams.append("size", (params.size ?? 30).toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/contracts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

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
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/contracts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

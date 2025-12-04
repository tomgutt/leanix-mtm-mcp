import type { LeanIXClient } from "../leanix/client.js";

export type GetInstancesParams = {
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
  application?: string;
  url?: string;
};

export async function getInstancesTool(leanix: LeanIXClient, params: GetInstancesParams) {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append("q", params.q);
  queryParams.append("page", (params.page ?? 1).toString());
  queryParams.append("size", (params.size ?? 30).toString());
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.application) queryParams.append("application", params.application);
  if (params.url) queryParams.append("url", params.url);

  const endpoint = `/services/mtm/v1/instances${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

import type { LeanIXClient } from "../leanix/client.js";

export type GetDomainsParams = {
  q?: string;
  FQDN?: string;
  instance?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getDomainsTool(leanix: LeanIXClient, params: GetDomainsParams) {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append("q", params.q);
  if (params.FQDN) queryParams.append("FQDN", params.FQDN);
  if (params.instance) queryParams.append("instance", params.instance);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/domains${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


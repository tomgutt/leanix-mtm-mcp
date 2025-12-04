import type { LeanIXClient } from "../leanix/client.js";

export type GetCustomFeaturesParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export async function getCustomFeaturesTool(leanix: LeanIXClient, params: GetCustomFeaturesParams) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/customFeatures${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


import type { LeanIXClient } from "../leanix/client.js";

export type GetLabelsParams = {
  name?: string;
};

export async function getLabelsTool(leanix: LeanIXClient, params: GetLabelsParams) {
  const queryParams = new URLSearchParams();
  
  if (params.name) queryParams.append("name", params.name);

  const endpoint = `/services/mtm/v1/labels${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


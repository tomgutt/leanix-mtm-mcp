import type { LeanIXClient } from "../leanix/client.js";

export type GetCustomFeaturesParams = {
  contractId?: string;
  workspaceId?: string;
};

export async function getCustomFeaturesTool(leanix: LeanIXClient, params: GetCustomFeaturesParams) {
  const queryParams = new URLSearchParams();
  
  if (params.contractId) queryParams.append("contractId", params.contractId);
  if (params.workspaceId) queryParams.append("workspaceId", params.workspaceId);

  const endpoint = `/services/mtm/v1/customFeatures${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


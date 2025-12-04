import type { LeanIXClient } from "../leanix/client.js";

export type GetCustomFeatureParams = {
  custom_feature_id: string;
};

export async function getCustomFeatureTool(leanix: LeanIXClient, params: GetCustomFeatureParams) {
  const { custom_feature_id } = params;
  if (!custom_feature_id) throw new Error("custom_feature_id is required");

  const result = await leanix.get(`/services/mtm/v1/customFeatures/${custom_feature_id}`);
  return result;
}


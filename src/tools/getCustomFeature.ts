import type { LeanIXClient } from "../leanix/client.js";

export type GetCustomFeatureParams = {
  id: string;
};

export async function getCustomFeatureTool(leanix: LeanIXClient, params: GetCustomFeatureParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/customFeatures/${id}`);
  return result;
}


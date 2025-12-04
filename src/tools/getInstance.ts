import type { LeanIXClient } from "../leanix/client.js";

export type GetInstanceParams = {
  id: string;
};

export async function getInstanceTool(leanix: LeanIXClient, params: GetInstanceParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/instances/${id}`);
  return result;
}


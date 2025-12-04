import type { LeanIXClient } from "../leanix/client.js";

export type GetInstanceParams = {
  instance_id: string;
};

export async function getInstanceTool(leanix: LeanIXClient, params: GetInstanceParams) {
  const { instance_id } = params;
  if (!instance_id) throw new Error("instance_id is required");

  const result = await leanix.get(`/services/mtm/v1/instances/${instance_id}`);
  return result;
}


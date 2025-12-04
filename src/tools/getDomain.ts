import type { LeanIXClient } from "../leanix/client.js";

export type GetDomainParams = {
  id: string;
};

export async function getDomainTool(leanix: LeanIXClient, params: GetDomainParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/domains/${id}`);
  return result;
}


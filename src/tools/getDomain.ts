import type { LeanIXClient } from "../leanix/client.js";

export type GetDomainParams = {
  domain_id: string;
};

export async function getDomainTool(leanix: LeanIXClient, params: GetDomainParams) {
  const { domain_id } = params;
  if (!domain_id) throw new Error("domain_id is required");

  const result = await leanix.get(`/services/mtm/v1/domains/${domain_id}`);
  return result;
}


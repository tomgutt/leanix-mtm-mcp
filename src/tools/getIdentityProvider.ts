import type { LeanIXClient } from "../leanix/client.js";

export type GetIdentityProviderParams = {
  identity_provider_id: string;
};

export async function getIdentityProviderTool(leanix: LeanIXClient, params: GetIdentityProviderParams) {
  const { identity_provider_id } = params;
  if (!identity_provider_id) throw new Error("identity_provider_id is required");

  const result = await leanix.get(`/services/mtm/v1/identityProviders/${identity_provider_id}`);
  return result;
}


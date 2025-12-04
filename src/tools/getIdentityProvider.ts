import type { LeanIXClient } from "../leanix/client.js";

export type GetIdentityProviderParams = {
  id: string;
};

export async function getIdentityProviderTool(leanix: LeanIXClient, params: GetIdentityProviderParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/identityProviders/${id}`);
  return result;
}


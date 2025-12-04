import type { LeanIXClient } from "../leanix/client.js";

export type GetIdentityProviderEventsParams = {
  identity_provider_id: string;
  since?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getIdentityProviderEventsTool(leanix: LeanIXClient, params: GetIdentityProviderEventsParams) {
  const { identity_provider_id, since, page, size, sort } = params;
  if (!identity_provider_id) throw new Error("identity_provider_id is required");

  const queryParams = new URLSearchParams();
  if (since) queryParams.append("since", since);
  queryParams.append("page", (page ?? 1).toString());
  queryParams.append("size", (size ?? 100).toString());
  if (sort) queryParams.append("sort", sort);

  const endpoint = `/services/mtm/v1/identityProviders/${identity_provider_id}/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


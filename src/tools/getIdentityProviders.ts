import type { LeanIXClient } from "../leanix/client.js";

export type GetIdentityProvidersParams = {
  q?: string;
  entityID?: string;
  accountID?: string;
  serviceProvider?: string;
  idmType?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getIdentityProvidersTool(leanix: LeanIXClient, params: GetIdentityProvidersParams) {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append("q", params.q);
  if (params.entityID) queryParams.append("entityID", params.entityID);
  if (params.accountID) queryParams.append("accountID", params.accountID);
  if (params.serviceProvider) queryParams.append("serviceProvider", params.serviceProvider);
  if (params.idmType) queryParams.append("idmType", params.idmType);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/identityProviders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


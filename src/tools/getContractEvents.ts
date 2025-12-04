import type { LeanIXClient } from "../leanix/client.js";

export type GetContractEventsParams = {
  contract_id: string;
  since?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getContractEventsTool(leanix: LeanIXClient, params: GetContractEventsParams) {
  const { contract_id, since, page, size, sort } = params;
  if (!contract_id) throw new Error("contract_id is required");

  const queryParams = new URLSearchParams();
  if (since) queryParams.append("since", since);
  queryParams.append("page", (page ?? 1).toString());
  queryParams.append("size", (size ?? 100).toString());
  if (sort) queryParams.append("sort", sort);

  const endpoint = `/services/mtm/v1/contracts/${contract_id}/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


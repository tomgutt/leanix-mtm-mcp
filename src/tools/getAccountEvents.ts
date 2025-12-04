import type { LeanIXClient } from "../leanix/client.js";

export type GetAccountEventsParams = {
  account_id: string;
  since?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getAccountEventsTool(leanix: LeanIXClient, params: GetAccountEventsParams) {
  const { account_id, since, page, size, sort } = params;
  if (!account_id) throw new Error("account_id is required");

  const queryParams = new URLSearchParams();
  if (since) queryParams.append("since", since);
  queryParams.append("page", (page ?? 1).toString());
  queryParams.append("size", (size ?? 100).toString());
  if (sort) queryParams.append("sort", sort);

  const endpoint = `/services/mtm/v1/accounts/${account_id}/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


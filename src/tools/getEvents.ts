import type { LeanIXClient } from "../leanix/client.js";

export type GetEventsParams = {
  since?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getEventsTool(leanix: LeanIXClient, params: GetEventsParams) {
  const queryParams = new URLSearchParams();
  
  if (params.since) queryParams.append("since", params.since);
  queryParams.append("page", (params.page ?? 1).toString());
  queryParams.append("size", (params.size ?? 100).toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

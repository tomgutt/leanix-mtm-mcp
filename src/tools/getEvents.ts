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
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  const endpoint = `/services/mtm/v1/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

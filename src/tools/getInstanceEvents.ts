import type { LeanIXClient } from "../leanix/client.js";

export type GetInstanceEventsParams = {
  instance_id: string;
  since?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getInstanceEventsTool(leanix: LeanIXClient, params: GetInstanceEventsParams) {
  const { instance_id, since, page, size, sort } = params;
  if (!instance_id) throw new Error("instance_id is required");

  const queryParams = new URLSearchParams();
  if (since) queryParams.append("since", since);
  queryParams.append("page", (page ?? 1).toString());
  queryParams.append("size", (size ?? 100).toString());
  if (sort) queryParams.append("sort", sort);

  const endpoint = `/services/mtm/v1/instances/${instance_id}/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


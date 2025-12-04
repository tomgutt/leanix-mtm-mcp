import type { LeanIXClient } from "../leanix/client.js";

export type GetUserEventsParams = {
  user_id: string;
  since?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function getUserEventsTool(leanix: LeanIXClient, params: GetUserEventsParams) {
  const { user_id, since, page, size, sort } = params;
  if (!user_id) throw new Error("user_id is required");

  const queryParams = new URLSearchParams();
  if (since) queryParams.append("since", since);
  queryParams.append("page", (page ?? 1).toString());
  queryParams.append("size", (size ?? 100).toString());
  if (sort) queryParams.append("sort", sort);

  const endpoint = `/services/mtm/v1/users/${user_id}/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


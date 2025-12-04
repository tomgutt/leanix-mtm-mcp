import type { LeanIXClient } from "../leanix/client.js";

export type GetWorkspaceEventsParams = {
  workspace_id: string;
  since?: string;
  page?: number;
  size?: number;
  sort?: string;
  eventType?: string;
};

export async function getWorkspaceEventsTool(leanix: LeanIXClient, params: GetWorkspaceEventsParams) {
  const { workspace_id, since, page, size, sort, eventType } = params;
  if (!workspace_id) throw new Error("workspace_id is required");

  const queryParams = new URLSearchParams();
  if (since) queryParams.append("since", since);
  queryParams.append("page", (page ?? 1).toString());
  queryParams.append("size", (size ?? 100).toString());
  if (sort) queryParams.append("sort", sort);
  if (eventType) queryParams.append("eventType", eventType);

  const endpoint = `/services/mtm/v1/workspaces/${workspace_id}/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}


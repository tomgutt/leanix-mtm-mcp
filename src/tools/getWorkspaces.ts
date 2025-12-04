import type { LeanIXClient } from "../leanix/client.js";

export type GetWorkspacesParams = {
  q?: string;
  feature?: string;
  page?: number;
  size?: number;
  sort?: string;
  labels?: string;
};

export async function getWorkspacesTool(leanix: LeanIXClient, params: GetWorkspacesParams) {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append("q", params.q);
  if (params.feature) queryParams.append("feature", params.feature);
  queryParams.append("page", (params.page ?? 1).toString());
  queryParams.append("size", (params.size ?? 30).toString());
  queryParams.append("sort", params.sort ?? "id-asc");
  if (params.labels) queryParams.append("labels", params.labels);

  const endpoint = `/services/mtm/v1/workspaces${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

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
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.labels) queryParams.append("labels", params.labels);

  const endpoint = `/services/mtm/v1/workspaces${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

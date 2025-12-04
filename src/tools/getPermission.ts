import type { LeanIXClient } from "../leanix/client.js";

export type GetPermissionParams = {
  id: string;
};

export async function getPermissionTool(leanix: LeanIXClient, params: GetPermissionParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/permissions/${id}`);
  return result;
}

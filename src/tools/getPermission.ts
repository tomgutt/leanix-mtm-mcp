import type { LeanIXClient } from "../leanix/client.js";

export type GetPermissionParams = {
  permission_id: string;
};

export async function getPermissionTool(leanix: LeanIXClient, params: GetPermissionParams) {
  const { permission_id } = params;
  if (!permission_id) throw new Error("permission_id is required");

  const result = await leanix.get(`/services/mtm/v1/permissions/${permission_id}`);
  return result;
}

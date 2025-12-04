import type { LeanIXClient } from "../leanix/client.js";

export type GetUserParams = {
  id: string;
  returnSinglePermission?: boolean;
};

export async function getUserTool(leanix: LeanIXClient, params: GetUserParams) {
  const { id, returnSinglePermission } = params;
  if (!id) throw new Error("id is required");

  const queryParams = new URLSearchParams();
  if (returnSinglePermission !== undefined) {
    queryParams.append("returnSinglePermission", returnSinglePermission.toString());
  }

  const endpoint = `/services/mtm/v1/users/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

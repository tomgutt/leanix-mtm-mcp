import type { LeanIXClient } from "../leanix/client.js";

export type GetUserParams = {
  user_id: string;
  returnSinglePermission?: boolean;
};

export async function getUserTool(leanix: LeanIXClient, params: GetUserParams) {
  const { user_id, returnSinglePermission } = params;
  if (!user_id) throw new Error("user_id is required");

  const queryParams = new URLSearchParams();
  if (returnSinglePermission !== undefined) {
    queryParams.append("returnSinglePermission", returnSinglePermission.toString());
  }

  const endpoint = `/services/mtm/v1/users/${user_id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const result = await leanix.get(endpoint);

  return result;
}

import type { LeanIXClient } from "../leanix/client.js";

export type GetAccountParams = {
  id: string;
};

export async function getAccountTool(leanix: LeanIXClient, params: GetAccountParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/accounts/${id}`);
  return result;
}

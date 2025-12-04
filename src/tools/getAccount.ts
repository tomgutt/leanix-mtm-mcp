import type { LeanIXClient } from "../leanix/client.js";

export type GetAccountParams = {
  account_id: string;
};

export async function getAccountTool(leanix: LeanIXClient, params: GetAccountParams) {
  const { account_id } = params;
  if (!account_id) throw new Error("account_id is required");

  const result = await leanix.get(`/services/mtm/v1/accounts/${account_id}`);
  return result;
}

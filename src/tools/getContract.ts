import type { LeanIXClient } from "../leanix/client.js";

export type GetContractParams = {
  id: string;
};

export async function getContractTool(leanix: LeanIXClient, params: GetContractParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/contracts/${id}`);
  return result;
}

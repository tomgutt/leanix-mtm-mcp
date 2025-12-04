import type { LeanIXClient } from "../leanix/client.js";

export type GetContractParams = {
  contract_id: string;
};

export async function getContractTool(leanix: LeanIXClient, params: GetContractParams) {
  const { contract_id } = params;
  if (!contract_id) throw new Error("contract_id is required");

  const result = await leanix.get(`/services/mtm/v1/contracts/${contract_id}`);
  return result;
}

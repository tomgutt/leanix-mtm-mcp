import type { LeanIXClient } from "../leanix/client.js";

export type GetTechnicalUserParams = {
  id: string;
};

export async function getTechnicalUserTool(leanix: LeanIXClient, params: GetTechnicalUserParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/technicalusers/${id}`);
  return result;
}


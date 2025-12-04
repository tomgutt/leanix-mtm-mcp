import type { LeanIXClient } from "../leanix/client.js";

export type GetEventParams = {
  id: string;
};

export async function getEventTool(leanix: LeanIXClient, params: GetEventParams) {
  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await leanix.get(`/services/mtm/v1/events/${id}`);
  return result;
}


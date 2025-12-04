import type { LeanIXClient } from "../leanix/client.js";

export type GetEventParams = {
  event_id: string;
};

export async function getEventTool(leanix: LeanIXClient, params: GetEventParams) {
  const { event_id } = params;
  if (!event_id) throw new Error("event_id is required");

  const result = await leanix.get(`/services/mtm/v1/events/${event_id}`);
  return result;
}


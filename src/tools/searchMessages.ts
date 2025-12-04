import type { LeanIXClient } from "../leanix/client.js";

export type SearchMessagesParams = {
  query: string;
  messageCount?: number;
  includeThreads?: boolean;
  threadCount?: number;
  sortMessages?: "mostRelevant" | "latest" | "oldest";
};


function sanitizeSlackQuery(userQuery: string): string {
  const sanitizedQuery = userQuery
    .replace(/\\/g, '"\\"')              // Escape backslashes first
    // .replace(/["']/g, '\\"')             // Escape quotes  
    // .replace(/[()[\]]/g, '\\$&')         // Escape grouping characters
    .replace(/[*?]/g, '"$&"')            // Escape wildcards
    .replace(/:/g, '":"')                // Escape colons
    .replace(/[@#]/g, '"$&"')            // Escape user/channel indicators
    .replace(/^-/g, '"-"')               // Escape leading dash
    .replace(/\s-/g, ' "-')             // Escape dashes after spaces
    .replace(/\b(from|to|in|has|before|after|during|on):/gi, '$1":"'); // Escape modifier words

  return sanitizedQuery;

}


function addChannelFilters(query: string, allowedChannels: string[]): string {
  const channelFilters = allowedChannels.map(c => `in:${c}`).join(" ");
  return [query, channelFilters].filter(Boolean).join(" ");
}


export async function searchMessagesTool(slack: LeanIXClient, params: SearchMessagesParams) {
  // Dummy response - Slack SDK removed, LeanIX client ready for testing
  return { 
    usedSanitizedQuery: params.query,
    foundMessagesForQuery: 0,
    queriedMessages: params.messageCount ?? 20,
    fetchedMessages: 0,
    messages: []
   };
}

import { useQuery, QueryClient } from "@tanstack/react-query";
import { GenericApifyResponse, IChannelInfo } from "../types/channel";
import { DatabaseService } from "../services/database";
import { runApifyActor } from "../services/apify";

const CHANNEL_ACTOR_ID = "l77msWN82uo0IQFfw";
export const CHANNEL_URL =
  process.env.EXPO_PUBLIC_CHANNEL_URL || "YOUR_CHANNEL_URL_HERE";

const queryKey = ["channelInfo", CHANNEL_URL];

/**
 * Fetches fresh channel info from Apify, saves to DB, and updates React Query cache.
 */
export async function fetchAndCacheChannelInfo(queryClient: QueryClient) {
  const db = DatabaseService.getInstance();
  const actorInput = {
    startUrls: [{ url: CHANNEL_URL }],
    type: "INFO",
    nameDataset: false,
    maxRequestsPerCrawl: 1,
    proxyConfiguration: { useApifyProxy: true },
  };

  try {
    const results = await runApifyActor<GenericApifyResponse<IChannelInfo>>({
      actorId: CHANNEL_ACTOR_ID,
      input: actorInput,
    });

    if (!results || results.length === 0) {
      throw new Error(
        `Apify actor ${CHANNEL_ACTOR_ID} did not return info results`
      );
    }
    const data = results[0]?.items[0] ?? results[0];

    await db.saveChannelInfo(data); // Save fresh data to DB

    // Update React Query cache with the fresh data
    queryClient.setQueryData(queryKey, data);
  } catch (error) {
    console.error("Error fetching/caching channel info:", error);
    throw error; // Re-throw error to be caught by onRefresh handler
  }
}

/**
 * React Query hook to get channel info (checks DB cache first).
 */
export default function onGetChannelInfo() {
  return useQuery<IChannelInfo>({
    queryKey: queryKey,
    queryFn: async () => {
      const db = DatabaseService.getInstance();

      // Try to get from cache first (for offline/standard load)
      const cachedData = await db.getChannelInfo();
      if (cachedData) {
        return cachedData;
      }

      // If DB cache miss, trigger the fetch logic (could reuse fetchAndCacheChannelInfo but needs queryClient)
      // For simplicity here, we duplicate the fetch logic for the initial load case.

      if (CHANNEL_URL === "YOUR_CHANNEL_URL_HERE") {
        throw new Error("Channel URL is not configured for initial fetch.");
      }
      const actorInput = {
        startUrls: [{ url: CHANNEL_URL }],
        type: "INFO",
        nameDataset: false,
        maxRequestsPerCrawl: 1,
        proxyConfiguration: { useApifyProxy: true },
      };
      const results = await runApifyActor<IChannelInfo>({
        actorId: CHANNEL_ACTOR_ID,
        input: actorInput,
      });

      if (!results || results.length === 0) {
        throw new Error(
          `Apify actor ${CHANNEL_ACTOR_ID} did not return info results on initial fetch`
        );
      }
      const data = results[0];
      await db.saveChannelInfo(data);
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 7 * 24 * 60 * 60 * 1000,
  });
}

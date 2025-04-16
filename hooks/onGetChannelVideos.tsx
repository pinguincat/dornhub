import { useQuery, QueryClient } from "@tanstack/react-query";
import { GenericApifyResponse, IVideo } from "../types/channel";
import { DatabaseService } from "../services/database";
import { runApifyActor } from "../services/apify";

// Define the structure of the wrapper object returned by Apify
interface IApifyVideoResponse {
  items: IVideo[];
  total: number;
  offset: number;
  count: number;
  limit: number;
  desc: boolean;
}

const CHANNEL_ACTOR_ID = "l77msWN82uo0IQFfw";
export const CHANNEL_URL =
  process.env.EXPO_PUBLIC_CHANNEL_URL || "YOUR_CHANNEL_URL_HERE";

const queryKey = ["channelVideos", CHANNEL_URL];

/**
 * Fetches fresh channel videos from Apify, saves to DB, and updates React Query cache.
 */
export async function fetchAndCacheChannelVideos(queryClient: QueryClient) {
  const db = DatabaseService.getInstance();
  const actorInput = {
    startUrls: [{ url: CHANNEL_URL, method: "GET" }],
    type: "VIDEOS",
    nameDataset: false,
    maxRequestsPerCrawl: 15, // Or your desired limit for refresh
    proxyConfiguration: { useApifyProxy: true, apifyProxyGroups: [] },
  };

  try {
    // Expect an array containing potentially mixed types
    const results = await runApifyActor<GenericApifyResponse<IVideo>>({
      actorId: CHANNEL_ACTOR_ID,
      input: actorInput,
    });

    const videos = results[0]?.items ?? results[0];

    await db.saveChannelVideos(videos); // Save the extracted videos

    // Update React Query cache with the extracted videos
    queryClient.setQueryData(queryKey, videos);
  } catch (error) {
    throw error; // Re-throw error to be caught by onRefresh handler
  }
}

/**
 * React Query hook to get channel videos (checks DB cache first).
 */
export default function onGetChannelVideos() {
  return useQuery<IVideo[]>({
    queryKey: queryKey,
    queryFn: async () => {
      const db = DatabaseService.getInstance();

      // Try to get from cache first (for offline/standard load)
      const cachedData = await db.getChannelVideos();
      if (cachedData.length > 0) {
        return cachedData;
      }

      if (CHANNEL_URL === "YOUR_CHANNEL_URL_HERE") {
        throw new Error("Channel URL is not configured for initial fetch.");
      }
      const actorInput = {
        startUrls: [{ url: CHANNEL_URL }],
        type: "VIDEOS",
        nameDataset: false,
        maxRequestsPerCrawl: 15, // Match refresh or use different initial limit
        proxyConfiguration: { useApifyProxy: true },
      };

      // Expect an array containing potentially mixed types
      const results = await runApifyActor<unknown[]>({
        actorId: CHANNEL_ACTOR_ID,
        input: actorInput,
      });

      let extractedData: IVideo[] = [];
      if (Array.isArray(results)) {
        for (const item of results) {
          // Check if item is an object and has an 'items' property that is an array
          if (
            item &&
            typeof item === "object" &&
            "items" in item &&
            Array.isArray((item as any).items)
          ) {
            // If it matches the structure, cast via unknown first, then assign
            extractedData = (item as unknown as IApifyVideoResponse).items;
            break; // Stop after finding the first match
          }
        }
      }
      const data: IVideo[] = extractedData;

      await db.saveChannelVideos(data);

      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 7 * 24 * 60 * 60 * 1000,
  });
}

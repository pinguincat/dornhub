import {
  useQuery,
  QueryClient,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { GenericApifyResponse, IVideo } from "../types/channel";
import { DatabaseService } from "../services/database";
import { runApifyActor } from "../services/apify";
import { videos as fakeChannelVideos } from "./fakeData"; // Import fake data

// Define the structure of the wrapper object returned by Apify
interface IApifyVideoResponse {
  items: IVideo[];
  total: number;
  offset: number;
  count: number;
  limit: number;
  desc: boolean;
}
const devMode = false;
const CHANNEL_ACTOR_ID = "l77msWN82uo0IQFfw";

// Helper function to simulate delay
const simulateDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches fresh channel videos from Apify, saves to DB, and updates React Query cache.
 * @param queryClient The React Query client instance.
 * @param channelUrl The URL of the channel to fetch videos for.
 */
export async function fetchAndCacheChannelVideos(
  queryClient: QueryClient,
  channelUrl: string
): Promise<IVideo[] | undefined> {
  const db = DatabaseService.getInstance();
  const queryKey = ["channelVideos", channelUrl];

  // Clear existing caches
  await db.clearChannelVideos();
  queryClient.removeQueries({ queryKey: ["channelVideos"] });

  if (devMode) {
    await simulateDelay(500);
    const dataToSave: IVideo[] = [...fakeChannelVideos];
    await db.saveChannelVideos(dataToSave);
    queryClient.setQueryData(queryKey, dataToSave);
    return dataToSave;
  } else {
    const actorInput = {
      startUrls: [{ url: channelUrl, method: "GET" }],
      type: "VIDEOS",
      nameDataset: false,
      maxRequestsPerCrawl: 15, // Adjust as needed
      proxyConfiguration: { useApifyProxy: true, apifyProxyGroups: [] },
    };

    try {
      const results = await runApifyActor<GenericApifyResponse<IVideo>>({
        actorId: CHANNEL_ACTOR_ID,
        input: actorInput,
      });

      // We have to get all, but not the last one.
      const videos =
        results?.[results?.length - 1]?.items ?? results?.slice(0, -1);
      await db.saveChannelVideos(videos);

      // Update React Query cache with the extracted videos for this specific URL
      queryClient.setQueryData(queryKey, videos);
      return videos as IVideo[];
    } catch (error) {
      console.error(
        `Error fetching/caching channel videos for ${channelUrl}:`,
        error
      );
      throw error; // Re-throw error to be caught by onRefresh handler
    }
  }
}

/**
 * React Query hook to get channel videos (checks DB cache first).
 * @param channelUrl The URL of the channel to get videos for. Null if no URL is active.
 */
export default function onGetChannelVideos(channelUrl: string | null) {
  const queryKey = ["channelVideos", channelUrl] as const;
  const queryClient = useQueryClient();
  const db = DatabaseService.getInstance();

  const queryOptions: UseQueryOptions<
    IVideo[] | undefined,
    Error,
    IVideo[] | undefined,
    typeof queryKey
  > = {
    queryKey: queryKey,
    queryFn: async (): Promise<IVideo[] | undefined> => {
      if (!channelUrl) {
        return undefined;
      }

      // If we're fetching new data, don't check cache
      if (queryClient.getQueryState(queryKey)?.data === undefined) {
        if (devMode) {
          await simulateDelay(500);
          const dataToSave: IVideo[] = [...fakeChannelVideos];
          await db.saveChannelVideos(dataToSave);
          return dataToSave;
        } else {
          const actorInput = {
            startUrls: [{ url: channelUrl }],
            type: "VIDEOS",
            nameDataset: false,
            maxRequestsPerCrawl: 15,
            proxyConfiguration: { useApifyProxy: true },
          };

          const results = await runApifyActor<GenericApifyResponse<IVideo>>({
            actorId: CHANNEL_ACTOR_ID,
            input: actorInput,
          });

          const videos =
            results?.[results?.length - 1]?.items ?? results?.slice(0, -1);
          if (!videos || videos.length === 0) {
            console.warn(
              `Apify actor ${CHANNEL_ACTOR_ID} did not return video results on initial fetch for ${channelUrl}`
            );
            return undefined;
          }

          await db.saveChannelVideos(videos);
          return videos;
        }
      }

      // Only check DB cache if we're not fetching new data
      const cachedDbData = await db.getChannelVideos();

      if (cachedDbData && cachedDbData.length > 0) {
        return cachedDbData;
      }

      return undefined;
    },
    enabled: !!channelUrl,
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 7 * 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  };

  return useQuery<
    IVideo[] | undefined,
    Error,
    IVideo[] | undefined,
    typeof queryKey
  >(queryOptions);
}

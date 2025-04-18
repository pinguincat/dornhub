import {
  useQuery,
  QueryClient,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { GenericApifyResponse, IChannelInfo } from "../types/channel";
import { DatabaseService } from "../services/database";
import { runApifyActor } from "../services/apify";
import { info as fakeChannelInfo } from "./fakeData"; // Import fake data

const devMode = false;
const CHANNEL_ACTOR_ID = "l77msWN82uo0IQFfw";

// Helper function to simulate delay
const simulateDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches fresh channel info from Apify, saves to DB, and updates React Query cache.
 * @param queryClient The React Query client instance.
 * @param channelUrl The URL of the channel to fetch info for.
 */
export async function fetchAndCacheChannelInfo(
  queryClient: QueryClient,
  channelUrl: string
): Promise<IChannelInfo | undefined> {
  const db = DatabaseService.getInstance();
  const queryKey = ["channelInfo", channelUrl];

  // Clear existing caches
  await db.clearChannelInfo();
  queryClient.removeQueries({ queryKey: ["channelInfo"] });

  if (devMode) {
    await simulateDelay(500);
    const dataToSave: IChannelInfo = { ...fakeChannelInfo };
    await db.saveChannelInfo(dataToSave);
    queryClient.setQueryData(queryKey, dataToSave);
    return dataToSave;
  } else {
    const actorInput = {
      startUrls: [{ url: channelUrl }],
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
          `Apify actor ${CHANNEL_ACTOR_ID} did not return info results for ${channelUrl}`
        );
      }
      // Handle potential nesting of results
      let data = results[0]?.items?.[0] ?? results[0];

      if (!data) {
        // Handle case where data extraction failed
        throw new Error(
          `Could not extract channel info data for ${channelUrl}`
        );
      }

      // Save to the single DB slot (overwrites existing)
      await db.saveChannelInfo(data as IChannelInfo);

      // Update React Query cache with the fresh data using the dynamic key for this specific URL
      queryClient.setQueryData(queryKey, data);
      return data as IChannelInfo;
    } catch (error) {
      console.error(
        `Error fetching/caching channel info for ${channelUrl}:`,
        error
      );
      throw error; // Re-throw error to be caught by onRefresh handler
    }
  }
}

/**
 * React Query hook to get channel info (checks DB cache first).
 * @param channelUrl The URL of the channel to get info for. Null if no URL is active.
 */
export default function onGetChannelInfo(channelUrl: string | null) {
  const queryKey = ["channelInfo", channelUrl] as const;
  const queryClient = useQueryClient();
  const db = DatabaseService.getInstance();

  const queryOptions: UseQueryOptions<
    IChannelInfo | undefined,
    Error,
    IChannelInfo | undefined,
    typeof queryKey
  > = {
    queryKey: queryKey,
    queryFn: async (): Promise<IChannelInfo | undefined> => {
      if (!channelUrl) {
        return undefined;
      }

      // If we're fetching new data, don't check cache
      if (queryClient.getQueryState(queryKey)?.data === undefined) {
        if (devMode) {
          await simulateDelay(500);
          const dataToSave: IChannelInfo = { ...fakeChannelInfo };
          await db.saveChannelInfo(dataToSave);
          return dataToSave;
        } else {
          const actorInput = {
            startUrls: [{ url: channelUrl }],
            type: "INFO",
            nameDataset: false,
            maxRequestsPerCrawl: 1,
            proxyConfiguration: { useApifyProxy: true },
          };
          const results = await runApifyActor<
            GenericApifyResponse<IChannelInfo>
          >({
            actorId: CHANNEL_ACTOR_ID,
            input: actorInput,
          });

          if (!results || results.length === 0) {
            console.error(
              `Apify actor ${CHANNEL_ACTOR_ID} did not return info results on initial fetch for ${channelUrl}`
            );
            return undefined;
          }

          const data = results[0]?.items?.[0] ?? results[0];

          await db.saveChannelInfo(data);
          return data;
        }
      }

      // Only check DB cache if we're not fetching new data
      const cachedDbData = await db.getChannelInfo();

      if (cachedDbData) {
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
    IChannelInfo | undefined,
    Error,
    IChannelInfo | undefined,
    typeof queryKey
  >(queryOptions);
}

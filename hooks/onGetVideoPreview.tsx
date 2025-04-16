import { useQuery, QueryClient } from "@tanstack/react-query";
import { IVideoPreview } from "../types/channel";
import { DatabaseService } from "../services/database";
import { runApifyActor } from "../services/apify";

const VIDEO_PREVIEW_ACTOR_ID = "eyan903JyaBf545lK";

type VideoPreviewResult = IVideoPreview | null;

// Define queryKey outside for reuse
const getVideoPreviewQueryKey = (videoId: string) => ["videoPreview", videoId];

/**
 * Fetches fresh video preview from Apify, saves to DB, and updates React Query cache.
 */
export async function fetchAndCacheVideoPreview(
  queryClient: QueryClient,
  videoId: string
) {
  if (!videoId) throw new Error("Video ID is required to fetch preview.");

  const db = DatabaseService.getInstance();
  const actorInput = {
    startUrls: [
      {
        url: `https://www.pornhub.com/view_video.php?viewkey=${videoId}`,
      },
    ],
    nameDataset: false,
    maxRequestsPerCrawl: 10, // Keep consistent or adjust as needed
    proxyConfiguration: {
      useApifyProxy: true,
    },
  };

  try {
    const results = await runApifyActor<any>({
      actorId: VIDEO_PREVIEW_ACTOR_ID,
      input: actorInput,
    });

    if (!results || results.length === 0) {
      throw new Error(`Apify actor returned no results for video ${videoId}.`);
    }

    // Assuming the same result structure as in the queryFn
    const [firstObject, secondObject] = results;
    const freshData = secondObject?.items?.[0] ?? firstObject;

    if (!freshData) {
      throw new Error(
        `Could not extract video preview data from Apify results for video ${videoId}.`
      );
    }

    const dataToSave: IVideoPreview = {
      ...freshData,
      id: freshData.id ?? videoId, // Ensure ID exists
    };

    await db.saveVideoPreview(videoId, dataToSave);

    // Update React Query cache
    queryClient.setQueryData(getVideoPreviewQueryKey(videoId), dataToSave);

    return dataToSave; // Return the fetched data
  } catch (error) {
    console.error(
      `[fetchAndCacheVideoPreview] Error fetching/caching fresh data for ${videoId}:`,
      error
    );
    throw error; // Re-throw error
  }
}

export default function onGetVideoPreview(videoId: string) {
  return useQuery<VideoPreviewResult>({
    queryKey: getVideoPreviewQueryKey(videoId), // Use the defined function
    queryFn: async () => {
      if (!videoId) return null;

      const db = DatabaseService.getInstance();

      const cachedData = await db.getVideoPreview(videoId);

      if (cachedData) {
        const idToUse = cachedData.preview?.id ?? videoId;
        return {
          ...(cachedData.preview || {}),
          id: idToUse,
        };
      } else {
        try {
          const actorInput = {
            startUrls: [
              {
                url: `https://www.pornhub.com/view_video.php?viewkey=${videoId}`,
              },
            ],
            nameDataset: false,
            maxRequestsPerCrawl: 10,
            proxyConfiguration: {
              useApifyProxy: true,
            },
          };
          const results = await runApifyActor<any>({
            actorId: VIDEO_PREVIEW_ACTOR_ID,
            input: actorInput,
          });

          if (!results || results.length === 0) {
            throw new Error("Apify actor returned no results.");
          }

          const [firstObject, secondObject] = results;
          const freshData = secondObject?.items?.[0] ?? firstObject;

          if (!freshData) {
            throw new Error(
              "Could not extract video preview data from Apify results."
            );
          }

          await db.saveVideoPreview(videoId, freshData);

          return {
            ...freshData,
            id: freshData.id ?? videoId,
          };
        } catch (error) {
          console.error(
            `[onGetVideoPreview] Error fetching/processing fresh data for ${videoId}:`,
            error
          );
          return null;
        }
      }
    },
    staleTime: 0,
    cacheTime: 7 * 24 * 60 * 60 * 1000,
    enabled: !!videoId,
    refetchOnWindowFocus: true,
  });
}

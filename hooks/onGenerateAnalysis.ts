import { useMutation } from "@tanstack/react-query";
import { IVideo } from "../types/channel";
import { DatabaseService } from "../services/database";

import { runApifyActor } from "@/services/apify";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const VIDEO_PREVIEW_ACTOR_ID = "eyan903JyaBf545lK";

interface VideoAnalysis {
  thumbnail_url: string;
  title: string;
  views: number;
  likes_percentage: string;
  upload_date: string;
  channel_name: string;
  page_title: string;
  page_description: string;
  likes_up: number;
  likes_down: number;
  favorites: number;
  added_date: string;
  categories: string[];
  tags: string[];
  production: string[];
  model_attributes: string[];
  pornstars: string[];
  channel_verified: boolean;
  channel_award_winner: boolean;
  channel_content_partner: boolean;
  channel_videos_count: number;
  video_download: string;
  url: string;
}

interface AnalysisResult {
  videos: VideoAnalysis[];
  analytics: {
    performance: {
      averageViews: number;
      averageLikes: number;
      averageDislikes: number;
      averageFavorites: number;
      engagementRate: number;
      favoriteRate: number;
      viewToEngagementRatio: number;
      peakPerformanceTime: string;
      bestPerformingVideo: {
        title: string;
        views: number;
        likes: number;
        dislikes: number;
        favorites: number;
        engagementRate: number;
      };
    };
    modelAttributes: {
      mostCommon: Array<{ attribute: string; frequency: number }>;
      impactOnPerformance: Record<
        string,
        { views: number; engagement: number }
      >;
    };
    categoryPerformance: Array<{
      name: string;
      engagement: number;
      views: number;
      trend: "up" | "down" | "neutral";
    }>;
    tagPerformance: Array<{
      name: string;
      usage: number;
      engagement: number;
      trend: "up" | "down" | "neutral";
    }>;
    postingTimes: Array<{ hour: string; engagement: number }>;
    recommendations: {
      contentStrategy: {
        focusCategories: string[];
        focusTags: string[];
        format: string;
        reason: string;
      };
      modelAttributes: {
        maintain: string[];
        avoid: string[];
        reason: string;
      };
      postingSchedule: {
        bestTimes: string[];
        reason: string;
      };
    };
  };
}

interface ApifyResponse {
  items: VideoAnalysis[];
  count: number;
  desc: boolean;
  limit: number;
  offset: number;
  total: number;
}

async function analyzeVideos(
  videos: VideoAnalysis[]
): Promise<AnalysisResult["analytics"]> {
  // Calculate performance metrics manually
  const totalVideos = videos.length;
  const manualPerformanceMetrics = {
    averageViews:
      videos.reduce((sum, video) => sum + video.views, 0) / totalVideos,
    averageLikes:
      videos.reduce((sum, video) => sum + video.likes_up, 0) / totalVideos,
    averageDislikes:
      videos.reduce((sum, video) => sum + video.likes_down, 0) / totalVideos,
    averageFavorites:
      videos.reduce((sum, video) => sum + video.favorites, 0) / totalVideos,
  };

  // Calculate derived metrics
  const engagementRate =
    ((manualPerformanceMetrics.averageLikes +
      manualPerformanceMetrics.averageFavorites) /
      manualPerformanceMetrics.averageViews) *
    100;
  const favoriteRate =
    (manualPerformanceMetrics.averageFavorites /
      manualPerformanceMetrics.averageViews) *
    100;
  const viewToEngagementRatio =
    manualPerformanceMetrics.averageViews /
    (manualPerformanceMetrics.averageLikes +
      manualPerformanceMetrics.averageFavorites);

  // Find best performing video
  const bestPerformingVideo = videos.reduce((best, current) => {
    const currentEngagement =
      ((current.likes_up + current.favorites) / current.views) * 100;
    const bestEngagement =
      ((best.likes_up + best.favorites) / best.views) * 100;
    return currentEngagement > bestEngagement ? current : best;
  }, videos[0]);

  // Create sanitized version of videos without sensitive fields
  const sanitizedVideos = videos.map((video) => {
    const {
      url,
      video_download,
      page_title,
      page_description,
      thumbnail_url,
      ...rest
    } = video;
    return rest;
  });

  const prompt = PromptTemplate.fromTemplate(`
    You are a video analytics expert. Analyze ALL videos in the provided dataset and provide insights in JSON format.
    
    Video Data:
    {videos}

    Required Analysis Structure:
    {{
      "modelAttributes": {{
        "mostCommon": Array<{{ attribute: string, frequency: number }}>,
        "impactOnPerformance": Record<string, {{ views: number, engagement: number }}>
      }},
      "categoryPerformance": Array<{{
        name: string,
        engagement: number,
        views: number,
        trend: "up" | "down" | "neutral"
      }}>,
      "tagPerformance": Array<{{
        name: string,
        usage: number,
        engagement: number,
        trend: "up" | "down" | "neutral"
      }}>,
      "postingTimes": Array<{{ hour: string, engagement: number }}>,
      "recommendations": {{
        "contentStrategy": {{
          "focusCategories": Array<string>,
          "focusTags": Array<string>,
          "format": string,
          "reason": string
        }},
        "modelAttributes": {{
          "maintain": Array<string>,
          "avoid": Array<string>,
          "reason": string
        }},
        "postingSchedule": {{
          "bestTimes": Array<string>,
          "reason": string
        }}
      }}
    }}

    Important Guidelines:
    1. Analyze ALL videos in the dataset, not just a subset
    2. Use values between 0-100 for engagement rates and percentages
    3. Use 12-hour format with AM/PM for posting times (e.g., "9 PM")
    4. For impact on performance, use percentage values
    5. Analyze upload times to determine optimal posting schedule
    6. Provide specific, actionable recommendations based on the data
    7. Consider trends and patterns in the data for recommendations
    8. For category and tag performance, include only categories/tags that appear in at least 2 videos
    9. For posting times, group by hour and calculate average engagement for each hour
    10. For recommendations, base them on statistical significance (at least 2 videos supporting the trend)
  `);

  try {
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0.7,
    });

    const chain = prompt.pipe(model).pipe(new JsonOutputParser());

    const aiResult = (await chain.invoke({
      videos: JSON.stringify(sanitizedVideos, null, 2),
    })) as Omit<AnalysisResult["analytics"], "performance">;

    // Combine AI results with manual calculations
    const result: AnalysisResult["analytics"] = {
      performance: {
        averageViews: manualPerformanceMetrics.averageViews,
        averageLikes: manualPerformanceMetrics.averageLikes,
        averageDislikes: manualPerformanceMetrics.averageDislikes,
        averageFavorites: manualPerformanceMetrics.averageFavorites,
        engagementRate,
        favoriteRate,
        viewToEngagementRatio,
        peakPerformanceTime: aiResult.postingTimes[0]?.hour || "9 PM", // Use the highest engagement time
        bestPerformingVideo: {
          title: bestPerformingVideo.title,
          views: bestPerformingVideo.views,
          likes: bestPerformingVideo.likes_up,
          dislikes: bestPerformingVideo.likes_down,
          favorites: bestPerformingVideo.favorites,
          engagementRate:
            ((bestPerformingVideo.likes_up + bestPerformingVideo.favorites) /
              bestPerformingVideo.views) *
            100,
        },
      },
      ...aiResult,
    };

    return result;
  } catch (error) {
    console.error("Error analyzing videos:", error);
    throw error;
  }
}

/**
 * Fetches video analysis data for the first 10 videos of a channel
 */
async function fetchVideoAnalysis(videos: IVideo[]): Promise<AnalysisResult> {
  console.log("FETCHING VIDEO ANALYSIS");
  if (!videos || videos.length === 0) {
    throw new Error("No videos provided for analysis");
  }

  // Take first 10 videos
  const videosToAnalyze = videos.slice(0, 10);

  const actorInput = {
    startUrls: videosToAnalyze.map((video) => ({
      url: `https://www.pornhub.com/view_video.php?viewkey=${video.video_vkey}`,
    })),
    nameDataset: false,
    maxRequestsPerCrawl: 10,
    proxyConfiguration: {
      useApifyProxy: true,
    },
  };

  try {
    const results = await runApifyActor<ApifyResponse>({
      actorId: VIDEO_PREVIEW_ACTOR_ID,
      input: actorInput,
    });

    if (!results || results.length === 0) {
      throw new Error("Apify actor returned no results for video analysis");
    }

    const analysisResults =
      results?.[results?.length - 1]?.items ?? results?.slice(0, -1);

    const analytics = await analyzeVideos(analysisResults);

    console.log("ANALYTICS RESULTS", JSON.stringify(analytics, null, 2));
    const result = {
      videos: analysisResults,
      analytics,
    };

    // Store the results in the database
    const db = DatabaseService.getInstance();
    await db.saveChannelAnalytics(result);

    return result;
  } catch (error) {
    console.error("Error fetching video analysis:", error);
    throw error;
  }
}

/**
 * React Query hook to generate video analysis
 */
export default function useGenerateAnalysis() {
  return useMutation<AnalysisResult, Error, IVideo[]>({
    mutationFn: fetchVideoAnalysis,
  });
}

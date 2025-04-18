import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { DatabaseService } from "../services/database";
import {
  MetricCard,
  RecommendationCard,
  VideoCard,
  SectionTitle,
  CategoryDistribution,
  PerformanceMetrics,
  ContentPerformance,
  ModelAttributesImpact,
  OptimalPostingTimes,
  TopTags,
  TopCategories,
} from "../components/analytics";

interface CategoryPerformance {
  name: string;
  engagement: number;
  views: number;
  trend: "up" | "down" | "neutral";
}

interface TagPerformance {
  name: string;
  usage: number;
  engagement: number;
  trend: "up" | "down" | "neutral";
}

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
  channel_subscriber_count: number;
  video_download: string;
  url: string;
}

interface AnalyticsData {
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
    categoryPerformance: CategoryPerformance[];
    tagPerformance: TagPerformance[];
    modelAttributes: {
      mostCommon: Array<{ attribute: string; frequency: number }>;
      impactOnPerformance: Record<
        string,
        { views: number; engagement: number }
      >;
    };
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

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (params.data) {
          const data = JSON.parse(params.data as string);
          console.log(JSON.stringify(data, null, 2));
          setAnalyticsData(data);
          setIsLoading(false);
          return;
        }

        const db = DatabaseService.getInstance();
        const data = await db.getChannelAnalytics();
        if (data) {
          setAnalyticsData(data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error loading analytics data:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.data]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!analyticsData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No analytics data available</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/")}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    videos,
    analytics: {
      performance,
      categoryPerformance,
      tagPerformance,
      modelAttributes,
      postingTimes,
      recommendations,
    },
  } = analyticsData;

  // Sort videos by performance
  const sortedVideos = [...videos].sort((a, b) => {
    const calculateScore = (video: VideoAnalysis): number => {
      const totalLikes = video.likes_up + video.likes_down;
      const engagementRate =
        totalLikes > 0 ? (video.likes_up / totalLikes) * 100 : 0;

      // Calculate a weighted score considering multiple factors
      const viewsWeight = 0.6;
      const engagementWeight = 0.2;
      const likesWeight = 0.15;
      const favoritesWeight = 0.05;

      // Normalize values based on actual data ranges
      const normalizedViews = video.views / 100000;
      const normalizedLikes = video.likes_up / 300;
      const normalizedFavorites = video.favorites / 300;

      // Add a small bonus for verified channels and content partners
      const channelBonus =
        (video.channel_verified ? 0.1 : 0) +
        (video.channel_content_partner ? 0.1 : 0);

      return (
        normalizedViews * viewsWeight +
        engagementRate * engagementWeight +
        normalizedLikes * likesWeight +
        normalizedFavorites * favoritesWeight +
        channelBonus
      );
    };

    const aScore = calculateScore(a);
    const bScore = calculateScore(b);

    return bScore - aScore;
  });

  const handleVideoPress = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <PerformanceMetrics performance={performance} videos={videos} />

        <View style={styles.section}>
          <SectionTitle title="Video Performance" />
          <View style={styles.videoList}>
            {sortedVideos.map((video, index) => (
              <VideoCard
                key={video.title}
                video={video}
                index={index}
                onPress={handleVideoPress}
              />
            ))}
          </View>
        </View>

        <ContentPerformance
          categoryPerformance={categoryPerformance}
          tagPerformance={tagPerformance}
          peakPerformanceTime={performance.peakPerformanceTime}
        />

        <ModelAttributesImpact modelAttributes={modelAttributes} />

        <TopCategories categories={categoryPerformance} />
        <TopTags tags={tagPerformance} />

        <OptimalPostingTimes postingTimes={postingTimes} />

        <View style={styles.section}>
          <SectionTitle title="AI Recommendations" />
          <RecommendationCard
            title="Content Strategy"
            description={`Focus on ${recommendations.contentStrategy.focusCategories.join(
              ", "
            )} content with ${recommendations.contentStrategy.format} format. ${
              recommendations.contentStrategy.reason
            }`}
            icon="bulb"
            priority="high"
          />
          <RecommendationCard
            title="Model Attributes"
            description={`Maintain ${recommendations.modelAttributes.maintain.join(
              ", "
            )} attributes. ${recommendations.modelAttributes.reason}`}
            icon="person"
            priority="high"
          />
          <RecommendationCard
            title="Posting Schedule"
            description={`Schedule uploads at ${recommendations.postingSchedule.bestTimes.join(
              ", "
            )}. ${recommendations.postingSchedule.reason}`}
            icon="time"
            priority="medium"
          />
          <RecommendationCard
            title="Tag Optimization"
            description={`Use ${recommendations.contentStrategy.focusTags.join(
              ", "
            )} tags for better reach. ${
              recommendations.contentStrategy.reason
            }`}
            icon="pricetag"
            priority="high"
          />
        </View>

        <CategoryDistribution videos={videos} screenWidth={screenWidth} />

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={async () => {
              try {
                const db = DatabaseService.getInstance();
                await db.clearChannelAnalytics();
                router.push("/");
              } catch (error) {
                console.error("Failed to remove analytics:", error);
              }
            }}
          >
            <Text style={styles.buttonText}>Remove Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: "#27272a",
    borderRadius: 10,
    padding: 15,
  },
  videoList: {
    gap: 10,
  },
  button: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#F44336",
    width: "100%",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
});

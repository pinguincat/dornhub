import React, { useState, useCallback, useEffect, Fragment } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ChannelHeader } from "../components/channel/ChannelHeader";
import { VideoList } from "../components/channel/VideoList";
import { VideoPickerModal } from "../components/channel/VideoPickerModal";
import { AnalyticsButtonContent } from "../components/channel/AnalyticsButtonContent";
import { SearchBar } from "../components/channel/SearchBar";
import { IVideo } from "../types/channel";
import onGetChannelInfo, {
  fetchAndCacheChannelInfo,
} from "../hooks/onGetChannelInfo";
import onGetChannelVideos, {
  fetchAndCacheChannelVideos,
} from "../hooks/onGetChannelVideos";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseService } from "../services/database";
import useGenerateAnalysis from "../hooks/onGenerateAnalysis";

export default function ChannelScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: generateAnalysis, isLoading: isGeneratingAnalysis } =
    useGenerateAnalysis();

  const [inputUrl, setInputUrl] = useState<string>("");
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [isLoadingFromButton, setIsLoadingFromButton] = useState(false);
  const [hasAnalytics, setHasAnalytics] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);
  const [selectedVideoCount, setSelectedVideoCount] = useState<number>(5);

  const { data: channelInfo, isLoading: isLoadingInfo } =
    onGetChannelInfo(activeUrl);
  const { data: channelVideos, isLoading: isLoadingVideos } =
    onGetChannelVideos(activeUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load cached data on initial mount
  useEffect(() => {
    const loadCachedData = async () => {
      const db = DatabaseService.getInstance();
      const cachedInfo = await db.getChannelInfo();
      const cachedVideos = await db.getChannelVideos();
      const cachedAnalytics = await db.getChannelAnalytics();

      if (cachedInfo && cachedVideos) {
        setInputUrl(cachedInfo.url);
        setActiveUrl(cachedInfo.url);
        queryClient.setQueryData(["channelInfo", cachedInfo.url], cachedInfo);
        queryClient.setQueryData(
          ["channelVideos", cachedInfo.url],
          cachedVideos
        );
      }

      if (cachedAnalytics) {
        setHasAnalytics(true);
      }
    };

    loadCachedData();
  }, [queryClient]);

  // Check for analytics when channel info changes
  useEffect(() => {
    const checkAnalytics = async () => {
      if (channelInfo) {
        const db = DatabaseService.getInstance();
        const analytics = await db.getChannelAnalytics();
        setHasAnalytics(!!analytics);
      }
    };

    checkAnalytics();
  }, [channelInfo]);

  const handleVideoPress = (video: IVideo) =>
    router.push(`/video/${video.video_vkey}`);

  const onRefresh = useCallback(async () => {
    if (!activeUrl) {
      setIsRefreshing(false);
      return;
    }

    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchAndCacheChannelInfo(queryClient, activeUrl),
        fetchAndCacheChannelVideos(queryClient, activeUrl),
      ]);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, activeUrl]);

  const handleSetChannelUrl = useCallback(async () => {
    const newUrl = inputUrl.trim();
    if (!newUrl) {
      return;
    }

    // Always clear caches when searching for a new URL
    if (newUrl !== activeUrl) {
      setIsLoadingFromButton(true);

      // First set the new URL to ensure React Query uses it for the next fetch
      setActiveUrl(newUrl);

      // Then clear caches - this will automatically trigger a refetch
      queryClient.removeQueries({ queryKey: ["channelInfo"] });
      queryClient.removeQueries({ queryKey: ["channelVideos"] });

      // Clear local DB cache
      const db = DatabaseService.getInstance();
      await Promise.all([
        db.clearChannelInfo(),
        db.clearChannelVideos(),
        db.clearChannelAnalytics(),
      ]);

      setHasAnalytics(false);
      setIsLoadingFromButton(false);
    } else {
      await onRefresh();
    }
  }, [queryClient, activeUrl, inputUrl, onRefresh]);

  const showLoading =
    isLoadingFromButton ||
    (activeUrl && (isLoadingInfo || isLoadingVideos) && !isRefreshing);
  const showPrompt =
    !activeUrl ||
    (activeUrl &&
      !channelInfo &&
      !channelVideos &&
      !showLoading &&
      !isRefreshing);

  const handleAnalyticsAction = async () => {
    if (hasAnalytics) {
      try {
        const db = DatabaseService.getInstance();
        const analyticsData = await db.getChannelAnalytics();
        if (analyticsData) {
          router.push({
            pathname: "/analytics",
            params: { data: JSON.stringify(analyticsData) },
          });
        }
      } catch (error) {
        console.error("Failed to load analytics:", error);
      }
    } else if (channelVideos && !isGeneratingAnalysis) {
      setShowVideoPicker(true);
    }
  };

  const handleGenerateAnalytics = async () => {
    if (!channelVideos || isGeneratingAnalysis) return;

    try {
      setShowVideoPicker(false);
      const videosToAnalyze = channelVideos.slice(0, selectedVideoCount);
      console.log("videosToAnalyze", selectedVideoCount);
      await generateAnalysis(videosToAnalyze);
      setHasAnalytics(true);
      router.push("/analytics");
    } catch (error) {
      console.error("Failed to generate analytics:", error);
    }
  };

  const getAnalyticsButtonStyle = () => {
    if (isGeneratingAnalysis) {
      return [styles.button, styles.analyticsButton, styles.buttonDisabled];
    }
    if (hasAnalytics) {
      return [styles.button, styles.analyticsButton, styles.buttonSuccess];
    }
    return [styles.button, styles.analyticsButton];
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={inputUrl}
        onChangeText={setInputUrl}
        onSearch={handleSetChannelUrl}
        isLoading={isLoadingFromButton}
        isRefreshing={isRefreshing}
      />

      {showLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : activeUrl && channelInfo && channelVideos ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#FF9500"
              colors={["#FF9500"]}
              progressBackgroundColor="#27272a"
              title="Refreshing..."
              titleColor="#FFFFFF"
              enabled={!!activeUrl && !isLoadingFromButton}
            />
          }
        >
          {channelInfo && (
            <Fragment>
              <ChannelHeader info={channelInfo} />
              <TouchableOpacity
                style={getAnalyticsButtonStyle()}
                onPress={handleAnalyticsAction}
                disabled={isGeneratingAnalysis || !channelVideos}
              >
                <AnalyticsButtonContent
                  isGeneratingAnalysis={isGeneratingAnalysis}
                  hasAnalytics={hasAnalytics}
                />
              </TouchableOpacity>
            </Fragment>
          )}
          {channelVideos && (
            <VideoList videos={channelVideos} onVideoPress={handleVideoPress} />
          )}
        </ScrollView>
      ) : showPrompt ? (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            {activeUrl
              ? "Could not load channel data. Pull down to refresh or try a different URL."
              : "Please enter a channel URL above to load videos."}
          </Text>
        </View>
      ) : null}

      <VideoPickerModal
        visible={showVideoPicker}
        selectedVideoCount={selectedVideoCount}
        onClose={() => setShowVideoPicker(false)}
        onGenerate={handleGenerateAnalytics}
        onValueChange={setSelectedVideoCount}
      />
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
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18181b",
  },
  promptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  promptText: {
    color: "#a1a1aa",
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  analyticsButton: {
    backgroundColor: "#FF9500",
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonSuccess: {
    backgroundColor: "#4CAF50",
  },
  buttonDisabled: {
    backgroundColor: "#71717a",
    opacity: 0.7,
  },
});

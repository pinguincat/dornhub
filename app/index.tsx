import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { ChannelHeader } from "../components/channel/ChannelHeader";
import { VideoList } from "../components/channel/VideoList";
import { IVideo } from "../types/channel";
import onGetChannelInfo, {
  fetchAndCacheChannelInfo,
} from "../hooks/onGetChannelInfo";
import onGetChannelVideos, {
  fetchAndCacheChannelVideos,
} from "../hooks/onGetChannelVideos";
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function ChannelScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: channelInfo, isLoading: isLoadingInfo } = onGetChannelInfo();
  const { data: channelVideos, isLoading: isLoadingVideos } =
    onGetChannelVideos();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleVideoPress = (video: IVideo) =>
    router.push(`/video/${video.video_vkey}`);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchAndCacheChannelInfo(queryClient),
        fetchAndCacheChannelVideos(queryClient),
      ]);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  if (isLoadingInfo || isLoadingVideos) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      </SafeAreaView>
    );
  }

  if (!channelInfo || !channelVideos) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
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
            title="Refreshing..."
            titleColor="#FFFFFF"
          />
        }
      >
        <ChannelHeader info={channelInfo} />
        <VideoList videos={channelVideos} onVideoPress={handleVideoPress} />
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
  },
  contentContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18181b",
  },
});

import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { VideoPreview } from "../../components/video/VideoPreview";
import onGetVideoPreview, {
  fetchAndCacheVideoPreview,
} from "../../hooks/onGetVideoPreview";
import { useQueryClient } from "@tanstack/react-query";

export default function VideoPreviewScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const queryClient = useQueryClient();
  const { data: video, isLoading } = onGetVideoPreview(videoId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!videoId) return;
    setIsRefreshing(true);
    try {
      await fetchAndCacheVideoPreview(queryClient, videoId);
    } catch (error) {
      console.error(`Failed to refresh video preview ${videoId}:`, error);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, videoId]);

  const showLoading = isLoading || isRefreshing;

  if (showLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      </SafeAreaView>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <VideoPreview video={video} />
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={isRefreshing}
      >
        <Ionicons name="refresh" size={24} color="#FF9500" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18181b",
  },
  refreshButton: {
    position: "absolute",
    top: 10,
    right: 15,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

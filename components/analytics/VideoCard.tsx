import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VideoAnalysis {
  title: string;
  views: number;
  likes_up: number;
  likes_down: number;
  favorites: number;
}

interface VideoCardProps {
  video: VideoAnalysis;
  index: number;
  onPress: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  index,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.videoCard}
    onPress={() => onPress(video.title)}
  >
    <View style={styles.videoHeader}>
      <Text style={styles.videoRank}>#{index + 1}</Text>
      <Text style={styles.videoTitle} numberOfLines={2} ellipsizeMode="tail">
        {video.title}
      </Text>
    </View>
    <View style={styles.videoMetrics}>
      <View style={styles.topRow}>
        <View style={styles.horizontalMetric}>
          <Text style={styles.metricLabel}>Views</Text>
          <Text style={styles.metricValue}>{video.views.toLocaleString()}</Text>
        </View>

        <View style={styles.horizontalMetric}>
          <Text style={styles.metricLabel}>Engagement</Text>
          <Text style={styles.metricValue}>
            {(
              (video.likes_up / (video.likes_up + video.likes_down)) *
              100
            ).toFixed(2)}
            %
          </Text>
        </View>
        <View style={styles.horizontalMetric}>
          <Text style={styles.metricLabel}>Favorites</Text>
          <Text style={styles.metricValue}>
            {video.favorites.toLocaleString()}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.likesRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="thumbs-up" size={16} color="#4CAF50" />
            <Text style={styles.metricValue}>
              {video.likes_up.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.likesRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="thumbs-down" size={16} color="#F44336" />
            <Text style={styles.metricValue}>
              {video.likes_down.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  videoCard: {
    backgroundColor: "#333333",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    gap: 5,
  },
  videoHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  videoRank: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    minWidth: 30,
  },
  videoTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    flexWrap: "wrap",
  },
  videoMetrics: {
    gap: 15,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  likesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  horizontalMetric: {
    flex: 1,
    minWidth: 60,
  },
  metricLabel: {
    color: "#a1a1aa",
    fontSize: 12,
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

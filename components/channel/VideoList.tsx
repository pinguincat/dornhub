import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { IVideo } from "../../types/channel";

interface Props {
  videos: IVideo[];
  onVideoPress: (video: IVideo) => void;
}

export const VideoList: React.FC<Props> = ({ videos, onVideoPress }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  return (
    <View style={styles.container}>
      {videos.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.videoItem}
          onPress={() => onVideoPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: item.thumbnail_url }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>
                {formatDuration(item.duration)}
              </Text>
            </View>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.stats}>
              <Text style={styles.views}>{formatViews(item.views)} views</Text>
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  videoItem: {
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: "relative",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#18181b",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  videoInfo: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  views: {
    fontSize: 12,
    color: "#999",
    marginRight: 8,
  },
  rating: {
    fontSize: 12,
    color: "#999",
  },
});

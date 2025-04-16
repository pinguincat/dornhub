import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IVideoPreview } from "../../types/channel";
import { DatabaseService } from "../../services/database";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  video: IVideoPreview & { localPath?: string | null };
}

// Define helper functions outside the component if they don't need props/state
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const VideoPreview: React.FC<Props> = ({ video }) => {
  const queryClient = useQueryClient();
  const [currentVideo, setCurrentVideo] = useState(video);

  const player = useVideoPlayer(null, (player) => {
    player.loop = false;
  });

  React.useEffect(() => {
    setCurrentVideo(video);
  }, [video]);

  const sourceUri = useMemo(() => {
    const uri = currentVideo.video_download || null;
    console.log("[VideoPreview] Calculated sourceUri:", uri);
    return uri;
  }, [currentVideo.video_download]);

  React.useEffect(() => {
    if (sourceUri) {
      player.replace({ uri: sourceUri });
    } else {
      player.replace(null);
      console.warn("[VideoPreview] No playable source URI available.");
    }
  }, [sourceUri, player]);

  const handleViewOnPornhub = useCallback(async () => {
    if (currentVideo.url) {
      const supported = await Linking.canOpenURL(currentVideo.url);
      if (supported) {
        await Linking.openURL(currentVideo.url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${currentVideo.url}`);
      }
    } else {
      Alert.alert("Error", "No URL available for this video.");
    }
  }, [currentVideo.url]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.videoContainer}>
        {sourceUri ? (
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Text style={styles.noVideoText}>Video source not available</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={handleViewOnPornhub}
          disabled={!currentVideo.url}
        >
          <Text style={styles.viewButtonText}>View on Pornhub</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.stats}>
          {/* Views */}
          <View style={styles.iconStatContainer}>
            <MaterialCommunityIcons name="eye-outline" size={16} color="#999" />
            <Text style={styles.iconStatText}>
              {formatNumber(currentVideo.views)}
            </Text>
          </View>
          <Text style={styles.dot}>•</Text>

          {/* Likes Up/Down */}
          <View style={styles.iconStatContainer}>
            <MaterialCommunityIcons name="thumb-up" size={14} color="#4ade80" />
            <Text style={styles.iconStatText}>
              {formatNumber(currentVideo.likes_up)}
            </Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <View style={styles.iconStatContainer}>
            <MaterialCommunityIcons
              name="thumb-down"
              size={14}
              color="#f87171"
            />

            <Text style={styles.iconStatText}>
              {formatNumber(currentVideo.likes_down)}
            </Text>
          </View>
          <Text style={styles.dot}>•</Text>

          {/* Favorites */}
          <View style={styles.iconStatContainer}>
            <MaterialCommunityIcons name="heart" size={14} color="#f472b6" />
            <Text style={styles.iconStatText}>
              {formatNumber(currentVideo.favorites)}
            </Text>
          </View>
        </View>
        <Text style={styles.title}>{currentVideo.title}</Text>

        <Text style={styles.addedDate}>
          {formatDate(currentVideo.added_date)}
        </Text>

        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>
            {currentVideo.channel_name}
            {currentVideo.channel_verified && (
              <Text style={styles.verifiedBadge}> ✓</Text>
            )}
            {currentVideo.channel_award_winner && (
              <Text style={styles.awardBadge}> 🏆</Text>
            )}
          </Text>
          <Text style={styles.subscribers}>
            {formatNumber(currentVideo.channel_subscriber_count)} subscribers
          </Text>
        </View>

        {currentVideo.model_attributes?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Attributes</Text>
            <View style={styles.tags}>
              {currentVideo.model_attributes.map((attribute, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{attribute}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {currentVideo.categories?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.tags}>
              {currentVideo.categories.map((category, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {currentVideo.pornstars?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featuring</Text>
            <View style={styles.tags}>
              {currentVideo.pornstars.map((star, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{star}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {currentVideo.production?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Production</Text>
            <View style={styles.tags}>
              {currentVideo.production.map((prod, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{prod}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {currentVideo.tags?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tags}>
              {currentVideo.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b",
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVideoText: {
    color: "#a1a1aa",
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  addedDate: {
    fontSize: 13,
    color: "#a1a1aa",
    marginTop: 4,
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 5,
    flexWrap: "wrap",
  },
  views: {
    color: "#999",
    fontSize: 14,
    marginRight: 4,
  },
  dot: {
    color: "#999",
    marginHorizontal: 6,
  },
  date: {
    color: "#999",
    fontSize: 14,
  },
  iconStatContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStatText: {
    color: "#999",
    fontSize: 14,
    marginLeft: 4,
  },
  channelInfo: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3f3f46",
    paddingBottom: 16,
  },
  channelName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#FFFFFF",
  },
  verifiedBadge: {
    color: "#FF9500",
  },
  awardBadge: {
    color: "#FF9500",
  },
  subscribers: {
    fontSize: 14,
    color: "#999",
  },
  description: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#18181b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  tagText: {
    fontSize: 14,
    color: "#999",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  viewButton: {
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

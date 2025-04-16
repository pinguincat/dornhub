import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { ChannelHeader } from "../components/channel/ChannelHeader";
import { VideoList } from "../components/channel/VideoList";
import { IVideo } from "../types/channel";
import onGetChannelInfo from "../hooks/onGetChannelInfo";
import onGetChannelVideos from "../hooks/onGetChannelVideos";

export const Channel: React.FC = () => {
  const router = useRouter();
  const { data: channelInfo, isLoading: isLoadingInfo } = onGetChannelInfo();
  const { data: channelVideos, isLoading: isLoadingVideos } =
    onGetChannelVideos();

  const handleVideoPress = (video: IVideo) => {
    router.push({
      pathname: "/video/[videoId]",
      params: { videoId: video.video_id },
    });
  };

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
      >
        <ChannelHeader info={channelInfo} />
        <VideoList videos={channelVideos} onVideoPress={handleVideoPress} />
      </ScrollView>
    </SafeAreaView>
  );
};

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

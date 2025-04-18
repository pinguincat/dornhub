import React from "react";
import { View, StyleSheet } from "react-native";
import { MetricCard } from "./MetricCard";
import { SectionTitle } from "./SectionTitle";

interface PerformanceMetricsProps {
  performance: {
    averageViews: number;
    engagementRate: number;
    viewToEngagementRatio: number;
    favoriteRate: number;
    peakPerformanceTime: string;
  };
  videos: { length: number };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  performance,
  videos,
}) => (
  <View style={styles.section}>
    <SectionTitle title="Performance Metrics" />
    <View style={styles.metricsRow}>
      <MetricCard
        title="Avg Views"
        value={performance.averageViews.toLocaleString()}
        icon="eye"
        trend="up"
        description="Above channel average"
      />
      <MetricCard
        title="Engagement"
        value={performance.engagementRate.toLocaleString()}
        icon="heart"
        trend="neutral"
        description="Industry standard"
      />
      <MetricCard
        title="Videos"
        value={videos.length}
        icon="videocam"
        description="Analyzed videos"
      />
    </View>
    <View style={styles.metricsRow}>
      <MetricCard
        title="View/Engagement"
        value={performance.viewToEngagementRatio.toLocaleString()}
        icon="analytics"
        trend="up"
        description="Strong correlation"
      />
      <MetricCard
        title="Favorites"
        value={performance.favoriteRate.toLocaleString()}
        icon="star"
        trend="up"
        description="High retention rate"
      />
      <MetricCard
        title="Peak Time"
        value={performance.peakPerformanceTime}
        icon="time"
        description="Best performance"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
    backgroundColor: "#27272a",
    borderRadius: 10,
    padding: 15,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

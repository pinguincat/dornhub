import React from "react";
import { View, StyleSheet } from "react-native";
import { MetricCard } from "./MetricCard";
import { SectionTitle } from "./SectionTitle";

interface CategoryPerformance {
  name: string;
  engagement: number;
  trend: "up" | "down" | "neutral";
}

interface TagPerformance {
  name: string;
  usage: number;
  trend: "up" | "down" | "neutral";
}

interface ContentPerformanceProps {
  categoryPerformance: CategoryPerformance[];
  tagPerformance: TagPerformance[];
  peakPerformanceTime: string;
}

export const ContentPerformance: React.FC<ContentPerformanceProps> = ({
  categoryPerformance,
  tagPerformance,
  peakPerformanceTime,
}) => (
  <View style={styles.section}>
    <SectionTitle title="Content Performance" />
    <View style={styles.metricsRow}>
      <MetricCard
        title="Best Category"
        value={categoryPerformance[0].name}
        icon="flame"
        trend={categoryPerformance[0].trend}
        description={`${categoryPerformance[0].engagement}% engagement`}
      />
      <MetricCard
        title="Peak Time"
        value={peakPerformanceTime}
        icon="time"
        description="Highest engagement"
      />
      <MetricCard
        title="Top Tag"
        value={tagPerformance[0].name}
        icon="pricetag"
        trend={tagPerformance[0].trend}
        description={`${tagPerformance[0].usage}% usage`}
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

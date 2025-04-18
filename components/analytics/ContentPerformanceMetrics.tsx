import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Metric {
  label: string;
  value: number;
  change: number;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ContentPerformanceMetricsProps {
  metrics: {
    averageEngagement: Metric;
    reachGrowth: Metric;
    conversionRate: Metric;
    retentionRate: Metric;
  };
}

export const ContentPerformanceMetrics: React.FC<
  ContentPerformanceMetricsProps
> = ({ metrics }) => {
  const renderMetric = (metric: Metric) => {
    const isPositive = metric.change >= 0;
    const changeColor = isPositive ? "#4ade80" : "#f87171";

    return (
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Ionicons name={metric.icon} size={24} color="#FF9500" />
          <Text style={styles.metricLabel}>{metric.label}</Text>
        </View>
        <Text style={styles.metricValue}>{metric.value}%</Text>
        <View style={styles.changeContainer}>
          <Ionicons
            name={isPositive ? "arrow-up" : "arrow-down"}
            size={16}
            color={changeColor}
          />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {Math.abs(metric.change)}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Content Performance Metrics</Text>
      <View style={styles.metricsGrid}>
        {renderMetric(metrics.averageEngagement)}
        {renderMetric(metrics.reachGrowth)}
        {renderMetric(metrics.conversionRate)}
        {renderMetric(metrics.retentionRate)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
    backgroundColor: "#27272a",
    borderRadius: 10,
    padding: 15,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#3f3f46",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  metricLabel: {
    color: "#a1a1aa",
    fontSize: 14,
    marginLeft: 8,
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
}) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Ionicons name={icon as any} size={24} color="#FF9500" />
      {trend && (
        <Ionicons
          name={
            trend === "up"
              ? "trending-up"
              : trend === "down"
              ? "trending-down"
              : "remove"
          }
          size={16}
          color={
            trend === "up"
              ? "#4CAF50"
              : trend === "down"
              ? "#F44336"
              : "#9E9E9E"
          }
        />
      )}
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{title}</Text>
    {description && <Text style={styles.metricDescription}>{description}</Text>}
  </View>
);

const styles = StyleSheet.create({
  metricCard: {
    backgroundColor: "#27272a",
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  metricLabel: {
    color: "#a1a1aa",
    fontSize: 12,
    textAlign: "center",
  },
  metricDescription: {
    color: "#71717a",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },
});

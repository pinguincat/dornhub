import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecommendationCardProps {
  title: string;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  icon,
  priority,
}) => (
  <View style={[styles.recommendationCard, styles[`priority${priority}`]]}>
    <View style={styles.recommendationHeader}>
      <Ionicons name={icon as any} size={24} color="#FFFFFF" />
      <Text style={styles.recommendationTitle}>{title}</Text>
    </View>
    <Text style={styles.recommendationDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  recommendationCard: {
    backgroundColor: "#27272a",
    padding: 15,
    marginBottom: 20,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  recommendationTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  recommendationDescription: {
    color: "#a1a1aa",
    fontSize: 14,
  },
  priorityhigh: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  prioritymedium: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  prioritylow: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
});

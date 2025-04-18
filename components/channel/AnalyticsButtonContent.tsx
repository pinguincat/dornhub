import React from "react";
import { Text, ActivityIndicator, View, StyleSheet } from "react-native";

interface AnalyticsButtonContentProps {
  isGeneratingAnalysis: boolean;
  hasAnalytics: boolean;
}

export const AnalyticsButtonContent: React.FC<AnalyticsButtonContentProps> = ({
  isGeneratingAnalysis,
  hasAnalytics,
}) => {
  if (isGeneratingAnalysis) {
    return (
      <View style={styles.contentContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
        <Text style={styles.buttonText}>Generating Analytics</Text>
      </View>
    );
  }

  return (
    <Text style={styles.buttonText}>
      {hasAnalytics ? "View Analytics" : "Generate Analytics"}
    </Text>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

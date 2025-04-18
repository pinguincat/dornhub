import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ModelAttributesImpactProps {
  modelAttributes: {
    mostCommon: Array<{ attribute: string; frequency: number }>;
    impactOnPerformance: Record<string, { views: number; engagement: number }>;
  };
}

export const ModelAttributesImpact: React.FC<ModelAttributesImpactProps> = ({
  modelAttributes,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Model Attributes Impact</Text>
      <View style={styles.attributesContainer}>
        {modelAttributes.mostCommon.map((attr) => (
          <View key={attr.attribute} style={styles.attributeItem}>
            <Text style={styles.attributeText}>{attr.attribute}</Text>
            <Text style={styles.attributeCount}>{attr.frequency}%</Text>
          </View>
        ))}
      </View>
      <View style={styles.impactChart}>
        <Text style={styles.subtitle}>Attribute Impact on Performance</Text>
        {Object.entries(modelAttributes.impactOnPerformance).map(
          ([attr, data]) => (
            <View key={attr} style={styles.impactItem}>
              <Text style={styles.impactLabel}>{attr}</Text>
              <View style={styles.impactBarContainer}>
                <View style={[styles.impactBar, { width: `${data.views}%` }]} />
              </View>
              <Text style={styles.impactValue}>{data.views}M views</Text>
            </View>
          )
        )}
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
  attributesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  attributeItem: {
    backgroundColor: "#3f3f46",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  attributeText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginRight: 5,
  },
  attributeCount: {
    color: "#FF9500",
    fontSize: 14,
    fontWeight: "bold",
  },
  impactChart: {
    marginTop: 15,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  impactItem: {
    marginBottom: 10,
  },
  impactLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
  },
  impactBarContainer: {
    height: 8,
    backgroundColor: "#3f3f46",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 5,
  },
  impactBar: {
    height: "100%",
    backgroundColor: "#FF9500",
    borderRadius: 4,
  },
  impactValue: {
    color: "#a1a1aa",
    fontSize: 12,
  },
});

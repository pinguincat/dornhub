import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TagPerformance {
  name: string;
  usage: number;
  engagement: number;
  trend: "up" | "down" | "neutral";
}

interface CategoryPerformance {
  name: string;
  engagement: number;
  views: number;
  trend: "up" | "down" | "neutral";
}

interface TopTagsProps {
  tags: TagPerformance[];
}

interface TopCategoriesProps {
  categories: CategoryPerformance[];
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ categories }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Top Categories</Text>
      <View style={styles.attributesContainer}>
        {categories.map((category) => (
          <View key={category.name} style={styles.attributeItem}>
            <Text style={styles.attributeText}>{category.name}</Text>
            <Text style={styles.attributeCount}>{category.engagement}%</Text>
          </View>
        ))}
      </View>
      <View style={styles.impactChart}>
        {categories.map((category) => (
          <View key={category.name} style={styles.impactItem}>
            <Text style={styles.impactLabel}>{category.name}</Text>
            <View style={styles.impactBarContainer}>
              <View
                style={[
                  styles.impactBar,
                  {
                    width: `${category.engagement}%`,
                    backgroundColor:
                      category.trend === "up" ? "#4CAF50" : "#9E9E9E",
                  },
                ]}
              />
            </View>
            <View style={styles.impactMetrics}>
              <Text style={styles.impactValue}>
                Engagement: {category.engagement}%
              </Text>
              <Text style={styles.impactValue}>Views: {category.views}M</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const TopTags: React.FC<TopTagsProps> = ({ tags }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Top Tags</Text>
      <View style={styles.attributesContainer}>
        {tags.map((tag) => (
          <View key={tag.name} style={styles.attributeItem}>
            <Text style={styles.attributeText}>{tag.name}</Text>
            <Text style={styles.attributeCount}>{tag.engagement}%</Text>
          </View>
        ))}
      </View>
      <View style={styles.impactChart}>
        {tags.map((tag) => (
          <View key={tag.name} style={styles.impactItem}>
            <Text style={styles.impactLabel}>{tag.name}</Text>
            <View style={styles.impactBarContainer}>
              <View
                style={[
                  styles.impactBar,
                  {
                    width: `${tag.engagement}%`,
                    backgroundColor: tag.trend === "up" ? "#4CAF50" : "#9E9E9E",
                  },
                ]}
              />
            </View>
            <View style={styles.impactMetrics}>
              <Text style={styles.impactValue}>Usage: {tag.usage}%</Text>
              <Text style={styles.impactValue}>
                Engagement: {tag.engagement}%
              </Text>
            </View>
          </View>
        ))}
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
    borderRadius: 4,
  },
  impactValue: {
    color: "#a1a1aa",
    fontSize: 12,
  },
  impactMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});

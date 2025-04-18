import React from "react";
import { View, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { SectionTitle } from "./SectionTitle";

interface VideoAnalysis {
  categories: string[];
}

interface CategoryDistributionProps {
  videos: VideoAnalysis[];
  screenWidth: number;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({
  videos,
  screenWidth,
}) => {
  const chartConfig = {
    backgroundGradientFrom: "#18181b",
    backgroundGradientTo: "#18181b",
    color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.section}>
      <SectionTitle title="Category Distribution" />
      <View style={styles.chartContainer}>
        <PieChart
          data={Object.entries(
            videos.reduce(
              (acc: Record<string, number>, video: VideoAnalysis) => {
                video.categories.forEach((cat: string) => {
                  acc[cat] = (acc[cat] || 0) + 1;
                });
                return acc;
              },
              {}
            )
          ).map(([name, value]) => ({
            name,
            value,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            legendFontColor: "#FFFFFF",
            legendFontSize: 12,
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="0"
          style={styles.chart}
          absolute
        />
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
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PostingTime {
  hour: string;
  engagement: number;
}

interface OptimalPostingTimesProps {
  postingTimes: PostingTime[];
}

export const OptimalPostingTimes: React.FC<OptimalPostingTimesProps> = ({
  postingTimes,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Optimal Posting Times</Text>
      <View style={styles.timeChartContainer}>
        {postingTimes.map((time) => (
          <View key={time.hour} style={styles.timeBarContainer}>
            <Text style={styles.timeLabel}>{time.hour}</Text>
            <View style={styles.timeBarBackground}>
              <View
                style={[
                  styles.timeBar,
                  {
                    width: `${time.engagement}%`,
                    backgroundColor:
                      time.engagement > 80
                        ? "#4CAF50"
                        : time.engagement > 60
                        ? "#FFC107"
                        : "#F44336",
                  },
                ]}
              />
            </View>
            <Text style={styles.timeValue}>{time.engagement}%</Text>
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
  timeChartContainer: {
    gap: 8,
  },
  timeBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeLabel: {
    color: "#FFFFFF",
    width: 40,
    fontSize: 12,
  },
  timeBarBackground: {
    flex: 1,
    height: 20,
    backgroundColor: "#3f3f46",
    borderRadius: 10,
    overflow: "hidden",
  },
  timeBar: {
    height: "100%",
    borderRadius: 10,
  },
  timeValue: {
    color: "#FFFFFF",
    width: 40,
    fontSize: 12,
    textAlign: "right",
  },
});

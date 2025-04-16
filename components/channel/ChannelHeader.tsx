import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { IChannelInfo } from "../../types/channel";

interface Props {
  info: IChannelInfo;
}

export const ChannelHeader: React.FC<Props> = ({ info }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Text style={styles.modelName}>{info.model_name}</Text>
          {info.is_verified && <Text style={styles.verifiedBadge}>✓</Text>}
          {info.is_award_winner && <Text style={styles.awardBadge}>🏆</Text>}
        </View>
        <Text style={styles.rank}>Rank #{info.model_rank}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(info.subscribers)}</Text>
          <Text style={styles.statLabel}>Subscribers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{info.profile_views}</Text>
          <Text style={styles.statLabel}>Profile Views</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{info.videos_watched}</Text>
          <Text style={styles.statLabel}>Videos Watched</Text>
        </View>
      </View>

      <Text style={styles.about}>{info.about}</Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender:</Text>
          <Text style={styles.detailValue}>{info.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From:</Text>
          <Text style={styles.detailValue}>{info.birth_place}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Height:</Text>
          <Text style={styles.detailValue}>{info.height}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Weight:</Text>
          <Text style={styles.detailValue}>{info.weight}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#18181b",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  modelName: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
    color: "#FFFFFF",
  },
  verifiedBadge: {
    color: "#FF9500",
    fontSize: 18,
    marginRight: 4,
  },
  awardBadge: {
    fontSize: 18,
  },
  rank: {
    fontSize: 16,
    color: "#999",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#18181b",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
  },
  about: {
    fontSize: 14,
    lineHeight: 20,
    color: "#CCCCCC",
    marginBottom: 16,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    color: "#999",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#CCCCCC",
  },
});

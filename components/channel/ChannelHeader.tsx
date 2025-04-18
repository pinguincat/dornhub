import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { IChannelInfo } from "../../types/channel";
import { MaterialIcons } from "@expo/vector-icons";

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

  const handleSocialLinkPress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const renderDetail = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    );
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

      {info.about && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.about}>{info.about}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.details}>
          {renderDetail("Gender", info.gender)}
          {renderDetail("From", info.birth_place)}
          {renderDetail("Height", info.height)}
          {renderDetail("Weight", info.weight)}
          {renderDetail("Ethnicity", info.ethnicity)}
          {renderDetail("Hair Color", info.hair_color)}
          {renderDetail("Relationship", info.relationship_status)}
          {renderDetail("Interested In", info.interested_in)}
          {renderDetail("Fake Boobs", info.fake_boobs)}
          {renderDetail("Tattoos", info.tattoos)}
          {renderDetail("Piercings", info.piercings)}
        </View>
      </View>

      {info.interests_and_hobbie && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
          <Text style={styles.detailValue}>{info.interests_and_hobbie}</Text>
        </View>
      )}

      {info.turn_ons && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Turn Ons</Text>
          <Text style={styles.detailValue}>{info.turn_ons}</Text>
        </View>
      )}

      {info.social_links && info.social_links.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          <View style={styles.socialLinks}>
            {info.social_links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialLink}
                onPress={() => handleSocialLinkPress(link)}
              >
                <MaterialIcons name="link" size={16} color="#FF9500" />
                <Text style={styles.socialLinkText} numberOfLines={1}>
                  {link}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#18181b",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    paddingVertical: 16,
    backgroundColor: "#27272a",
    borderRadius: 16,
  },
  statItem: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  about: {
    fontSize: 14,
    lineHeight: 20,
    color: "#CCCCCC",
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: "#999",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#CCCCCC",
  },
  socialLinks: {
    gap: 8,
  },
  socialLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    backgroundColor: "#27272a",
    borderRadius: 8,
  },
  socialLinkText: {
    flex: 1,
    color: "#FF9500",
    fontSize: 14,
  },
});

import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import * as Clipboard from "expo-clipboard";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  isLoading,
  isRefreshing,
}) => {
  const handlePaste = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      onChangeText(clipboardContent);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter Channel URL"
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        keyboardType="url"
        onSubmitEditing={onSearch}
        editable={!isLoading && !isRefreshing}
      />
      <TouchableOpacity
        style={[
          styles.button,
          (!value.trim() || isLoading || isRefreshing) && styles.buttonDisabled,
        ]}
        onPress={value.trim() ? onSearch : handlePaste}
        disabled={isLoading || isRefreshing}
      >
        <Text style={styles.buttonText}>
          {value.trim() ? "Search" : "Paste"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 15,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#3f3f46",
    backgroundColor: "#27272a",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 8,
    color: "#FFFFFF",
    backgroundColor: "#18181b",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#3f3f46",
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

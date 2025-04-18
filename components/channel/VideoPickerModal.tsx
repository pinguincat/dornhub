import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface VideoPickerModalProps {
  visible: boolean;
  selectedVideoCount: number;
  onClose: () => void;
  onGenerate: () => void;
  onValueChange: (value: number) => void;
}

export const VideoPickerModal: React.FC<VideoPickerModalProps> = ({
  visible,
  selectedVideoCount,
  onClose,
  onGenerate,
  onValueChange,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalContainer}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Videos to Analyze</Text>
          <Picker
            selectedValue={selectedVideoCount}
            onValueChange={onValueChange}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Last 5 Videos" value={5} />
            <Picker.Item label="Last 10 Videos" value={10} />
            <Picker.Item label="Last 20 Videos" value={20} />
          </Picker>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.generateButton]}
              onPress={onGenerate}
            >
              <Text style={styles.modalButtonText}>Generate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#18181b",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
    backgroundColor: "#18181b",
    height: "auto",
  },
  pickerItem: {
    color: "#FFFFFF",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#3f3f46",
  },
  generateButton: {
    backgroundColor: "#FF9500",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';

interface DueDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (dueDate: Date, label: string) => void;
}

export const DueDatePicker: React.FC<DueDatePickerProps> = ({ visible, onClose, onSelect }) => {
  const options = [
    {
      label: 'Today',
      getValue: () => {
        const date = new Date();
        date.setHours(23, 59, 59, 999);
        return date;
      },
    },
    {
      label: 'Tomorrow',
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(23, 59, 59, 999);
        return date;
      },
    },
    {
      label: 'This Week',
      getValue: () => {
        const date = new Date();
        const daysUntilSunday = 7 - date.getDay();
        date.setDate(date.getDate() + daysUntilSunday);
        date.setHours(23, 59, 59, 999);
        return date;
      },
    },
    {
      label: 'Next Week',
      getValue: () => {
        const date = new Date();
        const daysUntilNextSunday = 7 - date.getDay() + 7;
        date.setDate(date.getDate() + daysUntilNextSunday);
        date.setHours(23, 59, 59, 999);
        return date;
      },
    },
    {
      label: 'This Month',
      getValue: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1, 0);
        date.setHours(23, 59, 59, 999);
        return date;
      },
    },
  ];

  const handleSelect = (option: (typeof options)[0]) => {
    const date = option.getValue();
    onSelect(date, option.label);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Due Date</Text>
          </View>

          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleSelect(option)}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDate}>
                {option.getValue().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: EllioSpacing.lg,
  },
  container: {
    backgroundColor: EllioColors.surface.background,
    borderRadius: EllioRadius.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    padding: EllioSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  title: {
    ...EllioTypography.h3,
    color: palette.text,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: EllioSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  optionLabel: {
    ...EllioTypography.body,
    fontWeight: '600',
    color: palette.text,
  },
  optionDate: {
    ...EllioTypography.caption,
    color: EllioColors.text.secondary,
  },
  cancelButton: {
    padding: EllioSpacing.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...EllioTypography.button,
    color: EllioColors.states.error.main,
  },
});

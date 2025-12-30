import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  secondaryActionText?: string;
  onSecondaryActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📋',
  title,
  message,
  actionText,
  onActionPress,
  secondaryActionText,
  onSecondaryActionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {actionText && onActionPress && (
        <TouchableOpacity style={styles.primaryButton} onPress={onActionPress}>
          <Text style={styles.primaryButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
      
      {secondaryActionText && onSecondaryActionPress && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onSecondaryActionPress}>
          <Text style={styles.secondaryButtonText}>{secondaryActionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  secondaryButtonText: {
    ...typography.body,
    color: palette.primary,
  },
});

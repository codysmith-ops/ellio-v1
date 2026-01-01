/**
 * Feature Tooltip Component
 * Shows when new features are unlocked
 * Max 1 per session
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import {
  type FeatureName,
  getFeatureTitle,
  getFeatureDescription,
  markFeatureRevealed,
  suppressFeatureTooltip,
} from '../services/progressiveDisclosure.service';

export interface FeatureTooltipProps {
  visible: boolean;
  feature: FeatureName;
  onShowMe: () => void;
  onNotNow: () => void;
}

export const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  visible,
  feature,
  onShowMe,
  onNotNow,
}) => {
  const title = getFeatureTitle(feature);
  const description = getFeatureDescription(feature);

  const handleShowMe = async () => {
    await markFeatureRevealed(feature);
    onShowMe();
  };

  const handleNotNow = async () => {
    await suppressFeatureTooltip(feature);
    onNotNow();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleNotNow}
    >
      <View style={styles.overlay}>
        <View style={styles.tooltip}>
          <View style={styles.header}>
            <Text style={styles.badge}>New</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <Text style={styles.footnote}>Want to see it?</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.showMeButton}
              onPress={handleShowMe}
            >
              <Text style={styles.showMeButtonText}>Show me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notNowButton}
              onPress={handleNotNow}
            >
              <Text style={styles.notNowButtonText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: EllioSpacing.xl,
  },
  tooltip: {
    backgroundColor: EllioColors.surface.background,
    borderRadius: EllioRadius.xl,
    padding: EllioSpacing.xl,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    marginBottom: EllioSpacing.md,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: EllioColors.primary.main,
    backgroundColor: EllioColors.primary.mainLight,
    paddingHorizontal: EllioSpacing.sm,
    paddingVertical: EllioSpacing.xs,
    borderRadius: EllioRadius.sm,
    alignSelf: 'flex-start',
  },
  title: {
    ...EllioTypography.h3,
    color: palette.text,
    marginBottom: EllioSpacing.sm,
  },
  description: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    lineHeight: 22,
    marginBottom: EllioSpacing.md,
  },
  footnote: {
    ...EllioTypography.secondary,
    color: EllioColors.text.tertiary,
    marginBottom: EllioSpacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    gap: EllioSpacing.sm,
  },
  showMeButton: {
    flex: 1,
    backgroundColor: EllioColors.primary.main,
    borderRadius: EllioRadius.md,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
  },
  showMeButtonText: {
    ...EllioTypography.bodyBold,
    color: '#fff',
  },
  notNowButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: EllioRadius.md,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  notNowButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
});

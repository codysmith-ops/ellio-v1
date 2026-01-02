import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography, EllioShadow } from '../theme/ellioTokens';

interface FeatureTipProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: string;
  canDisable?: boolean;
  onClose: () => void;
  onDisableForever?: () => void;
}

export const FeatureTip: React.FC<FeatureTipProps> = ({
  visible,
  title,
  message,
  icon = 'lightbulb',
  canDisable = true,
  onClose,
  onDisableForever,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleDisable = () => {
    if (onDisableForever) {
      onDisableForever();
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.tipBubble, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <ScrollView style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
              <Text style={styles.gotItButtonText}>Got it!</Text>
            </TouchableOpacity>
            {canDisable && onDisableForever && (
              <TouchableOpacity style={styles.disableButton} onPress={handleDisable}>
                <Text style={styles.disableButtonText}>Don't show again</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: EllioSpacing.xl,
  },
  tipBubble: {
    backgroundColor: EllioColors.surface.background,
    borderRadius: EllioRadius.card,
    padding: EllioSpacing.xl,
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    ...EllioShadow.elevated,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: EllioSpacing.md,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    ...EllioTypography.h3,
    color: palette.text,
    textAlign: 'center',
    marginBottom: EllioSpacing.md,
  },
  messageContainer: {
    maxHeight: 300,
    marginBottom: EllioSpacing.lg,
  },
  message: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: EllioSpacing.sm,
  },
  gotItButton: {
    backgroundColor: EllioColors.primary.main,
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.lg,
    borderRadius: EllioRadius.button,
    alignItems: 'center',
  },
  gotItButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
  disableButton: {
    paddingVertical: EllioSpacing.sm,
    paddingHorizontal: EllioSpacing.md,
    borderRadius: EllioRadius.button,
    alignItems: 'center',
  },
  disableButtonText: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography, EllioShadow } from '../theme/ellioTokens';

interface FeatureOnboardingProps {
  visible: boolean;
  onClose: () => void;
  feature: 'voice' | 'camera' | 'barcode' | 'receipt';
}

const featureContent = {
  voice: {
    icon: '🎤',
    title: 'Voice Input',
    steps: [
      'Tap the microphone button',
      'Speak naturally: "Add milk and eggs to my grocery list"',
      'Ellio will parse your request and create tasks',
      'You can specify quantities, stores, and due dates',
    ],
    examples: [
      '"Buy 2 gallons of milk"',
      '"Pick up prescription at CVS by Friday"',
      '"Add eggs, bread, and cheese"',
    ],
  },
  camera: {
    icon: '📸',
    title: 'Photo Recognition',
    steps: [
      'Tap the camera button',
      'Take a photo of any product or label',
      'Ellio will recognize the product automatically',
      'Details like name, brand, and size are auto-filled',
    ],
    examples: [
      'Photo of cereal box → Auto-fills "Cheerios Original 18oz"',
      'Photo of shampoo → Recognizes brand and size',
      'Photo of prescription → Captures medication name',
    ],
  },
  barcode: {
    icon: '📱',
    title: 'Barcode Scanner',
    steps: [
      'Tap "Scan SKU" button',
      'Point camera at any barcode or QR code',
      'Ellio looks up the product in our database',
      'Find nearby stores with prices and availability',
    ],
    examples: [
      'Scan UPC → Instant product details',
      'See which stores have it in stock',
      'Compare prices across retailers',
    ],
  },
  receipt: {
    icon: '🧾',
    title: 'Receipt Scanner',
    steps: [
      'Go to Receipts page from menu',
      'Tap "Scan Receipt" button',
      'Take a photo of your receipt',
      'Ellio extracts items, prices, and cashback',
    ],
    examples: [
      'Track spending by category',
      'Calculate savings vs average prices',
      'Auto-suggest better deals',
    ],
  },
};

export const FeatureOnboarding: React.FC<FeatureOnboardingProps> = ({
  visible,
  onClose,
  feature,
}) => {
  const content = featureContent[feature];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.icon}>{content.icon}</Text>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.subtitle}>How it works:</Text>

            <View style={styles.stepsContainer}>
              {content.steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.examplesTitle}>Examples:</Text>
            <View style={styles.examplesContainer}>
              {content.examples.map((example, index) => (
                <View key={index} style={styles.exampleRow}>
                  <Text style={styles.exampleBullet}>•</Text>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Got it!</Text>
            </TouchableOpacity>
          </ScrollView>
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
    padding: EllioSpacing.lg,
  },
  modal: {
    backgroundColor: EllioColors.surface.background,
    borderRadius: EllioRadius.card,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 400,
    ...EllioShadow.elevated,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: EllioSpacing.xl,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: EllioSpacing.md,
  },
  title: {
    ...EllioTypography.h2,
    color: palette.text,
    textAlign: 'center',
    marginBottom: EllioSpacing.lg,
  },
  subtitle: {
    ...EllioTypography.subtitle,
    color: palette.text,
    marginBottom: EllioSpacing.md,
  },
  stepsContainer: {
    marginBottom: EllioSpacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: EllioSpacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: EllioColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: EllioSpacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
    fontSize: 14,
  },
  stepText: {
    ...EllioTypography.body,
    color: palette.text,
    flex: 1,
    lineHeight: 22,
  },
  examplesTitle: {
    ...EllioTypography.subtitle,
    color: palette.text,
    marginBottom: EllioSpacing.md,
  },
  examplesContainer: {
    backgroundColor: EllioColors.surface.background,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.button,
    marginBottom: EllioSpacing.xl,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: EllioSpacing.sm,
  },
  exampleBullet: {
    ...EllioTypography.body,
    color: EllioColors.primary.main,
    marginRight: EllioSpacing.sm,
    fontSize: 18,
  },
  exampleText: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
    flex: 1,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: EllioColors.primary.main,
    paddingVertical: EllioSpacing.md,
    borderRadius: EllioRadius.button,
    alignItems: 'center',
  },
  buttonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import { LightbulbIcon, CheckmarkIcon } from './Icons';

interface BrandPreferenceDialogProps {
  visible: boolean;
  itemName: string;
  category: string;
  onSelect: (brandPreference: BrandPreference) => void;
  onCancel: () => void;
}

export interface BrandPreference {
  preferredBrand?: string;
  acceptAlternatives: boolean;
  specificDetails?: string;
}

// Common brands by category
const BRAND_SUGGESTIONS: Record<string, string[]> = {
  groceries: [
    'Kirkland',
    'Great Value',
    'Whole Foods 365',
    "Trader Joe's",
    'Private Selection',
    'No Preference',
  ],
  hardware: ['DeWalt', 'Milwaukee', 'Craftsman', 'Ryobi', 'Husky', 'No Preference'],
  medical: ['Generic', 'Brand Name Only', 'Equate', 'CVS Health', 'Walgreens', 'No Preference'],
  retail: ['Any Brand', 'Store Brand Preferred', 'Premium Only', 'No Preference'],
  returns: ['Original Brand', 'No Preference'],
  home: ['Method', 'Seventh Generation', 'Lysol', 'Clorox', 'Store Brand', 'No Preference'],
  other: ['No Preference'],
};

export const BrandPreferenceDialog: React.FC<BrandPreferenceDialogProps> = ({
  visible,
  itemName,
  category,
  onSelect,
  onCancel,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [acceptAlternatives, setAcceptAlternatives] = useState(true);
  const [customBrand, setCustomBrand] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const brands = BRAND_SUGGESTIONS[category] || BRAND_SUGGESTIONS.other;

  const handleConfirm = () => {
    const brand = showCustomInput ? customBrand : selectedBrand;
    onSelect({
      preferredBrand: brand === 'No Preference' ? undefined : brand,
      acceptAlternatives,
      specificDetails: specificDetails.trim() || undefined,
    });

    // Reset state
    setSelectedBrand('');
    setCustomBrand('');
    setSpecificDetails('');
    setShowCustomInput(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Brand Preference</Text>
            <Text style={styles.subtitle}>for "{itemName}"</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Do you have a preferred brand?</Text>

            <View style={styles.brandGrid}>
              {brands.map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.brandOption,
                    selectedBrand === brand && styles.brandOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedBrand(brand);
                    setShowCustomInput(false);
                  }}
                >
                  <Text
                    style={[
                      styles.brandOptionText,
                      selectedBrand === brand && styles.brandOptionTextSelected,
                    ]}
                  >
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.brandOption, showCustomInput && styles.brandOptionSelected]}
                onPress={() => {
                  setShowCustomInput(true);
                  setSelectedBrand('');
                }}
              >
                <Text
                  style={[
                    styles.brandOptionText,
                    showCustomInput && styles.brandOptionTextSelected,
                  ]}
                >
                  iconicon Other Brand
                </Text>
              </TouchableOpacity>
            </View>

            {showCustomInput && (
              <View style={styles.customInputContainer}>
                <Text style={styles.label}>Enter brand name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Cascade, Tide"
                  value={customBrand}
                  onChangeText={setCustomBrand}
                  placeholderTextColor={EllioColors.text.tertiary}
                  autoFocus
                />
              </View>
            )}

            {(selectedBrand && selectedBrand !== 'No Preference') || showCustomInput ? (
              <View style={styles.alternativesSection}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAcceptAlternatives(!acceptAlternatives)}
                >
                  <View style={[styles.checkbox, acceptAlternatives && styles.checkboxChecked]}>
                    {acceptAlternatives && <CheckmarkIcon size={16} color="#FFFFFF" />}
                  </View>
                  <View style={styles.checkboxLabel}>
                    <Text style={styles.checkboxText}>
                      Accept alternatives if brand unavailable
                    </Text>
                    <Text style={styles.checkboxSubtext}>
                      We'll suggest similar options if your preferred brand isn't found
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.detailsSection}>
              <Text style={styles.label}>Additional details (optional):</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Size, color, specific features..."
                value={specificDetails}
                onChangeText={setSpecificDetails}
                multiline
                numberOfLines={3}
                placeholderTextColor={EllioColors.text.tertiary}
              />
            </View>

            <View style={styles.tipBox}>
              <LightbulbIcon size={16} color={EllioColors.primary.main} />
              <Text style={styles.tipText}>
                We'll remember your preference for similar items in the future!
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !(selectedBrand || customBrand) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!(selectedBrand || customBrand)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
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
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: EllioColors.surface.background,
    borderTopLeftRadius: EllioRadius.card * 2,
    borderTopRightRadius: EllioRadius.card * 2,
    maxHeight: '85%',
  },
  header: {
    padding: EllioSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  title: {
    ...EllioTypography.h3,
    color: palette.text,
    marginBottom: 4,
  },
  subtitle: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
  },
  content: {
    padding: EllioSpacing.lg,
  },
  sectionTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    marginBottom: EllioSpacing.md,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EllioSpacing.sm,
    marginBottom: EllioSpacing.lg,
  },
  brandOption: {
    paddingVertical: EllioSpacing.sm,
    paddingHorizontal: EllioSpacing.md,
    borderRadius: EllioRadius.button,
    backgroundColor: EllioColors.surface.background,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
  },
  brandOptionSelected: {
    borderColor: EllioColors.primary.main,
    backgroundColor: palette.infoLight,
  },
  brandOptionText: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
  },
  brandOptionTextSelected: {
    ...EllioTypography.bodyBold,
    color: EllioColors.primary.main,
  },
  customInputContainer: {
    marginBottom: EllioSpacing.lg,
  },
  label: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    marginBottom: EllioSpacing.sm,
  },
  input: {
    ...EllioTypography.body,
    backgroundColor: EllioColors.surface.background,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    borderRadius: EllioRadius.button,
    paddingHorizontal: EllioSpacing.md,
    paddingVertical: EllioSpacing.md,
    color: palette.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  alternativesSection: {
    marginBottom: EllioSpacing.lg,
    backgroundColor: EllioColors.surface.background,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.card,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: EllioColors.primary.main,
    borderColor: EllioColors.primary.main,
  },
  checkmark: {
    color: EllioColors.surface.background,
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxText: {
    ...EllioTypography.body,
    color: palette.text,
    marginBottom: 2,
  },
  checkboxSubtext: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
  detailsSection: {
    marginBottom: EllioSpacing.lg,
  },
  tipBox: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
    backgroundColor: palette.infoLight,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.card,
    borderWidth: 1,
    borderColor: EllioColors.primary.main,
    marginBottom: EllioSpacing.md,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    ...EllioTypography.secondary,
    color: EllioColors.primary.main,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: EllioSpacing.lg,
    gap: EllioSpacing.md,
    borderTopWidth: 1,
    borderTopColor: EllioColors.border.standard,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    borderRadius: EllioRadius.button,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  cancelButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  confirmButton: {
    flex: 2,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    backgroundColor: EllioColors.primary.main,
    borderRadius: EllioRadius.button,
  },
  confirmButtonDisabled: {
    backgroundColor: EllioColors.border.standard,
  },
  confirmButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
});

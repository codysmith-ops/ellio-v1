import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import { LightbulbIcon, CheckmarkIcon } from './Icons';

interface StorePreferenceDialogProps {
  visible: boolean;
  category: string;
  onSubmit: (selectedStores: string[]) => void;
  onSkip: () => void;
}

// Store options by category
const STORE_OPTIONS: Record<string, Array<{ id: string; name: string; icon: string }>> = {
  groceries: [
    { id: 'whole-foods', name: 'Whole Foods', icon: 'store' },
    { id: 'trader-joes', name: "Trader Joe's", icon: 'store' },
    { id: 'safeway', name: 'Safeway', icon: 'store' },
    { id: 'costco', name: 'Costco', icon: 'store' },
    { id: 'target', name: 'Target', icon: 'store' },
    { id: 'walmart', name: 'Walmart', icon: 'store' },
    { id: 'kroger', name: 'Kroger', icon: 'iconicon' },
    { id: 'sprouts', name: 'Sprouts', icon: 'store' },
  ],
  hardware: [
    { id: 'home-depot', name: 'Home Depot', icon: 'store' },
    { id: 'lowes', name: "Lowe's", icon: 'store' },
    { id: 'ace-hardware', name: 'Ace Hardware', icon: 'iconicon' },
    { id: 'harbor-freight', name: 'Harbor Freight', icon: 'iconicon' },
    { id: 'menards', name: 'Menards', icon: 'iconicon' },
    { id: 'tractor-supply', name: 'Tractor Supply', icon: 'store' },
  ],
  retail: [
    { id: 'target', name: 'Target', icon: 'store' },
    { id: 'walmart', name: 'Walmart', icon: 'store' },
    { id: 'amazon', name: 'Amazon', icon: 'store' },
    { id: 'best-buy', name: 'Best Buy', icon: 'store' },
    { id: 'kohls', name: "Kohl's", icon: 'store' },
    { id: 'macys', name: "Macy's", icon: 'store' },
    { id: 'tj-maxx', name: 'TJ Maxx', icon: 'iconicon' },
    { id: 'marshalls', name: 'Marshalls', icon: 'store' },
  ],
  medical: [
    { id: 'cvs', name: 'CVS', icon: 'iconicon' },
    { id: 'walgreens', name: 'Walgreens', icon: 'store' },
    { id: 'rite-aid', name: 'Rite Aid', icon: 'store' },
    { id: 'walmart-pharmacy', name: 'Walmart Pharmacy', icon: 'store' },
    { id: 'costco-pharmacy', name: 'Costco Pharmacy', icon: 'store' },
    { id: 'kroger-pharmacy', name: 'Kroger Pharmacy', icon: 'store' },
  ],
  home: [
    { id: 'bed-bath-beyond', name: 'Bed Bath & Beyond', icon: 'iconicon' },
    { id: 'container-store', name: 'Container Store', icon: 'store' },
    { id: 'ikea', name: 'IKEA', icon: 'store' },
    { id: 'target', name: 'Target', icon: 'store' },
    { id: 'homegoods', name: 'HomeGoods', icon: 'store' },
    { id: 'wayfair', name: 'Wayfair', icon: 'iconicon' },
  ],
  returns: [
    { id: 'amazon', name: 'Amazon', icon: 'store' },
    { id: 'target', name: 'Target', icon: 'store' },
    { id: 'walmart', name: 'Walmart', icon: 'store' },
    { id: 'costco', name: 'Costco', icon: 'store' },
    { id: 'best-buy', name: 'Best Buy', icon: 'store' },
    { id: 'kohls', name: "Kohl's", icon: 'iconicon' },
  ],
  other: [
    { id: 'amazon', name: 'Amazon', icon: 'store' },
    { id: 'target', name: 'Target', icon: 'store' },
    { id: 'walmart', name: 'Walmart', icon: 'store' },
    { id: 'local-store', name: 'Local Store', icon: 'store' },
  ],
};

const getCategoryTitle = (category: string): string => {
  const titles: Record<string, string> = {
    groceries: 'Grocery Stores',
    hardware: 'Hardware Stores',
    retail: 'Retail Stores',
    medical: 'Pharmacies',
    home: 'Home Stores',
    returns: 'Return Locations',
    other: 'Stores',
  };
  return titles[category] || 'Stores';
};

export const StorePreferenceDialog: React.FC<StorePreferenceDialogProps> = ({
  visible,
  category,
  onSubmit,
  onSkip,
}) => {
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());

  const stores = STORE_OPTIONS[category] || STORE_OPTIONS.other;

  const toggleStore = (storeId: string) => {
    const newSelected = new Set(selectedStores);
    if (newSelected.has(storeId)) {
      newSelected.delete(storeId);
    } else {
      newSelected.add(storeId);
    }
    setSelectedStores(newSelected);
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedStores));
    setSelectedStores(new Set());
  };

  const handleSkip = () => {
    setSelectedStores(new Set());
    onSkip();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleSkip}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Your Preferred {getCategoryTitle(category)}</Text>
            <Text style={styles.subtitle}>
              Choose the stores you prefer to shop at for {category} items
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.storeGrid}>
              {stores.map(store => {
                const isSelected = selectedStores.has(store.id);
                return (
                  <TouchableOpacity
                    key={store.id}
                    style={[styles.storeCard, isSelected && styles.storeCardSelected]}
                    onPress={() => toggleStore(store.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <CheckmarkIcon size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={styles.storeIcon}>{store.icon}</Text>
                    <Text
                      style={[styles.storeName, isSelected && styles.storeNameSelected]}
                      numberOfLines={2}
                    >
                      {store.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.tipBox}>
              <LightbulbIcon size={16} color={EllioColors.primary.main} />
              <Text style={styles.tipText}>
                We'll use these preferences to help you find the best deals and optimize your
                shopping trips!
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                selectedStores.size === 0 && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={selectedStores.size === 0}
            >
              <Text style={styles.submitButtonText}>
                Save {selectedStores.size > 0 ? `(${selectedStores.size})` : ''}
              </Text>
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
    maxHeight: '90%',
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
  storeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EllioSpacing.md,
    marginBottom: EllioSpacing.lg,
  },
  storeCard: {
    width: '47%',
    backgroundColor: EllioColors.surface.background,
    borderRadius: EllioRadius.card,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    padding: EllioSpacing.md,
    alignItems: 'center',
    gap: EllioSpacing.sm,
    position: 'relative',
  },
  storeCardSelected: {
    borderColor: EllioColors.primary.main,
    backgroundColor: palette.infoLight,
  },
  checkbox: {
    position: 'absolute',
    top: EllioSpacing.sm,
    right: EllioSpacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: EllioColors.primary.main,
    borderColor: EllioColors.primary.main,
  },
  checkmark: {
    color: EllioColors.surface.background,
    fontSize: 16,
    fontWeight: '700',
  },
  storeIcon: {
    fontSize: 32,
    marginTop: EllioSpacing.sm,
  },
  storeName: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    textAlign: 'center',
    fontSize: 14,
  },
  storeNameSelected: {
    color: EllioColors.primary.main,
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
  skipButton: {
    flex: 1,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    borderRadius: EllioRadius.button,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  skipButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  submitButton: {
    flex: 2,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    backgroundColor: EllioColors.primary.main,
    borderRadius: EllioRadius.button,
  },
  submitButtonDisabled: {
    backgroundColor: EllioColors.border.standard,
  },
  submitButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
});

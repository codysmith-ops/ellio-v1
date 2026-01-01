/**
 * Comprehensive Store Results Component
 * Displays ALL nearby stores with filtering, grouping, and map view
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Linking,
  Switch,
} from 'react-native';
import { StoreResult } from '../services/storeSearch';
import {
  StoreType,
  STORE_CATEGORIES,
  filterStores,
  groupStoresByType,
} from '../services/storeDiscovery';
import { EllioColors, EllioSpacing, EllioRadius } from '../theme/ellioTokens';
import {
  LocationIcon,
  PhoneIcon,
  NavigationIcon,
  LinkIcon,
  StarIcon,
  ListIcon,
  FolderIcon,
  MapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from './Icons';

interface Props {
  results: StoreResult[];
  userLocation?: { latitude: number; longitude: number };
  onStoreSelect?: (result: StoreResult) => void;
}

export const ComprehensiveStoreResults: React.FC<Props> = ({
  results,
  userLocation: _userLocation,
  onStoreSelect,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grouped' | 'map'>('grouped');
  const [filters, setFilters] = useState({
    maxDistance: 10,
    inStockOnly: false,
    storeTypes: [] as StoreType[],
    minRating: 0,
    showFilters: false,
  });

  // Apply filters
  const filteredResults = useMemo(() => {
    return filterStores(results, {
      maxDistance: filters.maxDistance,
      inStockOnly: filters.inStockOnly,
      storeTypes: filters.storeTypes.length > 0 ? filters.storeTypes : undefined,
      minRating: filters.minRating,
    });
  }, [results, filters]);

  // Group by store type
  const groupedResults = useMemo(() => {
    const grouped = groupStoresByType(filteredResults);
    return Array.from(grouped.entries())
      .filter(([_, stores]) => stores.length > 0)
      .map(([type, stores]) => {
        const category = STORE_CATEGORIES.find(c => c.type === type);
        return {
          title: category?.label || type,
          icon: category?.icon || 'ST',
          data: stores,
        };
      });
  }, [filteredResults]);

  const toggleStoreTypeFilter = (type: StoreType) => {
    setFilters(prev => ({
      ...prev,
      storeTypes: prev.storeTypes.includes(type)
        ? prev.storeTypes.filter(t => t !== type)
        : [...prev.storeTypes, type],
    }));
  };

  const formatDistance = (meters?: number): string => {
    if (!meters) {
      return '';
    }
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    const miles = meters / 1609.34;
    return `${miles.toFixed(1)} mi`;
  };

  const getAvailabilityColor = (availability: string): string => {
    if (availability === 'In Stock') {
      return EllioColors.states.success.main;
    }
    if (availability === 'Low Stock') {
      return EllioColors.states.warning.main;
    }
    if (availability === 'Out of Stock') {
      return EllioColors.states.error.main;
    }
    return EllioColors.text.secondary;
  };

  const openNavigation = (result: StoreResult) => {
    if (result.storeLocation?.latitude && result.storeLocation?.longitude) {
      const url = `https://maps.apple.com/?daddr=${result.storeLocation.latitude},${result.storeLocation.longitude}`;
      Linking.openURL(url);
    }
  };

  const StoreCard = ({ item }: { item: StoreResult }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => onStoreSelect?.(item)}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.store}, ${item.productName}${
        item.price ? `, $${item.price.toFixed(2)}` : ''
      }, ${item.availability}${
        item.storeLocation?.distance ? `, ${formatDistance(item.storeLocation.distance)} away` : ''
      }`}
      accessibilityHint="Double tap to view store details"
    >
      <View style={styles.cardHeader}>
        <Text style={styles.storeLogo} aria-hidden={true}>
          {item.storeLogo}
        </Text>
        <View style={styles.headerInfo}>
          <Text style={styles.storeName}>{item.store}</Text>
          {item.storeLocation?.distance && (
            <Text style={styles.distance}>{formatDistance(item.storeLocation.distance)}</Text>
          )}
        </View>
        <View
          style={[
            styles.availabilityBadge,
            { backgroundColor: getAvailabilityColor(item.availability) },
          ]}
        >
          <Text style={styles.availabilityText}>{item.availability}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productName}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {item.price ? `$${item.price.toFixed(2)}` : 'Price unavailable'}
          </Text>
          {item.storeLocation?.rating && (
            <View style={styles.ratingContainer}>
              <StarIcon size={16} color="#D97706" filled />
              <Text style={styles.rating}>{item.storeLocation.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      {item.storeLocation && (
        <View style={styles.cardFooter}>
          <View style={styles.addressContainer}>
            <LocationIcon size={14} color={EllioColors.text.secondary} />
            <Text style={styles.address} numberOfLines={1}>
              {item.storeLocation.address}
            </Text>
          </View>
          <View style={styles.actions}>
            {item.storeLocation.phone && (
              <TouchableOpacity
                style={styles.actionButtonContainer}
                onPress={() => Linking.openURL(`tel:${item.storeLocation!.phone}`)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Call ${item.store}`}
                accessibilityHint="Double tap to call this store"
              >
                <PhoneIcon size={16} color={EllioColors.primary.main} />
                <Text style={styles.actionButton}>Call</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButtonContainer}
              onPress={() => openNavigation(item)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Navigate to store"
              accessibilityHint="Double tap to open navigation in Maps"
            >
              <NavigationIcon size={16} color={EllioColors.primary.main} />
              <Text style={styles.actionButton}>Navigate</Text>
            </TouchableOpacity>
            {item.url && (
              <TouchableOpacity
                style={styles.actionButtonContainer}
                onPress={() => Linking.openURL(item.url!)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="View store website"
                accessibilityHint="Double tap to open store website"
              >
                <LinkIcon size={16} color={EllioColors.primary.main} />
                <Text style={styles.actionButton}>View</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with stats */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{filteredResults.length} stores found</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statText}>
            {filteredResults.filter(r => r.inStock).length} in stock
          </Text>
          <Text style={styles.statDivider}>•</Text>
          <Text style={styles.statText}>Within {filters.maxDistance} mi</Text>
        </View>
      </View>

      {/* Filter Toggle */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setFilters(p => ({ ...p, showFilters: !p.showFilters }))}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={filters.showFilters ? 'Hide filters' : 'Show filters'}
        accessibilityHint="Double tap to toggle filter panel"
        accessibilityState={{ expanded: filters.showFilters }}
      >
        <View style={styles.filterToggleContent}>
          {filters.showFilters ? (
            <ChevronDownIcon size={18} color={EllioColors.primary.main} />
          ) : (
            <ChevronRightIcon size={18} color={EllioColors.primary.main} />
          )}
          <Text style={styles.filterToggleText}>Filters</Text>
        </View>
        {(filters.inStockOnly || filters.storeTypes.length > 0) && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>Active</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Filters Panel */}
      {filters.showFilters && (
        <View style={styles.filtersPanel}>
          {/* In Stock Only */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>In Stock Only</Text>
            <Switch
              value={filters.inStockOnly}
              onValueChange={v => setFilters(p => ({ ...p, inStockOnly: v }))}
              trackColor={{ false: EllioColors.border.standard, true: EllioColors.primary.main }}
            />
          </View>

          {/* Distance Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Max Distance: {filters.maxDistance} mi</Text>
          </View>
          <View style={styles.distanceButtons}>
            {[5, 10, 15, 25].map(distance => (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.distanceButton,
                  filters.maxDistance === distance && styles.distanceButtonActive,
                ]}
                onPress={() => setFilters(p => ({ ...p, maxDistance: distance }))}
              >
                <Text
                  style={[
                    styles.distanceButtonText,
                    filters.maxDistance === distance && styles.distanceButtonTextActive,
                  ]}
                >
                  {distance} mi
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Store Type Filters */}
          <Text style={styles.filterSectionTitle}>Store Types</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.storeTypeFilters}>
              {STORE_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.type}
                  style={[
                    styles.storeTypeChip,
                    filters.storeTypes.includes(category.type) && styles.storeTypeChipActive,
                  ]}
                  onPress={() => toggleStoreTypeFilter(category.type)}
                >
                  <Text style={styles.storeTypeIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.storeTypeLabel,
                      filters.storeTypes.includes(category.type) && styles.storeTypeLabelActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Clear Filters */}
          {(filters.inStockOnly || filters.storeTypes.length > 0 || filters.maxDistance !== 10) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() =>
                setFilters(p => ({
                  ...p,
                  inStockOnly: false,
                  storeTypes: [],
                  maxDistance: 10,
                  minRating: 0,
                }))
              }
            >
              <Text style={styles.clearFiltersText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* View Mode Selector */}
      <View style={styles.viewModeSelector}>
        {(['list', 'grouped', 'map'] as const).map(mode => {
          const isActive = viewMode === mode;
          const iconColor = isActive ? EllioColors.primary.main : EllioColors.text.tertiary;
          return (
            <TouchableOpacity
              key={mode}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${mode} view`}
              accessibilityHint={`Double tap to switch to ${mode} view`}
              accessibilityState={{ selected: isActive }}
              style={[styles.viewModeButton, isActive && styles.viewModeButtonActive]}
              onPress={() => setViewMode(mode)}
            >
              {mode === 'list' && <ListIcon size={24} color={iconColor} />}
              {mode === 'grouped' && <FolderIcon size={24} color={iconColor} />}
              {mode === 'map' && <MapIcon size={24} color={iconColor} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results */}
      {viewMode === 'grouped' ? (
        <SectionList
          sections={groupedResults}
          keyExtractor={(item, index) => `${item.store}-${index}`}
          renderItem={({ item }) => <StoreCard item={item} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>
                {section.title} ({section.data.length})
              </Text>
            </View>
          )}
          stickySectionHeadersEnabled
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No stores found matching your filters</Text>
            </View>
          }
        />
      ) : viewMode === 'list' ? (
        <ScrollView>
          {filteredResults.map((item, index) => (
            <StoreCard key={`${item.store}-${index}`} item={item} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <MapIcon size={64} color={EllioColors.text.tertiary} />
          <Text style={styles.mapPlaceholderText}>Map view coming soon</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Will show all {filteredResults.length} stores on interactive map
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EllioColors.surface.background,
  },
  header: {
    padding: EllioSpacing.md,
    backgroundColor: EllioColors.surface.background,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: EllioColors.text.secondary,
  },
  statDivider: {
    marginHorizontal: EllioSpacing.sm,
    color: EllioColors.text.secondary,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: EllioSpacing.md,
    backgroundColor: EllioColors.surface.background,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  filterToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.sm,
  },
  filterToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: EllioColors.primary.main,
  },
  activeFilterBadge: {
    backgroundColor: EllioColors.primary.main,
    paddingHorizontal: EllioSpacing.sm,
    paddingVertical: 4,
    borderRadius: EllioRadius.badge, // 6px per design system
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filtersPanel: {
    backgroundColor: EllioColors.surface.background,
    padding: EllioSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: EllioSpacing.md,
  },
  filterLabel: {
    fontSize: 16,
    color: palette.text,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: EllioColors.text.secondary,
    marginTop: EllioSpacing.sm,
    marginBottom: EllioSpacing.sm,
  },
  distanceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: EllioSpacing.md,
  },
  distanceButton: {
    flex: 1,
    padding: EllioSpacing.sm,
    marginHorizontal: 4,
    borderRadius: EllioRadius.button, // 8px per design system
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    alignItems: 'center',
  },
  distanceButtonActive: {
    backgroundColor: EllioColors.primary.main,
    borderColor: EllioColors.primary.main,
  },
  distanceButtonText: {
    fontSize: 14,
    color: palette.text,
  },
  distanceButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  storeTypeFilters: {
    flexDirection: 'row',
    gap: EllioSpacing.sm,
    marginBottom: EllioSpacing.md,
  },
  storeTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: EllioSpacing.md,
    paddingVertical: EllioSpacing.sm,
    borderRadius: EllioRadius.full,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
  },
  storeTypeChipActive: {
    backgroundColor: EllioColors.primary.main,
    borderColor: EllioColors.primary.main,
  },
  storeTypeIcon: {
    fontSize: 16,
    marginRight: EllioSpacing.xs,
  },
  storeTypeLabel: {
    fontSize: 14,
    color: palette.text,
  },
  storeTypeLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  clearFiltersButton: {
    padding: EllioSpacing.sm,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 14,
    color: EllioColors.states.error.main,
    fontWeight: '600',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: EllioColors.surface.background,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  viewModeButton: {
    flex: 1,
    padding: EllioSpacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  viewModeButtonActive: {
    borderBottomColor: EllioColors.primary.main,
  },
  viewModeText: {
    fontSize: 24,
    opacity: 0.5,
  },
  viewModeTextActive: {
    opacity: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: EllioSpacing.md,
    backgroundColor: EllioColors.surface.backgroundElevated,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: EllioSpacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  storeCard: {
    backgroundColor: EllioColors.surface.background,
    marginHorizontal: EllioSpacing.md,
    marginVertical: EllioSpacing.sm,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.card, // 12px per design system
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: EllioSpacing.sm,
  },
  storeLogo: {
    fontSize: 32,
    marginRight: EllioSpacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  distance: {
    fontSize: 13,
    color: EllioColors.text.secondary,
  },
  availabilityBadge: {
    paddingHorizontal: EllioSpacing.sm,
    paddingVertical: 4,
    borderRadius: EllioRadius.badge, // 6px per design system
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  cardBody: {
    marginBottom: EllioSpacing.sm,
  },
  productName: {
    fontSize: 14,
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: EllioColors.primary.main,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: EllioColors.text.secondary,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: EllioColors.border.standard,
    paddingTop: EllioSpacing.sm,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: EllioSpacing.sm,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: EllioColors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: EllioSpacing.sm,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: EllioSpacing.sm,
    paddingVertical: 6,
  },
  actionButton: {
    fontSize: 13,
    color: EllioColors.primary.main,
    fontWeight: '600',
  },
  emptyState: {
    padding: EllioSpacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: EllioColors.text.secondary,
    textAlign: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: EllioSpacing.xl,
    gap: EllioSpacing.md,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: EllioColors.text.secondary,
    textAlign: 'center',
  },
});

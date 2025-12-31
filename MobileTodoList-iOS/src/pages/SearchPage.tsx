import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface SearchResult {
  id: string;
  type: 'task' | 'receipt' | 'budget' | 'message' | 'document';
  title: string;
  subtitle: string;
  timestamp: Date;
}

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'task' | 'receipt' | 'budget' | 'message' | 'document'
  >('all');

  const allResults: SearchResult[] = [
    {
      id: '1',
      type: 'task',
      title: 'Review Q4 Report',
      subtitle: 'Due Dec 31 | Priority: High',
      timestamp: new Date('2025-12-29T10:00:00'),
    },
    {
      id: '2',
      type: 'receipt',
      title: 'Office Supplies - Staples',
      subtitle: '$247.50 | Marketing Budget',
      timestamp: new Date('2025-12-28T14:30:00'),
    },
    {
      id: '3',
      type: 'budget',
      title: 'Q1 2026 Marketing Budget',
      subtitle: '$50,000 allocated',
      timestamp: new Date('2025-12-27T09:15:00'),
    },
    {
      id: '4',
      type: 'message',
      title: 'Team Meeting Notes',
      subtitle: 'From Jane Smith',
      timestamp: new Date('2025-12-26T16:45:00'),
    },
    {
      id: '5',
      type: 'document',
      title: 'Employee Handbook 2026.pdf',
      subtitle: '2.4 MB | Updated Dec 20',
      timestamp: new Date('2025-12-20T11:00:00'),
    },
  ];

  const recentSearches = ['Q4 Report', 'Office supplies', 'Marketing budget', 'Meeting notes'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return 'T';
      case 'receipt':
        return 'R';
      case 'budget':
        return 'B';
      case 'message':
        return 'M';
      case 'document':
        return 'D';
      default:
        return 'S';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task':
        return palette.primary;
      case 'receipt':
        return palette.alertSuccess;
      case 'budget':
        return palette.alertWarning;
      case 'message':
        return palette.alertInfo;
      case 'document':
        return palette.textSecondary;
      default:
        return palette.textTertiary;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const filteredResults = allResults.filter(result => {
    if (filter !== 'all' && result.type !== filter) {
      return false;
    }
    if (
      searchQuery &&
      !result.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return 'Today';
    }
    if (hours < 48) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search everything..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={palette.textTertiary}
          autoFocus={true}
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
            >
              <Text
                style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'task' && styles.filterButtonActive]}
              onPress={() => setFilter('task')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'task' && styles.filterButtonTextActive,
                ]}
              >
                Tasks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'receipt' && styles.filterButtonActive]}
              onPress={() => setFilter('receipt')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'receipt' && styles.filterButtonTextActive,
                ]}
              >
                Receipts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'budget' && styles.filterButtonActive]}
              onPress={() => setFilter('budget')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'budget' && styles.filterButtonTextActive,
                ]}
              >
                Budgets
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'message' && styles.filterButtonActive]}
              onPress={() => setFilter('message')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'message' && styles.filterButtonTextActive,
                ]}
              >
                Messages
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'document' && styles.filterButtonActive]}
              onPress={() => setFilter('document')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'document' && styles.filterButtonTextActive,
                ]}
              >
                Documents
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
            </Text>

            {filteredResults.map((result, index) => (
              <View key={result.id}>
                <TouchableOpacity style={styles.resultCard}>
                  <View style={styles.resultLeft}>
                    <View
                      style={[
                        styles.typeIcon,
                        { backgroundColor: `${getTypeColor(result.type)}15` },
                      ]}
                    >
                      <Text style={[styles.typeIconText, { color: getTypeColor(result.type) }]}>
                        {getTypeIcon(result.type)}
                      </Text>
                    </View>
                    <View style={styles.resultContent}>
                      <Text style={styles.resultTitle}>{result.title}</Text>
                      <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.resultRight}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{getTypeLabel(result.type)}</Text>
                    </View>
                    <Text style={styles.resultTimestamp}>{formatTimestamp(result.timestamp)}</Text>
                  </View>
                </TouchableOpacity>
                {index < filteredResults.length - 1 && <View style={styles.divider} />}
              </View>
            ))}

            {filteredResults.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No results found</Text>
                <Text style={styles.emptyStateText}>Try adjusting your search or filters</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  searchInput: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    ...typography.body,
    color: palette.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  recentSearchItem: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.badge,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  recentSearchText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  filterSection: {
    paddingTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
  },
  filterButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  filterButtonText: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: palette.textInverse,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  resultLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconText: {
    ...typography.bodyBold,
    fontSize: 18,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultSubtitle: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  resultRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  typeBadge: {
    backgroundColor: palette.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  typeBadgeText: {
    ...typography.label,
    fontSize: 10,
    color: palette.textSecondary,
  },
  resultTimestamp: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  emptyStateText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
});

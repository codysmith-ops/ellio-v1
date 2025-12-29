import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface Template {
  id: string;
  name: string;
  type: 'task' | 'budget' | 'receipt' | 'workflow';
  category: string;
  usageCount: number;
  lastUsed: Date;
}

export const TemplatesPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<
    'all' | 'task' | 'budget' | 'receipt' | 'workflow'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Weekly Team Meeting',
      type: 'task',
      category: 'Recurring',
      usageCount: 24,
      lastUsed: new Date('2025-12-29'),
    },
    {
      id: '2',
      name: 'Monthly Marketing Budget',
      type: 'budget',
      category: 'Finance',
      usageCount: 12,
      lastUsed: new Date('2025-12-01'),
    },
    {
      id: '3',
      name: 'Client Dinner Receipt',
      type: 'receipt',
      category: 'Business',
      usageCount: 45,
      lastUsed: new Date('2025-12-28'),
    },
    {
      id: '4',
      name: 'Expense Approval Flow',
      type: 'workflow',
      category: 'Process',
      usageCount: 156,
      lastUsed: new Date('2025-12-27'),
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task':
        return palette.primary;
      case 'budget':
        return palette.alertWarning;
      case 'receipt':
        return palette.alertSuccess;
      case 'workflow':
        return palette.alertInfo;
      default:
        return palette.textSecondary;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleUseTemplate = (template: Template) => {
    Alert.alert('Use Template', `Create new ${template.type} from "${template.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: () => Alert.alert('Success', `New ${template.type} created from template`),
      },
    ]);
  };

  const handleDeleteTemplate = (template: Template) => {
    Alert.alert('Delete Template', `Delete "${template.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => Alert.alert('Success', 'Template deleted'),
      },
    ]);
  };

  const filteredTemplates = templates.filter(template => {
    if (selectedType !== 'all' && template.type !== selectedType) {
      return false;
    }
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Templates</Text>
        <Text style={styles.headerSubtitle}>Reusable configurations and workflows</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={palette.textTertiary}
          />
        </View>

        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[styles.filterButton, selectedType === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedType('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === 'all' && styles.filterButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedType === 'task' && styles.filterButtonActive]}
              onPress={() => setSelectedType('task')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === 'task' && styles.filterButtonTextActive,
                ]}
              >
                Tasks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedType === 'budget' && styles.filterButtonActive]}
              onPress={() => setSelectedType('budget')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === 'budget' && styles.filterButtonTextActive,
                ]}
              >
                Budgets
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedType === 'receipt' && styles.filterButtonActive]}
              onPress={() => setSelectedType('receipt')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === 'receipt' && styles.filterButtonTextActive,
                ]}
              >
                Receipts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedType === 'workflow' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType('workflow')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === 'workflow' && styles.filterButtonTextActive,
                ]}
              >
                Workflows
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Templates</Text>
            <TouchableOpacity>
              <Text style={styles.createButton}>Create New</Text>
            </TouchableOpacity>
          </View>

          {filteredTemplates.map((template, index) => (
            <View key={template.id}>
              <View style={styles.templateCard}>
                <View style={styles.templateLeft}>
                  <View
                    style={[
                      styles.typeIcon,
                      { backgroundColor: `${getTypeColor(template.type)}15` },
                    ]}
                  >
                    <Text style={[styles.typeIconText, { color: getTypeColor(template.type) }]}>
                      {getTypeLabel(template.type)[0]}
                    </Text>
                  </View>
                  <View style={styles.templateContent}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <View style={styles.templateMeta}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: `${getTypeColor(template.type)}10` },
                        ]}
                      >
                        <Text
                          style={[styles.categoryBadgeText, { color: getTypeColor(template.type) }]}
                        >
                          {template.category}
                        </Text>
                      </View>
                      <Text style={styles.templateMetaDivider}>|</Text>
                      <Text style={styles.templateMetaText}>Used {template.usageCount} times</Text>
                    </View>
                    <Text style={styles.templateLastUsed}>
                      Last used {formatDate(template.lastUsed)}
                    </Text>
                  </View>
                </View>

                <View style={styles.templateActions}>
                  <TouchableOpacity
                    style={styles.useButton}
                    onPress={() => handleUseTemplate(template)}
                  >
                    <Text style={styles.useButtonText}>Use</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTemplate(template)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {index < filteredTemplates.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          {filteredTemplates.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No templates found</Text>
              <Text style={styles.emptyStateText}>Create your first template to save time</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Template Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{templates.length}</Text>
              <Text style={styles.statLabel}>Total Templates</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {templates.reduce((sum, t) => sum + t.usageCount, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Uses</Text>
            </View>
          </View>
        </View>
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
  headerTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
  filterSection: {
    paddingTop: spacing.xs,
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
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  createButton: {
    ...typography.secondary,
    color: palette.primary,
    fontWeight: '600',
  },
  templateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  templateLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconText: {
    ...typography.h3,
    fontSize: 20,
  },
  templateContent: {
    flex: 1,
  },
  templateName: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.badge,
  },
  categoryBadgeText: {
    ...typography.label,
    fontSize: 10,
    fontWeight: '700',
  },
  templateMetaDivider: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.border,
  },
  templateMetaText: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  templateLastUsed: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textTertiary,
  },
  templateActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  useButton: {
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  useButtonText: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textInverse,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.sm,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
  },
  deleteButtonText: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.light,
  },
  statValue: {
    ...typography.h3,
    color: palette.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  entity: string;
  details: string;
  ipAddress: string;
}

export const AuditLogPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'create' | 'update' | 'delete'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const auditEntries: AuditEntry[] = [
    {
      id: '1',
      timestamp: new Date('2025-12-29T10:30:00'),
      user: 'John Doe',
      action: 'CREATE',
      entity: 'Task',
      details: 'Created task "Review Q4 Report"',
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      timestamp: new Date('2025-12-29T09:15:00'),
      user: 'Jane Smith',
      action: 'UPDATE',
      entity: 'Budget',
      details: 'Modified budget allocation for Marketing',
      ipAddress: '192.168.1.101',
    },
    {
      id: '3',
      timestamp: new Date('2025-12-29T08:45:00'),
      user: 'John Doe',
      action: 'DELETE',
      entity: 'Receipt',
      details: 'Removed duplicate receipt entry',
      ipAddress: '192.168.1.100',
    },
    {
      id: '4',
      timestamp: new Date('2025-12-28T16:20:00'),
      user: 'Admin',
      action: 'UPDATE',
      entity: 'User',
      details: 'Changed user permissions for Jane Smith',
      ipAddress: '192.168.1.1',
    },
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return palette.alertSuccess;
      case 'UPDATE':
        return palette.alertInfo;
      case 'DELETE':
        return palette.alertCritical;
      default:
        return palette.textSecondary;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return date.toLocaleDateString();
  };

  const filteredEntries = auditEntries.filter(entry => {
    if (filterType !== 'all' && entry.action.toLowerCase() !== filterType) {
      return false;
    }
    if (searchQuery && !entry.details.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audit Log</Text>
        <Text style={styles.headerSubtitle}>Complete activity history for compliance</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.filterSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search audit logs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={palette.textTertiary}
          />

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterType('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'all' && styles.filterButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'create' && styles.filterButtonActive]}
              onPress={() => setFilterType('create')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'create' && styles.filterButtonTextActive,
                ]}
              >
                Create
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'update' && styles.filterButtonActive]}
              onPress={() => setFilterType('update')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'update' && styles.filterButtonTextActive,
                ]}
              >
                Update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'delete' && styles.filterButtonActive]}
              onPress={() => setFilterType('delete')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'delete' && styles.filterButtonTextActive,
                ]}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.exportButton}>Export CSV</Text>
            </TouchableOpacity>
          </View>

          {filteredEntries.map((entry, index) => (
            <View key={entry.id}>
              <View style={styles.auditCard}>
                <View style={styles.auditHeader}>
                  <View style={styles.auditHeaderLeft}>
                    <View
                      style={[
                        styles.actionBadge,
                        { backgroundColor: `${getActionColor(entry.action)}15` },
                      ]}
                    >
                      <Text
                        style={[styles.actionBadgeText, { color: getActionColor(entry.action) }]}
                      >
                        {entry.action}
                      </Text>
                    </View>
                    <Text style={styles.auditTimestamp}>{formatTimestamp(entry.timestamp)}</Text>
                  </View>
                  <Text style={styles.auditUser}>{entry.user}</Text>
                </View>

                <Text style={styles.auditDetails}>{entry.details}</Text>

                <View style={styles.auditMeta}>
                  <Text style={styles.auditMetaLabel}>Entity:</Text>
                  <Text style={styles.auditMetaValue}>{entry.entity}</Text>
                  <Text style={styles.auditMetaDivider}>|</Text>
                  <Text style={styles.auditMetaLabel}>IP:</Text>
                  <Text style={styles.auditMetaValue}>{entry.ipAddress}</Text>
                </View>
              </View>
              {index < filteredEntries.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compliance</Text>
          <View style={styles.card}>
            <View style={styles.complianceRow}>
              <Text style={styles.complianceLabel}>Retention Period</Text>
              <Text style={styles.complianceValue}>90 days</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.complianceRow}>
              <Text style={styles.complianceLabel}>Total Entries</Text>
              <Text style={styles.complianceValue}>{auditEntries.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.complianceRow}>
              <Text style={styles.complianceLabel}>Last Export</Text>
              <Text style={styles.complianceValue}>Dec 15, 2025</Text>
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
  filterSection: {
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
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    alignItems: 'center',
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
    marginBottom: spacing.lg,
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
  exportButton: {
    ...typography.secondary,
    color: palette.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.light,
  },
  auditCard: {
    paddingVertical: spacing.md,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  auditHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  actionBadgeText: {
    ...typography.label,
    fontSize: 10,
    fontWeight: '700',
  },
  auditTimestamp: {
    ...typography.secondary,
    color: palette.textTertiary,
  },
  auditUser: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  auditDetails: {
    ...typography.body,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  auditMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  auditMetaLabel: {
    ...typography.label,
    fontSize: 11,
    color: palette.textTertiary,
  },
  auditMetaValue: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  auditMetaDivider: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.border,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.md,
  },
  complianceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  complianceLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  complianceValue: {
    ...typography.bodyBold,
    color: palette.text,
  },
});

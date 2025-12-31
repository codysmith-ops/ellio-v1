import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface SyncItem {
  id: string;
  type: 'task' | 'receipt' | 'budget' | 'message';
  action: 'create' | 'update' | 'delete';
  title: string;
  timestamp: Date;
}

export const SyncStatusPage: React.FC = () => {
  const queuedItems: SyncItem[] = [
    {
      id: '1',
      type: 'task',
      action: 'update',
      title: 'Review Q4 Report',
      timestamp: new Date('2025-12-29T10:30:00'),
    },
    {
      id: '2',
      type: 'receipt',
      action: 'create',
      title: 'Office Supplies Receipt',
      timestamp: new Date('2025-12-29T10:15:00'),
    },
  ];

  const lastSyncTime = new Date('2025-12-29T10:00:00');
  const isOnline = true;

  const handleManualSync = () => {
    Alert.alert('Manual Sync', 'Sync all pending changes now?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sync',
        onPress: () => Alert.alert('Success', 'Sync completed successfully'),
      },
    ]);
  };

  const handleClearQueue = () => {
    Alert.alert('Clear Queue', 'This will discard all pending changes. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => Alert.alert('Success', 'Queue cleared'),
      },
    ]);
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
      default:
        return palette.textSecondary;
    }
  };

  const getActionLabel = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sync Status</Text>
        <Text style={styles.headerSubtitle}>Offline mode and data synchronization</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Connection Status</Text>
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: isOnline ? palette.alertSuccess : palette.alertCritical },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isOnline ? palette.alertSuccess : palette.alertCritical },
                  ]}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Last Sync</Text>
              <Text style={styles.statusValue}>{formatLastSync(lastSyncTime)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Pending Changes</Text>
              <Text style={styles.statusValue}>{queuedItems.length}</Text>
            </View>
          </View>
        </View>

        {queuedItems.length > 0 && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Sync Queue</Text>
                <TouchableOpacity onPress={handleClearQueue}>
                  <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {queuedItems.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.queueCard}>
                    <View style={styles.queueLeft}>
                      <View
                        style={[
                          styles.typeIcon,
                          { backgroundColor: `${getTypeColor(item.type)}15` },
                        ]}
                      >
                        <Text style={[styles.typeIconText, { color: getTypeColor(item.type) }]}>
                          {item.type.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.queueContent}>
                        <View style={styles.queueHeader}>
                          <Text style={styles.queueTitle}>{item.title}</Text>
                          <View style={styles.actionBadge}>
                            <Text style={styles.actionBadgeText}>
                              {getActionLabel(item.action)}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.queueTimestamp}>{formatTimestamp(item.timestamp)}</Text>
                      </View>
                    </View>
                  </View>
                  {index < queuedItems.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.syncButton, !isOnline && styles.syncButtonDisabled]}
                onPress={handleManualSync}
                disabled={!isOnline}
              >
                <Text style={styles.syncButtonText}>
                  {isOnline ? 'Sync Now' : 'Offline - Cannot Sync'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {queuedItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>All synced</Text>
            <Text style={styles.emptyStateText}>No pending changes to synchronize</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offline Mode</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              When offline, all changes are saved locally and queued for synchronization. Changes
              will automatically sync when connection is restored.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conflict Resolution</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto-resolve conflicts</Text>
              <Text style={styles.settingValue}>Server wins</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sync frequency</Text>
              <Text style={styles.settingValue}>Every 5 minutes</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>WiFi only</Text>
              <Text style={styles.settingValue}>Disabled</Text>
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
    marginBottom: spacing.md,
  },
  clearButton: {
    ...typography.secondary,
    color: palette.alertCritical,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.light,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  statusLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...typography.bodyBold,
  },
  statusValue: {
    ...typography.bodyBold,
    color: palette.text,
  },
  queueCard: {
    paddingVertical: spacing.md,
  },
  queueLeft: {
    flexDirection: 'row',
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
    fontSize: 16,
  },
  queueContent: {
    flex: 1,
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  queueTitle: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    flex: 1,
  },
  actionBadge: {
    backgroundColor: palette.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.badge,
  },
  actionBadgeText: {
    ...typography.label,
    fontSize: 9,
    color: palette.textSecondary,
  },
  queueTimestamp: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textTertiary,
  },
  syncButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.light,
  },
  syncButtonDisabled: {
    backgroundColor: palette.border,
  },
  syncButtonText: {
    ...typography.bodyBold,
    color: palette.textInverse,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginTop: spacing.lg,
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
  infoCard: {
    backgroundColor: palette.surfaceElevated,
    borderRadius: radius.card,
    padding: spacing.md,
  },
  infoTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.secondary,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.light,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  settingValue: {
    ...typography.bodyBold,
    color: palette.text,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
});

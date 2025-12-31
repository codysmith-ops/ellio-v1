import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface ApprovalRequest {
  id: string;
  title: string;
  requestor: string;
  type: 'expense' | 'budget' | 'timeoff' | 'purchase';
  amount?: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
}

export const ApprovalsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const approvals: ApprovalRequest[] = [
    {
      id: '1',
      title: 'Office Supplies Purchase',
      requestor: 'Jane Smith',
      type: 'expense',
      amount: '$247.50',
      date: new Date('2025-12-29'),
      status: 'pending',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Q1 Marketing Budget Increase',
      requestor: 'John Doe',
      type: 'budget',
      amount: '$5,000',
      date: new Date('2025-12-28'),
      status: 'pending',
      priority: 'high',
    },
    {
      id: '3',
      title: 'Vacation Request - Jan 15-20',
      requestor: 'Sarah Johnson',
      type: 'timeoff',
      date: new Date('2025-12-27'),
      status: 'approved',
      priority: 'medium',
    },
    {
      id: '4',
      title: 'New Laptop for Development',
      requestor: 'Mike Wilson',
      type: 'purchase',
      amount: '$2,400',
      date: new Date('2025-12-26'),
      status: 'rejected',
      priority: 'medium',
    },
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'expense':
        return 'Expense';
      case 'budget':
        return 'Budget';
      case 'timeoff':
        return 'Time Off';
      case 'purchase':
        return 'Purchase';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense':
        return palette.alertWarning;
      case 'budget':
        return palette.primary;
      case 'timeoff':
        return palette.alertInfo;
      case 'purchase':
        return palette.alertSuccess;
      default:
        return palette.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return palette.alertWarning;
      case 'approved':
        return palette.alertSuccess;
      case 'rejected':
        return palette.alertCritical;
      default:
        return palette.textSecondary;
    }
  };

  const handleApprove = (_id: string, title: string) => {
    Alert.alert('Approve Request', `Approve "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        style: 'default',
        onPress: () => Alert.alert('Success', 'Request approved'),
      },
    ]);
  };

  const handleReject = (_id: string, title: string) => {
    Alert.alert('Reject Request', `Reject "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => Alert.alert('Success', 'Request rejected'),
      },
    ]);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return 'Today';
    }
    if (hours < 48) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredApprovals = approvals.filter(approval => {
    if (filter === 'all') {
      return true;
    }
    return approval.status === filter;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Approvals</Text>
        <Text style={styles.headerSubtitle}>
          {pendingCount} {pendingCount === 1 ? 'request' : 'requests'} pending your review
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.filterSection}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
            onPress={() => setFilter('pending')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'pending' && styles.filterButtonTextActive,
              ]}
            >
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>
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
            style={[styles.filterButton, filter === 'approved' && styles.filterButtonActive]}
            onPress={() => setFilter('approved')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'approved' && styles.filterButtonTextActive,
              ]}
            >
              Approved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'rejected' && styles.filterButtonActive]}
            onPress={() => setFilter('rejected')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'rejected' && styles.filterButtonTextActive,
              ]}
            >
              Rejected
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          {filteredApprovals.map((approval, index) => (
            <View key={approval.id}>
              <View style={styles.approvalCard}>
                <View style={styles.approvalHeader}>
                  <View style={styles.approvalHeaderLeft}>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: `${getTypeColor(approval.type)}15` },
                      ]}
                    >
                      <Text style={[styles.typeBadgeText, { color: getTypeColor(approval.type) }]}>
                        {getTypeLabel(approval.type)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(approval.status)}15` },
                      ]}
                    >
                      <Text
                        style={[styles.statusBadgeText, { color: getStatusColor(approval.status) }]}
                      >
                        {approval.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.approvalDate}>{formatDate(approval.date)}</Text>
                </View>

                <Text style={styles.approvalTitle}>{approval.title}</Text>

                <View style={styles.approvalMeta}>
                  <Text style={styles.approvalMetaLabel}>Requestor:</Text>
                  <Text style={styles.approvalMetaValue}>{approval.requestor}</Text>
                  {approval.amount && (
                    <>
                      <Text style={styles.approvalMetaDivider}>|</Text>
                      <Text style={styles.approvalMetaLabel}>Amount:</Text>
                      <Text style={styles.approvalMetaValue}>{approval.amount}</Text>
                    </>
                  )}
                </View>

                {approval.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(approval.id, approval.title)}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprove(approval.id, approval.title)}
                    >
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {index < filteredApprovals.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          {filteredApprovals.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No {filter !== 'all' && filter} requests</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'pending' ? 'All caught up!' : 'No requests in this category'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {approvals.filter(a => a.status === 'approved').length}
              </Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {approvals.filter(a => a.status === 'rejected').length}
              </Text>
              <Text style={styles.statLabel}>Rejected</Text>
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
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
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
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: palette.textInverse,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  approvalCard: {
    paddingVertical: spacing.md,
  },
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  approvalHeaderLeft: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  typeBadgeText: {
    ...typography.label,
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  statusBadgeText: {
    ...typography.label,
    fontSize: 10,
    fontWeight: '700',
  },
  approvalDate: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textTertiary,
  },
  approvalTitle: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  approvalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  approvalMetaLabel: {
    ...typography.label,
    fontSize: 11,
    color: palette.textTertiary,
  },
  approvalMetaValue: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  approvalMetaDivider: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.alertCritical,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  rejectButtonText: {
    ...typography.secondary,
    color: palette.alertCritical,
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: palette.alertSuccess,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  approveButtonText: {
    ...typography.secondary,
    color: palette.textInverse,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.sm,
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
    paddingVertical: spacing.md,
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
  },
});

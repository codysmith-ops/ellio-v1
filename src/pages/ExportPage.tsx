import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

export const ExportPage: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [selectedData, setSelectedData] = useState<Set<string>>(new Set(['tasks']));

  const dataTypes = [
    { id: 'tasks', label: 'Tasks', count: 47 },
    { id: 'receipts', label: 'Receipts', count: 128 },
    { id: 'budgets', label: 'Budgets', count: 12 },
    { id: 'reports', label: 'Reports', count: 24 },
    { id: 'messages', label: 'Messages', count: 356 },
  ];

  const exportHistory = [
    {
      id: '1',
      name: 'December Tasks Export',
      format: 'CSV',
      date: new Date('2025-12-15T10:30:00'),
      size: '245 KB',
    },
    {
      id: '2',
      name: 'Q4 Budget Report',
      format: 'PDF',
      date: new Date('2025-12-01T14:20:00'),
      size: '1.2 MB',
    },
    {
      id: '3',
      name: 'Receipt Archive',
      format: 'Excel',
      date: new Date('2025-11-20T09:15:00'),
      size: '3.4 MB',
    },
  ];

  const toggleDataType = (id: string) => {
    const newSelected = new Set(selectedData);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedData(newSelected);
  };

  const handleExport = () => {
    if (selectedData.size === 0) {
      Alert.alert('Error', 'Please select at least one data type to export');
      return;
    }

    const dataList = Array.from(selectedData).join(', ');
    Alert.alert('Export Ready', `Exporting ${dataList} as ${selectedFormat.toUpperCase()}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Export',
        onPress: () =>
          Alert.alert('Success', 'Export started. You will be notified when complete.'),
      },
    ]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Export & Import</Text>
        <Text style={styles.headerSubtitle}>Manage your data portability</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Format</Text>
          <View style={styles.formatRow}>
            <TouchableOpacity
              style={[styles.formatCard, selectedFormat === 'csv' && styles.formatCardActive]}
              onPress={() => setSelectedFormat('csv')}
            >
              <Text
                style={[styles.formatLabel, selectedFormat === 'csv' && styles.formatLabelActive]}
              >
                CSV
              </Text>
              <Text style={styles.formatDescription}>Spreadsheet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formatCard, selectedFormat === 'pdf' && styles.formatCardActive]}
              onPress={() => setSelectedFormat('pdf')}
            >
              <Text
                style={[styles.formatLabel, selectedFormat === 'pdf' && styles.formatLabelActive]}
              >
                PDF
              </Text>
              <Text style={styles.formatDescription}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formatCard, selectedFormat === 'excel' && styles.formatCardActive]}
              onPress={() => setSelectedFormat('excel')}
            >
              <Text
                style={[styles.formatLabel, selectedFormat === 'excel' && styles.formatLabelActive]}
              >
                Excel
              </Text>
              <Text style={styles.formatDescription}>Workbook</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Data</Text>
          <View style={styles.card}>
            {dataTypes.map((dataType, index) => (
              <View key={dataType.id}>
                <TouchableOpacity
                  style={styles.dataTypeRow}
                  onPress={() => toggleDataType(dataType.id)}
                >
                  <View style={styles.dataTypeLeft}>
                    <View
                      style={[
                        styles.checkbox,
                        selectedData.has(dataType.id) && styles.checkboxActive,
                      ]}
                    >
                      {selectedData.has(dataType.id) && <View style={styles.checkmark} />}
                    </View>
                    <Text style={styles.dataTypeLabel}>{dataType.label}</Text>
                  </View>
                  <Text style={styles.dataTypeCount}>{dataType.count} items</Text>
                </TouchableOpacity>
                {index < dataTypes.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Text style={styles.exportButtonText}>Export Selected Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Import Data</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.importRow}>
              <Text style={styles.importLabel}>Import from CSV</Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.importRow}>
              <Text style={styles.importLabel}>Import from Excel</Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.importRow}>
              <Text style={styles.importLabel}>Restore from Backup</Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export History</Text>
          {exportHistory.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyName}>{item.name}</Text>
                  <View style={styles.historyMeta}>
                    <Text style={styles.historyMetaText}>{item.format}</Text>
                    <Text style={styles.historyMetaDivider}>|</Text>
                    <Text style={styles.historyMetaText}>{item.size}</Text>
                    <Text style={styles.historyMetaDivider}>|</Text>
                    <Text style={styles.historyMetaText}>{formatDate(item.date)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              {index < exportHistory.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
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
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  formatRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formatCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.card,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  formatCardActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  formatLabel: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  formatLabelActive: {
    color: palette.textInverse,
  },
  formatDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.light,
  },
  dataTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  dataTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.badge,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: palette.textInverse,
    borderRadius: 2,
  },
  dataTypeLabel: {
    ...typography.body,
    color: palette.text,
  },
  dataTypeCount: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  exportButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.light,
  },
  exportButtonText: {
    ...typography.bodyBold,
    color: palette.textInverse,
  },
  importRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  importLabel: {
    ...typography.body,
    color: palette.text,
  },
  actionArrow: {
    ...typography.body,
    color: palette.textTertiary,
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  historyLeft: {
    flex: 1,
  },
  historyName: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  historyMetaText: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  historyMetaDivider: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.border,
  },
  downloadButton: {
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  downloadButtonText: {
    ...typography.secondary,
    color: palette.primary,
    fontWeight: '600',
  },
});

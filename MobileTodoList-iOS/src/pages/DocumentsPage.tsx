import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'document';
  size: string;
  date: Date;
  folder: string;
}

export const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const folders = [
    { id: 'receipts', name: 'Receipts', count: 128 },
    { id: 'reports', name: 'Reports', count: 24 },
    { id: 'contracts', name: 'Contracts', count: 12 },
    { id: 'invoices', name: 'Invoices', count: 56 },
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: 'Employee Handbook 2026.pdf',
      type: 'pdf',
      size: '2.4 MB',
      date: new Date('2025-12-20'),
      folder: 'reports',
    },
    {
      id: '2',
      name: 'Office Supplies Receipt.jpg',
      type: 'image',
      size: '1.2 MB',
      date: new Date('2025-12-28'),
      folder: 'receipts',
    },
    {
      id: '3',
      name: 'Q4 Budget Spreadsheet.xlsx',
      type: 'spreadsheet',
      size: '890 KB',
      date: new Date('2025-12-15'),
      folder: 'reports',
    },
    {
      id: '4',
      name: 'Service Agreement.pdf',
      type: 'pdf',
      size: '456 KB',
      date: new Date('2025-12-10'),
      folder: 'contracts',
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'image':
        return 'IMG';
      case 'spreadsheet':
        return 'XLS';
      case 'document':
        return 'DOC';
      default:
        return 'FILE';
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return palette.alertCritical;
      case 'image':
        return palette.alertSuccess;
      case 'spreadsheet':
        return palette.alertWarning;
      case 'document':
        return palette.primary;
      default:
        return palette.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredDocuments = documents.filter(doc => {
    if (selectedFolder && doc.folder !== selectedFolder) {
      return false;
    }
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <Text style={styles.headerSubtitle}>Manage your files and attachments</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={palette.textTertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Folders</Text>
          <View style={styles.foldersGrid}>
            <TouchableOpacity
              style={[styles.folderCard, selectedFolder === null && styles.folderCardActive]}
              onPress={() => setSelectedFolder(null)}
            >
              <View style={styles.folderIcon}>
                <Text style={styles.folderIconText}>ALL</Text>
              </View>
              <Text style={styles.folderName}>All Files</Text>
              <Text style={styles.folderCount}>
                {documents.length} {documents.length === 1 ? 'file' : 'files'}
              </Text>
            </TouchableOpacity>
            {folders.map(folder => (
              <TouchableOpacity
                key={folder.id}
                style={[styles.folderCard, selectedFolder === folder.id && styles.folderCardActive]}
                onPress={() => setSelectedFolder(folder.id)}
              >
                <View style={styles.folderIcon}>
                  <Text style={styles.folderIconText}>
                    {folder.name.substring(0, 3).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.folderName}>{folder.name}</Text>
                <Text style={styles.folderCount}>
                  {folder.count} {folder.count === 1 ? 'file' : 'files'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFolder ? folders.find(f => f.id === selectedFolder)?.name : 'Recent Files'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.uploadButton}>Upload</Text>
            </TouchableOpacity>
          </View>

          {filteredDocuments.map((document, index) => (
            <View key={document.id}>
              <TouchableOpacity style={styles.documentCard}>
                <View style={styles.documentLeft}>
                  <View
                    style={[
                      styles.fileIcon,
                      { backgroundColor: `${getFileColor(document.type)}15` },
                    ]}
                  >
                    <Text style={[styles.fileIconText, { color: getFileColor(document.type) }]}>
                      {getFileIcon(document.type)}
                    </Text>
                  </View>
                  <View style={styles.documentContent}>
                    <Text style={styles.documentName}>{document.name}</Text>
                    <View style={styles.documentMeta}>
                      <Text style={styles.documentMetaText}>{document.size}</Text>
                      <Text style={styles.documentMetaDivider}>|</Text>
                      <Text style={styles.documentMetaText}>{formatDate(document.date)}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreButtonText}>...</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              {index < filteredDocuments.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          {filteredDocuments.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No documents found</Text>
              <Text style={styles.emptyStateText}>
                {selectedFolder ? 'This folder is empty' : 'Upload your first document'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.storageCard}>
            <View style={styles.storageInfo}>
              <Text style={styles.storageLabel}>Used Space</Text>
              <Text style={styles.storageValue}>4.8 GB of 15 GB</Text>
            </View>
            <View style={styles.storageBar}>
              <View style={[styles.storageBarFill, { width: '32%' }]} />
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
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
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
  uploadButton: {
    ...typography.secondary,
    color: palette.primary,
    fontWeight: '600',
  },
  foldersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  folderCard: {
    width: '47%',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadow.light,
  },
  folderCardActive: {
    borderColor: palette.primary,
    borderWidth: 2,
  },
  folderIcon: {
    width: 48,
    height: 48,
    backgroundColor: palette.surfaceElevated,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  folderIconText: {
    ...typography.label,
    color: palette.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  folderName: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  folderCount: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  documentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  documentLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIconText: {
    ...typography.label,
    fontSize: 10,
    fontWeight: '700',
  },
  documentContent: {
    flex: 1,
  },
  documentName: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  documentMetaText: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  documentMetaDivider: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.border,
  },
  moreButton: {
    paddingHorizontal: spacing.sm,
  },
  moreButtonText: {
    ...typography.body,
    color: palette.textSecondary,
    fontSize: 20,
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
  storageCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    ...shadow.light,
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  storageLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  storageValue: {
    ...typography.bodyBold,
    color: palette.text,
  },
  storageBar: {
    height: 8,
    backgroundColor: palette.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    backgroundColor: palette.primary,
  },
});

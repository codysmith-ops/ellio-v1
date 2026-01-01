import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import { LocationIcon, CameraIcon, DollarIcon } from './Icons';
import { Task } from '../store';
import { launchImageLibrary } from 'react-native-image-picker';

interface TaskCompletionDialogProps {
  visible: boolean;
  tasks: Task[];
  onComplete: (taskId: string, receiptUri?: string) => void;
  onSkip: (taskId: string) => void;
  onDismiss: () => void;
  requireReceipt?: boolean;
}

export const TaskCompletionDialog: React.FC<TaskCompletionDialogProps> = ({
  visible,
  tasks,
  onComplete,
  onSkip,
  onDismiss,
  requireReceipt = false,
}) => {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [receiptUri, setReceiptUri] = useState<string | undefined>();

  const currentTask = tasks[selectedTaskIndex];

  if (!currentTask) {
    return null;
  }

  const handleUploadReceipt = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', 'Failed to upload receipt');
          return;
        }
        if (response.assets && response.assets[0]) {
          setReceiptUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleComplete = () => {
    if (requireReceipt && !receiptUri && currentTask.needsReimbursement) {
      Alert.alert(
        'Receipt Required',
        'This task requires a receipt for reimbursement. Please upload one or skip for now.',
        [
          { text: 'Upload Receipt', onPress: handleUploadReceipt },
          { text: 'Skip', onPress: () => handleSkip(), style: 'cancel' },
        ]
      );
      return;
    }

    onComplete(currentTask.id, receiptUri);
    setReceiptUri(undefined);

    // Move to next task if available
    if (selectedTaskIndex < tasks.length - 1) {
      setSelectedTaskIndex(selectedTaskIndex + 1);
    } else {
      onDismiss();
    }
  };

  const handleSkip = () => {
    onSkip(currentTask.id);
    setReceiptUri(undefined);

    if (selectedTaskIndex < tasks.length - 1) {
      setSelectedTaskIndex(selectedTaskIndex + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.locationBadge}>
              <LocationIcon size={18} color={EllioColors.text.secondary} />
              <Text style={styles.locationText}>
                You're at {currentTask.storeName || 'the store'}
              </Text>
            </View>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.title}>Did you complete this task?</Text>

            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{currentTask.title}</Text>
              {currentTask.note && <Text style={styles.taskNote}>{currentTask.note}</Text>}
              {currentTask.quantity && currentTask.quantity > 1 && (
                <Text style={styles.quantity}>Quantity: {currentTask.quantity}</Text>
              )}
            </View>

            {currentTask.needsReimbursement && (
              <View style={styles.reimbursementBanner}>
                <DollarIcon size={18} color={EllioColors.states.success.main} />
                <View style={styles.reimbursementContent}>
                  <Text style={styles.reimbursementTitle}>Reimbursement Required</Text>
                  <Text style={styles.reimbursementText}>
                    Please upload a receipt for this purchase
                  </Text>
                </View>
              </View>
            )}

            {receiptUri ? (
              <View style={styles.receiptPreview}>
                <Text style={styles.receiptLabel}>Receipt Uploaded</Text>
                <Image source={{ uri: receiptUri }} style={styles.receiptImage} />
                <TouchableOpacity
                  onPress={() => setReceiptUri(undefined)}
                  style={styles.removeReceipt}
                >
                  <Text style={styles.removeReceiptText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={handleUploadReceipt}>
                <CameraIcon size={20} color={EllioColors.primary.main} />
                <Text style={styles.uploadText}>Upload Receipt (Optional)</Text>
              </TouchableOpacity>
            )}

            {tasks.length > 1 && (
              <View style={styles.progress}>
                <Text style={styles.progressText}>
                  Task {selectedTaskIndex + 1} of {tasks.length}
                </Text>
                <View style={styles.progressBar}>
                  {tasks.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.progressDot,
                        index <= selectedTaskIndex && styles.progressDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Not Yet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete</Text>
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
  container: {
    backgroundColor: EllioColors.surface.background,
    borderTopLeftRadius: EllioRadius.large,
    borderTopRightRadius: EllioRadius.large,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: EllioSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EllioColors.primary.mainLight || '#EBF5FF',
    paddingHorizontal: EllioSpacing.md,
    paddingVertical: EllioSpacing.sm,
    borderRadius: EllioRadius.medium,
    gap: EllioSpacing.sm,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.primary.main,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: EllioColors.text.secondary,
  },
  content: {
    padding: EllioSpacing.lg,
  },
  title: {
    ...EllioTypography.h2,
    color: palette.text,
    marginBottom: EllioSpacing.lg,
  },
  taskCard: {
    backgroundColor: EllioColors.surface.background,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.medium,
    marginBottom: EllioSpacing.lg,
  },
  taskTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  taskNote: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    marginBottom: EllioSpacing.xs,
  },
  quantity: {
    ...EllioTypography.secondary,
    color: EllioColors.text.tertiary,
  },
  reimbursementBanner: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
    backgroundColor: '#FFF4E6',
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.medium,
    marginBottom: EllioSpacing.lg,
    borderWidth: 1,
    borderColor: '#FFB020',
  },
  reimbursementIcon: {
    fontSize: 24,
  },
  reimbursementContent: {
    flex: 1,
  },
  reimbursementTitle: {
    ...EllioTypography.bodyBold,
    color: '#F59E0B',
    marginBottom: 4,
  },
  reimbursementText: {
    ...EllioTypography.secondary,
    color: '#92400E',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: EllioSpacing.sm,
    backgroundColor: EllioColors.surface.background,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    borderStyle: 'dashed',
    paddingVertical: EllioSpacing.lg,
    borderRadius: EllioRadius.medium,
    marginBottom: EllioSpacing.lg,
  },
  uploadIcon: {
    fontSize: 24,
  },
  uploadText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  receiptPreview: {
    marginBottom: EllioSpacing.lg,
  },
  receiptLabel: {
    ...EllioTypography.bodyBold,
    color: EllioColors.states.success.main,
    marginBottom: EllioSpacing.sm,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: EllioRadius.medium,
    marginBottom: EllioSpacing.sm,
  },
  removeReceipt: {
    alignSelf: 'center',
    paddingVertical: EllioSpacing.sm,
  },
  removeReceiptText: {
    ...EllioTypography.body,
    color: EllioColors.states.error.main,
  },
  progress: {
    alignItems: 'center',
    gap: EllioSpacing.sm,
  },
  progressText: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
  progressBar: {
    flexDirection: 'row',
    gap: EllioSpacing.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: EllioColors.border.standard,
  },
  progressDotActive: {
    backgroundColor: EllioColors.primary.main,
  },
  footer: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
    padding: EllioSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: EllioColors.border.standard,
  },
  skipButton: {
    flex: 1,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    borderRadius: EllioRadius.button,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
  },
  skipButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  completeButton: {
    flex: 2,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    backgroundColor: EllioColors.states.success.main,
    borderRadius: EllioRadius.button,
  },
  completeButtonText: {
    ...EllioTypography.bodyBold,
    color: '#FFFFFF',
  },
});

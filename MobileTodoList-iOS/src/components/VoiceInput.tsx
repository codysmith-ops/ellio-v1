/**
 * Voice Input Component
 * Microphone button with recording UI for voice-powered task creation
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Alert } from 'react-native';
import { voiceInputService, VoiceInputResult } from '../services/voiceInput.service';
import { parseTasksFromSpeech, ParsedTask } from '../services/taskParser.service';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import { EllioVoiceInput, EllioButtons } from '../content/ellioTheme';

interface VoiceInputProps {
  visible: boolean;
  onClose: () => void;
  onTasksGenerated: (tasks: ParsedTask[]) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ visible, onClose, onTasksGenerated }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState<'ready' | 'listening' | 'processing'>('ready');
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);

  // Pulsing animation for microphone
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isListening) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const handleStartListening = async () => {
    try {
      setStatus('listening');
      setTranscription('');
      setParsedTasks([]);

      await voiceInputService.startListening({
        onStart: () => {
          setIsListening(true);
          console.log('🎤 Started listening');
        },
        onResult: (result: VoiceInputResult) => {
          console.log('🎤 Transcription:', result.transcription);
          setTranscription(result.transcription);
        },
        onEnd: () => {
          setIsListening(false);
          handleProcessTranscription();
        },
        onError: (error: string) => {
          setIsListening(false);
          setStatus('ready');
          Alert.alert(EllioVoiceInput.error.noSpeech, error, [{ text: EllioButtons.gotIt }]);
        },
      });
    } catch (error) {
      console.error('Failed to start listening:', error);
      Alert.alert(EllioVoiceInput.error.permission, 'Enable microphone access in Settings.', [
        { text: EllioButtons.gotIt },
      ]);
    }
  };

  const handleStopListening = async () => {
    await voiceInputService.stopListening();
    setIsListening(false);
  };

  const handleProcessTranscription = () => {
    if (!transcription.trim()) {
      setStatus('ready');
      return;
    }

    setStatus('processing');

    // Parse tasks from transcription
    setTimeout(() => {
      const result = parseTasksFromSpeech(transcription);
      setParsedTasks(result.tasks);
      setStatus('ready');

      console.log('📝 Parsed tasks:', result.tasks);
      console.log('📝 Summary:', result.summary);
    }, 500);
  };

  const handleConfirm = () => {
    if (parsedTasks.length > 0) {
      onTasksGenerated(parsedTasks);
      handleClose();
    }
  };

  const handleClose = () => {
    if (isListening) {
      voiceInputService.cancelListening();
    }
    setIsListening(false);
    setTranscription('');
    setParsedTasks([]);
    setStatus('ready');
    onClose();
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return EllioVoiceInput.listening;
      case 'processing':
        return EllioVoiceInput.processing;
      default:
        return EllioVoiceInput.ready;
    }
  };

  const getMicrophoneLabel = () => {
    if (isListening) {
      return EllioVoiceInput.tapToStop;
    }
    return EllioVoiceInput.tapToStart;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Status text */}
          <Text style={styles.statusText}>{getStatusText()}</Text>

          {/* Microphone button */}
          <TouchableOpacity
            style={styles.microphoneButton}
            onPress={isListening ? handleStopListening : handleStartListening}
            disabled={status === 'processing'}
          >
            <Animated.View
              style={[
                styles.microphoneIcon,
                isListening && styles.microphoneIconActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.microphoneEmoji}>🎤</Text>
            </Animated.View>
          </TouchableOpacity>

          <Text style={styles.microphoneLabel}>{getMicrophoneLabel()}</Text>

          {/* Transcription display */}
          {transcription.length > 0 && (
            <View style={styles.transcriptionContainer}>
              <Text style={styles.transcriptionLabel}>You said:</Text>
              <Text style={styles.transcriptionText}>{transcription}</Text>
            </View>
          )}

          {/* Parsed tasks preview */}
          {parsedTasks.length > 0 && (
            <View style={styles.tasksContainer}>
              <Text style={styles.tasksTitle}>{EllioVoiceInput.confirm.title}</Text>
              <Text style={styles.tasksSubtitle}>{EllioVoiceInput.confirm.body}</Text>

              {parsedTasks.map((task, index) => (
                <View key={index} style={styles.taskCard}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={styles.taskMeta}>
                    <Text style={styles.taskCategory}>{task.category}</Text>
                    {task.dueDate && (
                      <Text style={styles.taskDue}>
                        {task.dueDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

              <View style={styles.confirmButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                  <Text style={styles.cancelButtonText}>{EllioButtons.notNow}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                  <Text style={styles.confirmButtonText}>{EllioButtons.add}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: EllioColors.surface.background,
    borderTopLeftRadius: EllioRadius.large,
    borderTopRightRadius: EllioRadius.large,
    paddingHorizontal: EllioSpacing.lg,
    paddingTop: EllioSpacing.xl,
    paddingBottom: EllioSpacing.xxl,
    minHeight: '50%',
  },
  closeButton: {
    position: 'absolute',
    top: EllioSpacing.md,
    right: EllioSpacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: EllioColors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: palette.text,
  },
  statusText: {
    ...EllioTypography.h3,
    color: palette.text,
    textAlign: 'center',
    marginTop: EllioSpacing.xl,
    marginBottom: EllioSpacing.xxl,
  },
  microphoneButton: {
    alignSelf: 'center',
    marginBottom: EllioSpacing.md,
  },
  microphoneIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: EllioColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  microphoneIconActive: {
    backgroundColor: EllioColors.states.error.main,
  },
  microphoneEmoji: {
    fontSize: 48,
  },
  microphoneLabel: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    textAlign: 'center',
    marginBottom: EllioSpacing.xl,
  },
  transcriptionContainer: {
    backgroundColor: EllioColors.surface.elevated,
    borderRadius: EllioRadius.card,
    padding: EllioSpacing.md,
    marginBottom: EllioSpacing.lg,
  },
  transcriptionLabel: {
    ...EllioTypography.caption,
    color: EllioColors.text.secondary,
    marginBottom: EllioSpacing.xs,
  },
  transcriptionText: {
    ...EllioTypography.body,
    color: palette.text,
  },
  tasksContainer: {
    marginTop: EllioSpacing.lg,
  },
  tasksTitle: {
    ...EllioTypography.h3,
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  tasksSubtitle: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    marginBottom: EllioSpacing.md,
  },
  taskCard: {
    backgroundColor: EllioColors.surface.elevated,
    borderRadius: EllioRadius.card,
    padding: EllioSpacing.md,
    marginBottom: EllioSpacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: EllioColors.primary.main,
  },
  taskTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
  },
  taskCategory: {
    ...EllioTypography.caption,
    color: EllioColors.primary.main,
  },
  taskDue: {
    ...EllioTypography.caption,
    color: EllioColors.text.secondary,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
    marginTop: EllioSpacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: EllioSpacing.md,
    borderRadius: EllioRadius.card,
    backgroundColor: EllioColors.surface.elevated,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: EllioSpacing.md,
    borderRadius: EllioRadius.card,
    backgroundColor: EllioColors.primary.main,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
});

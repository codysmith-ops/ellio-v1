/**
 * Chat Assistant Component
 * Floating AI assistant that knows everything about the app
 * Guides onboarding, explains features, fetches data
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ChatMessage,
  ChatContext,
  getWelcomeMessage,
  getAssistantResponse,
  getSuggestedQuestions,
} from '../services/chatAssistant.service';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import { EllioButtons } from '../content/ellioTheme';
import { Task } from '../store';
import { EllioElephantLogo } from './EllioElephantLogo';

interface ChatAssistantProps {
  context: ChatContext;
  tasks?: Task[];
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ context, tasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Pulse animation for FAB
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcome = getWelcomeMessage({ ...context, tasks });
      setMessages([welcome]);
    }
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim()) {
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getAssistantResponse(inputText, { ...context, tasks });
      setMessages(prev => [...prev, response]);
      setIsTyping(false);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 800);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    handleSendMessage();
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Add welcome message if first time
    if (messages.length === 0) {
      const welcome = getWelcomeMessage({ ...context, tasks });
      setMessages([welcome]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const suggestedQuestions = getSuggestedQuestions(context);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Animated.View
          style={[
            styles.fab,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.fabButton} onPress={handleOpen}>
            <EllioElephantLogo size={32} color="#ffffff" />
            <View style={styles.pulseIndicator} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Chat Modal */}
      <Modal visible={isOpen} animationType="slide" onRequestClose={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.assistantAvatar}>
                <EllioElephantLogo size={36} color="#8B5CF6" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Ellio Assistant</Text>
                <Text style={styles.headerSubtitle}>Always here to help</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userText : styles.assistantText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.sender === 'user' ? styles.userTime : styles.assistantTime,
                  ]}
                >
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))}

            {isTyping && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            )}

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsLabel}>Try asking:</Text>
                {suggestedQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionButton}
                    onPress={() => handleSuggestedQuestion(question)}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor={EllioColors.text.tertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: EllioSpacing.xxl,
    right: EllioSpacing.lg,
    zIndex: 1000,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: EllioColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
  },
  pulseIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: EllioColors.states.success.main,
    borderWidth: 2,
    borderColor: EllioColors.surface.background,
  },

  // Modal
  container: {
    flex: 1,
    backgroundColor: EllioColors.surface.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: EllioSpacing.lg,
    paddingVertical: EllioSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.backgroundElevated,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.md,
  },
  assistantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: EllioColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantAvatarText: {
    fontSize: 20,
  },
  headerText: {
    gap: EllioSpacing.xs,
  },
  headerTitle: {
    ...EllioTypography.h3,
    color: palette.text,
  },
  headerSubtitle: {
    ...EllioTypography.caption,
    color: EllioColors.text.secondary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: EllioColors.surface.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: EllioColors.text.secondary,
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: EllioSpacing.lg,
    gap: EllioSpacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.md,
    gap: EllioSpacing.xs,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: EllioColors.primary.main,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: EllioColors.surface.backgroundElevated,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...EllioTypography.body,
  },
  userText: {
    color: EllioColors.surface.background,
  },
  assistantText: {
    color: palette.text,
  },
  messageTime: {
    ...EllioTypography.caption,
    fontSize: 11,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  assistantTime: {
    color: EllioColors.text.tertiary,
  },

  // Typing Indicator
  typingIndicator: {
    flexDirection: 'row',
    gap: EllioSpacing.xs,
    paddingVertical: EllioSpacing.xs,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: EllioColors.text.tertiary,
  },

  // Suggested Questions
  suggestionsContainer: {
    marginTop: EllioSpacing.lg,
    gap: EllioSpacing.sm,
  },
  suggestionsLabel: {
    ...EllioTypography.caption,
    color: EllioColors.text.secondary,
    marginBottom: EllioSpacing.xs,
  },
  suggestionButton: {
    paddingVertical: EllioSpacing.sm,
    paddingHorizontal: EllioSpacing.md,
    borderRadius: EllioRadius.md,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
  },
  suggestionText: {
    ...EllioTypography.body,
    color: EllioColors.primary.main,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: EllioSpacing.sm,
    paddingHorizontal: EllioSpacing.lg,
    paddingVertical: EllioSpacing.md,
    borderTopWidth: 1,
    borderTopColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.backgroundElevated,
  },
  input: {
    flex: 1,
    ...EllioTypography.body,
    color: palette.text,
    backgroundColor: EllioColors.surface.background,
    borderRadius: EllioRadius.md,
    paddingHorizontal: EllioSpacing.md,
    paddingVertical: EllioSpacing.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  sendButton: {
    paddingHorizontal: EllioSpacing.lg,
    paddingVertical: EllioSpacing.sm,
    borderRadius: EllioRadius.md,
    backgroundColor: EllioColors.primary.main,
  },
  sendButtonDisabled: {
    backgroundColor: EllioColors.border.standard,
  },
  sendButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
});

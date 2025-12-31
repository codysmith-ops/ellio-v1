/**
 * Voice Input Service
 * Handles speech-to-text transcription using @react-native-voice/voice
 */

import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from '@react-native-voice/voice';

export interface VoiceInputResult {
  transcription: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceInputCallbacks {
  onStart?: () => void;
  onResult?: (result: VoiceInputResult) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

class VoiceInputService {
  private isListening: boolean = false;
  private callbacks: VoiceInputCallbacks = {};

  constructor() {
    Voice.onSpeechStart = this.handleSpeechStart.bind(this);
    Voice.onSpeechEnd = this.handleSpeechEnd.bind(this);
    Voice.onSpeechResults = this.handleSpeechResults.bind(this);
    Voice.onSpeechError = this.handleSpeechError.bind(this);
  }

  /**
   * Start listening for voice input
   */
  async startListening(callbacks: VoiceInputCallbacks): Promise<void> {
    if (this.isListening) {
      console.warn('🎤 Already listening');
      return;
    }

    this.callbacks = callbacks;

    try {
      await Voice.start('en-US');
      this.isListening = true;
      console.log('🎤 Voice input started');
    } catch (error) {
      console.error('🎤 Failed to start voice input:', error);
      this.callbacks.onError?.('Could not start listening. Check microphone permissions.');
      throw error;
    }
  }

  /**
   * Stop listening for voice input
   */
  async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      await Voice.stop();
      this.isListening = false;
      console.log('🎤 Voice input stopped');
    } catch (error) {
      console.error('🎤 Failed to stop voice input:', error);
    }
  }

  /**
   * Cancel listening (more abrupt than stop)
   */
  async cancelListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      await Voice.cancel();
      this.isListening = false;
      console.log('🎤 Voice input cancelled');
    } catch (error) {
      console.error('🎤 Failed to cancel voice input:', error);
    }
  }

  /**
   * Destroy the voice recognition instance
   */
  async destroy(): Promise<void> {
    try {
      await Voice.destroy();
      this.isListening = false;
      this.callbacks = {};
      console.log('🎤 Voice input destroyed');
    } catch (error) {
      console.error('🎤 Failed to destroy voice input:', error);
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  // Event handlers
  private handleSpeechStart(event: SpeechStartEvent): void {
    console.log('🎤 Speech started');
    this.callbacks.onStart?.();
  }

  private handleSpeechEnd(event: SpeechEndEvent): void {
    console.log('🎤 Speech ended');
    this.isListening = false;
    this.callbacks.onEnd?.();
  }

  private handleSpeechResults(event: SpeechResultsEvent): void {
    const transcription = event.value?.[0] || '';
    console.log('🎤 Speech result:', transcription);

    if (transcription) {
      this.callbacks.onResult?.({
        transcription,
        confidence: 1.0, // Voice API doesn't provide confidence scores
        isFinal: true,
      });
    }
  }

  private handleSpeechError(event: SpeechErrorEvent): void {
    console.error('🎤 Speech error:', event.error);
    this.isListening = false;

    let errorMessage = 'Something went wrong with voice input.';

    if (event.error?.message?.includes('permission')) {
      errorMessage = 'Microphone permission is required.';
    } else if (event.error?.message?.includes('network')) {
      errorMessage = 'Check your internet connection.';
    } else if (event.error?.message?.includes('no-speech')) {
      errorMessage = "Didn't catch that. Try again.";
    }

    this.callbacks.onError?.(errorMessage);
  }
}

// Export singleton instance
export const voiceInputService = new VoiceInputService();

/**
 * Ellio Theme System
 * Single source of truth for voice, tone, and content
 *
 * Core Promise: "Calm momentum. One next step."
 * Personality: Warm, steady, competent, quietly clever, non-judgmental, trustworthy
 */

// ==================== VOICE & TONE ====================

export const EllioVoice = {
  // Signature phrases - use these consistently
  signatures: {
    youreGood: 'You are good.',
    notAllAtOnce: 'Not all at once.',
    nextUp: 'Next up.',
    whenReady: 'When you are ready.',
    wantHelp: 'Want help with that?',
    allSet: 'All set.',
    keepSimple: 'We will keep it simple.',
  },

  // Words to avoid
  avoid: [
    'Hurry',
    'ASAP',
    'Overdue',
    'You failed',
    'You should have',
    'AI-powered', // unless explained
  ],
} as const;

// ==================== NAVIGATION ====================

export const EllioNavigation = {
  home: 'Next',
  tasks: 'List',
  insights: 'Pulse',
  reports: 'Summary',
  chat: 'Ask',
  integrations: 'Connect',
  notifications: 'Reminders',
  preferences: 'Your settings',
  account: 'Account',
} as const;

// ==================== SYSTEM TERMS ====================

export const EllioTerms = {
  tasks: 'Tasks', // or "Steps" (optional)
  priorities: 'Focus levels',
  dueDates: 'When',
  assignments: 'With',
  backlog: 'Later',
} as const;

// ==================== BUTTONS ====================

export const EllioButtons = {
  add: 'Add',
  save: 'Save',
  done: 'Done',
  undo: 'Undo',
  notNow: 'Not now',
  showMe: 'Show me',
  learnMore: 'Learn more',
  turnOn: 'Turn on',
  turnOff: 'Turn off',
  gotIt: 'Got it',
  tryIt: 'Try it',
  keepIt: 'Keep it',
  continue: 'Continue',
} as const;

// ==================== TOASTS ====================

export const EllioToasts = {
  saved: 'Saved.',
  added: 'Added.',
  done: 'Done.',
  updated: 'Updated.',
  allSet: 'All set.',
  deleted: 'Removed.',
  undone: 'Undone.',
} as const;

// ==================== HEADERS ====================

export const EllioHeaders = {
  nextUp: 'Next up',
  onDeck: 'On deck',
  atYourPace: 'At your pace',
  whenReady: 'When you are ready',
  handled: 'Handled',
  today: 'Today',
  thisWeek: 'This week',
  later: 'Later',
} as const;

// ==================== EMPTY STATES ====================

export const EllioEmptyStates = {
  noTasks: {
    title: 'All clear.',
    body: "Add one thing you'd like to handle next.",
  },
  noActivity: {
    title: 'Quiet day.',
    body: "When you make changes, they'll show up here.",
  },
  noReports: {
    title: 'Not enough data yet.',
    body: "Once you complete a few tasks, we'll summarize patterns.",
  },
  noSearch: {
    title: 'Nothing found.',
    body: 'Try different words.',
  },
  noConnection: {
    title: 'No connection.',
    body: "We'll sync when you're back online.",
  },
} as const;

// ==================== ERROR MESSAGES ====================

export const EllioErrors = {
  generic: {
    title: "Something didn't work.",
    body: 'Try again, or check your connection.',
  },
  saveFailed: {
    title: "Couldn't save.",
    body: 'Nothing was lost. Try again in a moment.',
  },
  permissionDenied: {
    title: "That's okay.",
    body: 'Ellio can still work without this. You can turn it on later.',
  },
  networkError: {
    title: 'Connection issue.',
    body: 'Check your internet and try again.',
  },
  notFound: {
    title: 'Not found.',
    body: 'This might have been removed.',
  },
  timeout: {
    title: 'Taking too long.',
    body: 'Try again in a moment.',
  },
} as const;

// ==================== PERMISSION PROMPTS ====================

export const EllioPermissions = {
  camera: {
    title: 'Allow camera?',
    body: 'Only used to attach photos to a task. Nothing is uploaded unless you enable syncing.',
  },
  microphone: {
    title: 'Allow microphone?',
    body: 'Only used to add tasks by voice. Nothing is recorded or uploaded.',
  },
  notifications: {
    title: 'Allow reminders?',
    body: "We'll only send gentle nudges when you choose. You control when and how often.",
  },
  location: {
    title: 'Allow location?',
    body: 'Only used to find nearby stores. You can turn this off anytime.',
  },
  photos: {
    title: 'Allow photos?',
    body: 'Only to attach images to tasks. Nothing is uploaded unless you enable syncing.',
  },
} as const;

// ==================== AUTOMATION MESSAGES ====================

export const EllioAutomation = {
  grouped: {
    title: 'Handled for you',
    body: 'Ellio grouped similar items so your list stays simple.',
  },
  sorted: {
    title: 'Organized',
    body: 'Tasks arranged by what makes sense next.',
  },
  suggested: {
    title: 'Suggestion',
    body: 'This might save time. Want to try it?',
  },
  optimized: {
    title: 'Route ready',
    body: 'Stops arranged by distance. You can adjust anytime.',
  },
} as const;

// ==================== TOOLTIPS ====================

export const EllioTooltips = {
  nextUp: {
    title: 'Next up',
    body: 'This is the one thing Ellio thinks matters most right now.',
    footnote: 'You can change this anytime.',
  },
  focusLevel: {
    title: 'Focus level',
    body: 'How important this is to you. Helps Ellio prioritize.',
  },
  voiceInput: {
    title: 'Add by voice',
    body: 'Say your list, and Ellio will organize it for you.',
  },
  smartRoute: {
    title: 'Smart route',
    body: 'Finds the fastest path through all your stops.',
  },
  cashbackMatch: {
    title: 'Best card',
    body: 'Ellio suggests which credit card earns the most here.',
  },
} as const;

// ==================== FEATURE DISCLOSURE ====================

export const EllioFeatureDisclosure = {
  template: {
    title: 'New, if you want it',
    body: 'This can save time. Want a quick look?',
  },
  voiceInput: {
    title: 'Add tasks by voice',
    body: 'Say your list, and Ellio will organize it. Want to try?',
  },
  smartRoute: {
    title: 'Route planning',
    body: 'Ellio can arrange your stops by distance. Want to see?',
  },
} as const;

// ==================== VOICE INPUT MESSAGES ====================

export const EllioVoiceInput = {
  listening: 'Listening...',
  processing: 'Got it. Organizing...',
  ready: 'Ready when you are.',
  tapToStart: 'Tap to start',
  tapToStop: 'Tap to finish',
  confirm: {
    title: 'Sound good?',
    body: 'Review and adjust before saving.',
  },
  error: {
    noSpeech: "Didn't catch that. Try again?",
    permission: 'Microphone permission is required.',
    network: 'Check your connection.',
  },
} as const;

// ==================== HELPER FUNCTIONS ====================

/**
 * Get error message by type
 */
export function getErrorMessage(errorType: keyof typeof EllioErrors) {
  return EllioErrors[errorType] || EllioErrors.generic;
}

/**
 * Get permission message by type
 */
export function getPermissionMessage(permissionType: keyof typeof EllioPermissions) {
  return EllioPermissions[permissionType];
}

/**
 * Get tooltip by feature
 */
export function getTooltip(feature: keyof typeof EllioTooltips) {
  return EllioTooltips[feature];
}

/**
 * Format task count with Ellio tone
 */
export function formatTaskCount(count: number): string {
  if (count === 0) {
    return 'All clear.';
  }
  if (count === 1) {
    return '1 task';
  }
  return `${count} tasks`;
}

/**
 * Format completion message
 */
export function formatCompletionMessage(count: number): string {
  if (count === 0) {
    return EllioEmptyStates.noTasks.title;
  }
  if (count === 1) {
    return 'Nice work.';
  }
  return `${count} done. ${EllioVoice.signatures.youreGood}`;
}

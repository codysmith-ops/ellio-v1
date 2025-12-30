# Voice-Powered Task Generation with Ellio Theme

## Overview

Transform how users add tasks by **speaking naturally** instead of typing. The app listens, understands, organizes, and creates tasks automatically with proper categories, priorities, and due dates.

---

## The Ellio Theme System

### Core Promise

**"Calm momentum. One next step."**

Ellio helps people move forward without feeling behind.

### Personality

- **Warm** (friendly, human)
- **Steady** (never urgent or scolding)
- **Competent** (feels "handled")
- **Quietly clever** (witty, but not jokey)
- **Non-judgmental** (no shame, no pressure)
- **Trustworthy** (explains data + automation plainly)

### Signature Phrases

- "You're good."
- "Not all at once."
- "Next up."
- "When you're ready."
- "Want help with that?"
- "All set."
- "We'll keep it simple."

### Words We Avoid

- Hurry
- ASAP
- Overdue
- You failed
- You should have
- AI-powered (unless explained)

---

## Voice Input Features

### How It Works

1. **Tap the microphone button** in quick actions
2. **Speak your list** naturally:
   - "Buy milk and eggs at Walmart, then schedule dentist appointment for next week"
3. **App processes** speech into structured tasks
4. **Review & confirm** before adding

### Smart Task Parsing

The app understands natural language and automatically:

**Extracts Multiple Tasks:**

- Splits by: "and then", "also", "next", "after that", commas

**Detects Categories:**

- **Shopping:** buy, purchase, get, grocery, Walmart, Target, Kroger
- **Work:** meeting, email, call, project, deadline, presentation
- **Personal:** home, clean, organize, fix, repair, chore
- **Health:** doctor, appointment, gym, exercise, medication
- **Finance:** pay, bill, bank, credit card, budget

**Infers Priority:**

- **High:** urgent, asap, immediately, critical, important, must, now, today
- **Medium:** (default)
- **Low:** someday, eventually, maybe, when, if, later

**Extracts Due Dates:**

- **Today:** "today", "now"
- **Tomorrow:** "tomorrow"
- **This Week:** "this week"
- **Next Week:** "next week"
- **This Month:** "this month"

---

## Example Conversations

### Example 1: Shopping List

**You say:**
"Buy milk, bread, and eggs at Kroger, then get dog food at PetSmart"

**App creates:**

1. ✅ "Buy milk, bread, and eggs at Kroger" (Shopping, medium)
2. ✅ "Get dog food at PetSmart" (Shopping, medium)

---

### Example 2: Work Tasks

**You say:**
"Email the client about the proposal today, then schedule a follow-up meeting next week"

**App creates:**

1. ✅ "Email the client about the proposal" (Work, high, due: Today)
2. ✅ "Schedule a follow-up meeting" (Work, medium, due: Next week)

---

### Example 3: Personal Errands

**You say:**
"Call the dentist tomorrow, clean the garage this weekend, and organize photos someday"

**App creates:**

1. ✅ "Call the dentist" (Health, medium, due: Tomorrow)
2. ✅ "Clean the garage" (Personal, medium, due: This week)
3. ✅ "Organize photos" (Personal, low)

---

## UI/UX Details

### Voice Input Modal

**Status Messages:**

- "Ready when you are." (idle)
- "Listening..." (recording)
- "Got it. Organizing..." (processing)

**Microphone Button:**

- Blue circle when idle
- Red pulsing circle when recording
- Size: 120x120px with shadow
- Tap to start/stop

**Transcription Display:**

- Shows "You said: [transcription]"
- Appears as you speak

**Task Preview:**

- Shows all parsed tasks before adding
- Displays: title, category, due date
- Color-coded category tags

**Confirmation Buttons:**

- "Not now" (cancel)
- "Add" (confirm and add all tasks)

---

## Technical Architecture

### Components

**VoiceInput.tsx**

- Modal with microphone button
- Pulsing animation during recording
- Task preview with category/due date
- Confirmation UI

**Files:**

```text
src/components/VoiceInput.tsx
src/services/voiceInput.service.ts
src/services/taskParser.service.ts
src/content/ellioTheme.ts
```

### Voice Input Service

**Technology:** `@react-native-voice/voice`

**Methods:**

- `startListening()` - Begin speech recognition
- `stopListening()` - End recording
- `cancelListening()` - Abort recording

**Events:**

- `onStart` - Recording began
- `onResult` - Speech transcribed
- `onEnd` - Recording ended
- `onError` - Error occurred

**Error Handling:**

- Permission denied → "Microphone permission is required."
- No speech detected → "Didn't catch that. Try again?"
- Network error → "Check your connection."

### Task Parser Service

**parseTasksFromSpeech(transcription: string)**

Returns:

```typescript
{
  tasks: ParsedTask[],
  summary: string
}
```

**ParsedTask Interface:**

```typescript
{
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  note?: string;
}
```

**Parsing Logic:**

1. **Split Text:** By delimiters ("and then", "also", "next", commas)
2. **Clean Segments:** Remove prefixes ("I need to", "have to", "must")
3. **Detect Category:** Match keywords to category patterns
4. **Detect Priority:** Match urgency keywords
5. **Extract Due Date:** Match time expressions
6. **Generate Summary:** Create confirmation message

### Ellio Theme System

**Content Modules:**

- `EllioNavigation` - Nav labels (Next, List, Pulse, Summary)
- `EllioButtons` - Button text (Add, Save, Done, Not now)
- `EllioToasts` - Confirmations (Saved, Added, All set)
- `EllioErrors` - Error messages (gentle, helpful)
- `EllioEmptyStates` - Empty state copy (calm, encouraging)
- `EllioPermissions` - Permission prompts (transparent)
- `EllioAutomation` - Automation messages (explainable)
- `EllioTooltips` - Feature tooltips
- `EllioVoiceInput` - Voice-specific messages

**Helper Functions:**

- `getErrorMessage(errorType)` - Get error by type
- `getPermissionMessage(permissionType)` - Get permission prompt
- `formatTaskCount(count)` - Format task count with tone
- `formatCompletionMessage(count)` - Format completion message

---

## User Flow

### 1. Open Voice Input

**Trigger:** Tap microphone button in quick actions

**Modal Opens:**

- Title: "Ready when you are."
- Large blue microphone button
- "Tap to start" label

### 2. Record

**User taps microphone**

**State Changes:**

- Button turns red and pulses
- Title: "Listening..."
- Label: "Tap to finish"

**As user speaks:**

- Transcription appears: "You said: [text]"

### 3. Process

**User taps to stop**

**State Changes:**

- Button stops pulsing
- Title: "Got it. Organizing..."
- Tasks are parsed in background (500ms)

### 4. Review

**Tasks appear:**

- Title: "Sound good?"
- Subtitle: "Review and adjust before saving."
- Task cards showing:
  - Title (bold)
  - Category (blue tag)
  - Due date (if any)

**Buttons:**

- "Not now" (cancel, gray)
- "Add" (confirm, blue)

### 5. Confirm

**User taps "Add"**

**Result:**

- All tasks added to list
- Alert: "Added [X] tasks"
- Modal closes
- Tasks appear in appropriate categories

---

## Permissions

### Microphone Permission

**Pre-Permission Prompt** (before OS dialog):

**Title:** "Allow microphone?"
**Body:** "Only used to add tasks by voice. Nothing is recorded or uploaded."
**Buttons:** "Continue" / "Not now"

**If Denied:**
- Show message: "Microphone permission is required."
- Offer: "Enable in Settings"

---

## Error Handling

### No Speech Detected

**Message:** "Didn't catch that. Try again?"
**Action:** Modal stays open, ready to record again

### Permission Denied

**Message:** "Microphone permission is required."
**Action:** Close modal, suggest Settings

### Network Error

**Message:** "Check your connection."
**Action:** Modal stays open, can retry

### Processing Failed

**Message:** "Something didn't work."
**Action:** Modal stays open, can retry

---

## Testing

### Test Scenarios

**Single Task:**

- Say: "Buy milk"
- Expected: 1 task (Shopping)

**Multiple Tasks:**

- Say: "Buy milk, then get gas, also call mom"
- Expected: 3 tasks (Shopping, Shopping, Personal)

**With Categories:**

- Say: "Email client about proposal, schedule dentist appointment, buy groceries"
- Expected: 3 tasks (Work, Health, Shopping)

**With Priorities:**

- Say: "Urgent: call the client ASAP, maybe clean garage someday"
- Expected: 2 tasks (high priority, low priority)

**With Due Dates:**

- Say: "Meeting tomorrow, report due next week"
- Expected: 2 tasks with dates

**Complex List:**

- Say: "Buy milk and eggs at Walmart today, then schedule dentist for next week, also pay credit card bill this month"
- Expected: 3 tasks (Shopping/today, Health/next week, Finance/this month)

### Verification Steps

1. **Launch app**
2. **Tap microphone button**
3. **Verify modal opens** with "Ready when you are."
4. **Tap blue button** to start recording
5. **Verify button turns red** and pulses
6. **Speak a multi-task list**
7. **Verify transcription appears** as you speak
8. **Tap red button** to stop
9. **Verify tasks appear** in preview
10. **Check each task** for correct:
    - Title
    - Category
    - Priority
    - Due date
11. **Tap "Add"**
12. **Verify tasks added** to main list
13. **Check categorization** is correct

---

## Ellio Theme Applied

### Button Text Updates

**Before:**

- "+ Add Task"
- "Cancel"
- "Delete"
- "Save Changes"

**After (Ellio):**

- "Add"
- "Not now"
- "Remove"
- "Save"

### Toast Messages

**Before:**

- "Task added successfully!"
- "Changes saved"
- "Task deleted"

**After (Ellio):**

- "Added."
- "Saved."
- "Removed."

### Empty States

**Before:**

- "No tasks yet. Add your first task to get started!"

**After (Ellio):**

- "All clear."
- "Add one thing you'd like to handle next."

### Error Messages

**Before:**

- "Error: Failed to save task. Please try again."

**After (Ellio):**

- "Couldn't save."
- "Nothing was lost. Try again in a moment."

---

## Future Enhancements

### Multi-Language Support

- Spanish, French, German voice recognition
- Multi-language task parsing

### Contextual Understanding

- "Add the same thing tomorrow"
- "Move that to next week"
- "Delete the last one"

### Voice Commands

- "Show my shopping list"
- "What's next?"
- "Mark milk as done"

### Smart Suggestions

- Suggest missing details: "Which store?"
- Offer templates: "Add your usual groceries?"

### Continuous Conversation

- Keep modal open for multiple lists
- "What else?" prompts
- Cumulative additions

---

## Commit Information

**Commit:** `a143d7e`
**Date:** December 29, 2024
**Branch:** `ellio-ios-xcode-15.4`

**Files Added:**

- `src/components/VoiceInput.tsx` (392 lines)
- `src/services/voiceInput.service.ts` (167 lines)
- `src/services/taskParser.service.ts` (303 lines)
- `src/content/ellioTheme.ts` (282 lines)

**Files Modified:**

- `App.tsx` (+62 lines, voice integration)

**Total Lines:** 1,206 new lines of code

---

## Quick Reference

### Voice Input Triggers

| Action | Result |
| ------ | ------ |
| Tap microphone | Open voice input modal |
| Tap blue button | Start recording |
| Tap red button | Stop recording |
| Tap "Add" | Add all tasks |
| Tap "Not now" | Cancel and close |
| Tap ✕ | Close modal |

### Category Keywords

| Category | Keywords |
| -------- | -------- |
| Shopping | buy, purchase, get, grocery, store name |
| Work | meeting, email, call, project, deadline |
| Personal | home, clean, organize, fix, chore |
| Health | doctor, appointment, gym, exercise |
| Finance | pay, bill, bank, credit card, budget |

### Priority Keywords

| Priority | Keywords |
| -------- | -------- |
| High | urgent, asap, immediately, critical, now |
| Medium | (default) |
| Low | someday, eventually, maybe, later |

### Due Date Expressions

| Expression | Result |
| ---------- | ------ |
| today, now | Today |
| tomorrow | Tomorrow |
| this week | End of this week |
| next week | 7 days from now |
| this month | End of this month |

---

**Last Updated:** December 29, 2024  
**Status:** ✅ PRODUCTION READY

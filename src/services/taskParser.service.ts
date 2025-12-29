/**
 * Task Parser Service
 * Converts natural language speech into organized tasks with categories
 */

export interface ParsedTask {
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  note?: string;
}

export interface ParsedTaskList {
  tasks: ParsedTask[];
  summary: string;
}

/**
 * Parse natural language speech into structured tasks
 */
export function parseTasksFromSpeech(transcription: string): ParsedTaskList {
  const text = transcription.toLowerCase().trim();
  const tasks: ParsedTask[] = [];

  console.log('📝 Parsing tasks from:', transcription);

  // Split by common delimiters
  const segments = text
    .split(/(?:and then|then|also|next|after that|,|;)/gi)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const segment of segments) {
    const task = parseTaskSegment(segment);
    if (task) {
      tasks.push(task);
    }
  }

  // If no tasks found, create one from the entire transcription
  if (tasks.length === 0 && transcription.trim().length > 0) {
    tasks.push({
      title: capitalizeFirstLetter(transcription.trim()),
      category: detectCategory(transcription),
      priority: detectPriority(transcription),
    });
  }

  return {
    tasks,
    summary: generateSummary(tasks),
  };
}

/**
 * Parse a single task segment
 */
function parseTaskSegment(segment: string): ParsedTask | null {
  const text = segment.trim();

  if (text.length < 3) {
    return null;
  }

  // Remove common task prefixes
  const cleanText = text
    .replace(/^(i need to|i have to|need to|have to|must|should|to|go|get|buy|add|create|make)\s+/i, '')
    .trim();

  if (cleanText.length === 0) {
    return null;
  }

  const title = capitalizeFirstLetter(cleanText);
  const category = detectCategory(cleanText);
  const priority = detectPriority(cleanText);
  const dueDate = detectDueDate(cleanText);
  const note = extractNote(cleanText);

  return {
    title,
    category,
    priority,
    dueDate,
    note,
  };
}

/**
 * Detect task category from content
 */
function detectCategory(text: string): string {
  const lower = text.toLowerCase();

  // Shopping keywords
  if (
    /\b(buy|purchase|get|shop|store|grocery|groceries|walmart|target|kroger|costco)\b/.test(lower)
  ) {
    return 'Shopping';
  }

  // Work keywords
  if (/\b(work|meeting|email|call|project|deadline|presentation|report)\b/.test(lower)) {
    return 'Work';
  }

  // Personal keywords
  if (/\b(personal|home|clean|organize|fix|repair|chore)\b/.test(lower)) {
    return 'Personal';
  }

  // Health keywords
  if (/\b(doctor|appointment|gym|exercise|workout|health|medication)\b/.test(lower)) {
    return 'Health';
  }

  // Finance keywords
  if (/\b(pay|bill|bank|credit card|budget|money|finance|cashback)\b/.test(lower)) {
    return 'Finance';
  }

  return 'General';
}

/**
 * Detect task priority from content
 */
function detectPriority(text: string): 'low' | 'medium' | 'high' {
  const lower = text.toLowerCase();

  // High priority indicators
  if (/\b(urgent|asap|immediately|critical|important|must|now|today)\b/.test(lower)) {
    return 'high';
  }

  // Low priority indicators
  if (/\b(someday|eventually|maybe|when|if|later|low priority)\b/.test(lower)) {
    return 'low';
  }

  // Default to medium
  return 'medium';
}

/**
 * Detect due date from text
 */
function detectDueDate(text: string): Date | undefined {
  const lower = text.toLowerCase();
  const now = new Date();

  // Today
  if (/\b(today|now)\b/.test(lower)) {
    return now;
  }

  // Tomorrow
  if (/\b(tomorrow)\b/.test(lower)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // This week
  if (/\b(this week)\b/.test(lower)) {
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    return endOfWeek;
  }

  // Next week
  if (/\b(next week)\b/.test(lower)) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }

  // This month
  if (/\b(this month)\b/.test(lower)) {
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return endOfMonth;
  }

  return undefined;
}

/**
 * Extract note/description from task text
 */
function extractNote(text: string): string | undefined {
  // Look for common note patterns
  const noteMatch = text.match(/(?:note:|remember:|details?:|because:)\s*(.+)/i);

  if (noteMatch && noteMatch[1]) {
    return capitalizeFirstLetter(noteMatch[1].trim());
  }

  return undefined;
}

/**
 * Generate summary of parsed tasks
 */
function generateSummary(tasks: ParsedTask[]): string {
  if (tasks.length === 0) {
    return "Didn't catch that. Try again?";
  }

  if (tasks.length === 1) {
    return `Added 1 task to ${tasks[0].category}.`;
  }

  const categories = [...new Set(tasks.map(t => t.category))];

  if (categories.length === 1) {
    return `Added ${tasks.length} tasks to ${categories[0]}.`;
  }

  return `Added ${tasks.length} tasks across ${categories.length} categories.`;
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Example usage:
 *
 * const result = parseTasksFromSpeech(
 *   "Buy milk and eggs at Walmart, then schedule dentist appointment for next week"
 * );
 *
 * Result:
 * {
 *   tasks: [
 *     { title: "Buy milk and eggs at Walmart", category: "Shopping", priority: "medium" },
 *     { title: "Schedule dentist appointment", category: "Health", priority: "medium", dueDate: <next week> }
 *   ],
 *   summary: "Added 2 tasks across 2 categories."
 * }
 */

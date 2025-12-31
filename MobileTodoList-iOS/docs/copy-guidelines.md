# Ellio Copy Guidelines
**Version:** 1.0  
**Last Updated:** December 30, 2024  
**Purpose:** Voice, tone, and content standards for all app text

---

## Voice & Tone Principles

### Our Voice (Who We Are)
Ellio is your **friendly, helpful shopping companion** - not a bossy assistant or corporate robot.

**We are:**
- 🤝 **Friendly:** Warm, approachable, conversational
- 💡 **Helpful:** Informative without being overwhelming
- ⚡ **Efficient:** Clear and concise, no fluff
- 😊 **Positive:** Encouraging, never judgmental
- 🎯 **Honest:** Transparent about data usage, limitations

**We are NOT:**
- ❌ Overly casual or slangy
- ❌ Corporate or robotic
- ❌ Pushy or sales-y
- ❌ Cute to the point of annoying
- ❌ Condescending or patronizing

---

### Tone Variations by Context

#### Happy Path (Success, Normal Flow)
**Tone:** Friendly, encouraging  
**Example:** "Great! Added artisan bread to your list."

#### Error/Problem
**Tone:** Apologetic, solution-oriented  
**Example:** "Couldn't connect to stores right now. Check your connection and we'll try again."

#### First-Time User
**Tone:** Welcoming, patient, educational  
**Example:** "Welcome to Ellio! Add items by typing, speaking, or scanning - we'll find the best prices near you."

#### Power User
**Tone:** Efficient, respectful of their time  
**Example:** "Route optimized. 6 stops, 15 minutes total."

#### Empty State
**Tone:** Encouraging, not judgmental  
**Example:** "Your list is empty. Ready to add your first item?"

---

## Writing Principles

### 1. Lead with Action
Start with verbs when giving instructions.

✅ **Good:** "Tap the mic and speak your item"  
❌ **Bad:** "The mic button can be used to add items by voice"

✅ **Good:** "Enable location to find nearby stores"  
❌ **Bad:** "Location services are required for the nearby stores feature"

---

### 2. Be Concise
Every word must earn its place. Aim for < 10 words per sentence.

✅ **Good:** "Couldn't get your location. Try again?"  
❌ **Bad:** "We were unable to retrieve your current location at this time. Would you like to attempt to retrieve it again?"

✅ **Good:** "Added milk to your list"  
❌ **Bad:** "Your item has been successfully added to your shopping list"

---

### 3. Use Active Voice
Active voice is clearer and more direct.

✅ **Good:** "We found 5 stores near you"  
❌ **Bad:** "5 stores were found near your location"

✅ **Good:** "Your route has been optimized"  
❌ **Bad:** "The route optimization process has completed"

---

### 4. Write for Scanning
Users scan, they don't read every word. Make it scannable.

✅ **Good:**
```
Your list is empty
Add items by:
• Typing
• Speaking
• Scanning
```

❌ **Bad:**
```
Currently your shopping list does not contain any items.  
You can add items to your list by typing them in manually,  
using the voice input feature, or by scanning products with your camera.
```

---

### 5. Avoid Jargon
Use plain language that anyone can understand.

✅ **Good:** "Turn on location services"  
❌ **Bad:** "Enable geolocation permissions"

✅ **Good:** "Save your shopping history"  
❌ **Bad:** "Persist transaction metadata"

---

### 6. Be Specific
Vague language creates confusion. Be precise.

✅ **Good:** "3.2 km away, 8 min drive"  
❌ **Bad:** "Nearby, very close"

✅ **Good:** "Milk costs $3.99 at Walmart"  
❌ **Bad:** "This item is available at a competitive price"

---

## Grammar & Style

### Capitalization
- **Sentence case** for all UI text (not Title Case)
- **Proper nouns:** Capitalize brand names, app names, place names
- **Buttons:** Sentence case ("Add to list" not "Add To List")

✅ "Enable location services"  
❌ "Enable Location Services"

✅ "Open in Google Maps"  
❌ "Open in google maps"

---

### Punctuation
- **Periods:** Use for complete sentences in body text, skip for buttons/labels
- **Exclamation marks:** Use sparingly (only for celebrations, achievements)
- **Question marks:** Use for actual questions only
- **Ellipsis (...):** Only for "in progress" states, never to imply something

✅ Button: "Add to list" (no period)  
✅ Paragraph: "Your location helps us find nearby stores." (period)  

✅ Success: "Great job! 10 tasks completed." (enthusiasm warranted)  
❌ Default: "Add your items!" (too enthusiastic for normal action)

---

### Contractions
Use contractions to sound more human and friendly.

✅ "We couldn't find that product"  
❌ "We could not find that product"

✅ "You're all set!"  
❌ "You are all set!"

**Exception:** Don't use contractions in error messages where clarity is critical.

❌ "Can't connect" (too casual for error)  
✅ "Cannot connect to server. Check your internet connection."

---

### Numbers
- **Spell out:** One through nine
- **Use numerals:** 10 and above
- **Exceptions:** Measurements, money, percentages always use numerals

✅ "You have three items on your list"  
✅ "You have 12 items on your list"  
✅ "2.5 km away" (not "two and a half kilometers away")  
✅ "$3.99" (not "three dollars and ninety-nine cents")

---

## Button & Link Copy

### Buttons
**Format:** Verb + Noun (when possible)

✅ "Add item"  
✅ "Search stores"  
✅ "Plan route"  
✅ "Enable location"

**Avoid:**
❌ "Click here"  
❌ "OK" (unless system dialog)  
❌ "Submit"

---

### Destructive Actions
Be explicit about what will happen.

✅ "Delete task"  
❌ "Remove" (ambiguous)

✅ "Clear all items"  
❌ "Reset"

---

### Confirmations
Ask a clear question, offer clear choices.

✅ "Delete 'Organic milk'?" [Delete] [Cancel]  
❌ "Are you sure?" [Yes] [No]

---

## Error Messages

### Anatomy of a Good Error Message
```
[What happened] + [Why it happened] + [What to do]
```

✅ **Perfect:**
"Couldn't find your location. GPS signal is weak. Try moving near a window."
- What: Couldn't find location
- Why: GPS weak
- How to fix: Move near window

❌ **Bad:**
"Error: Code 403"
- No context, no solution

---

### Error Message Templates

#### Network Errors
```
"Couldn't connect to [service].  
Check your internet connection and try again."
[Retry]
```

#### Permission Errors
```
"[Feature] needs [permission] access.  
Enable in Settings to use this feature."
[Open Settings] [Not Now]
```

#### Not Found Errors
```
"Couldn't find [thing you searched for].  
Try a different search or add it manually."
[Try Again] [Add Manually]
```

#### Generic Errors (when we don't know what went wrong)
```
"Something went wrong.  
Try again in a moment."
[Retry] [Report Problem]
```

---

### Error Message Examples

**Location:**
✅ "Couldn't get your location. GPS signal is weak. Try moving outdoors or near a window."  
❌ "Location error"

**Voice:**
✅ "Didn't catch that. Try speaking closer to the mic or in a quieter place."  
❌ "Voice recognition failed"

**Camera:**
✅ "Couldn't read the product. Try better lighting or a closer shot."  
❌ "OCR processing failed"

**Store Search:**
✅ "Couldn't reach store APIs right now. Check your connection and try again."  
❌ "HTTP 500 error"

---

## Placeholder Text

### Input Fields
Keep placeholders short and example-based.

✅ "What do you need?" (question invites action)  
❌ "Enter item name here" (too instructional)

✅ "Whole Foods, Safeway, etc." (gives examples)  
❌ "Type the name of the store" (redundant)

---

## Empty States

### Structure
```
[Title: What's missing]
[Explanation: Why it's empty]
[Call to Action: What to do next]
```

**Example:**
```
Your list is empty
Add items to start finding the best prices near you.
[Add First Item]
```

**NOT:**
```
No items
```

---

### Empty State Examples

**No tasks yet:**
```
Your list is empty
Add your first item by typing, speaking, or scanning.
[Get Started]
```

**No search results:**
```
No stores found
Try a different product name or expand your search area.
[Search Again]
```

**No completed tasks:**
```
No tasks completed yet
Mark items as done to track your shopping progress.
```

---

## Success Messages

### Confirmations
Keep them brief and positive.

✅ "Added milk to your list"  
❌ "Success! The item 'milk' has been successfully added to your shopping list."

✅ "Route saved"  
❌ "Your route has been saved successfully"

---

### Achievements/Milestones
These can be more enthusiastic.

✅ "Great job! 10 tasks completed today!"  
✅ "You're on a roll! 5 items added in a row."  
✅ "First task done! Keep it up!"

---

## Tooltip & Help Text

### Keep it Scannable
Users won't read long tooltips. Aim for 1-2 sentences max.

✅ "Tap the mic and speak. We'll add it instantly!"  
❌ "Voice input allows you to add items to your shopping list by speaking them aloud into your device's microphone, which will then be transcribed and added automatically."

---

### Explain Benefits, Not Features
Tell users WHY they should use something.

✅ "Save time by adding items hands-free while cooking"  
❌ "Voice input uses speech recognition technology"

✅ "Find the cheapest price without visiting every store"  
❌ "Store search queries multiple retail APIs"

---

## Notification Copy

### Push Notifications
**Format:** [Context] + [Action needed]

✅ "Near Whole Foods. 3 items on your list. Shop now?"  
❌ "Geofence triggered"

✅ "Milk price dropped to $2.99 at Target"  
❌ "Price alert"

---

## Onboarding Copy

### Welcome Screen
**Structure:** Hook + Value Prop + CTA

```
Welcome to Ellio!
Your smart shopping companion that finds the best prices near you.
[Get Started]
```

---

### Tutorial Steps
Keep each screen to ONE concept.

**Screen 1: Voice**
```
Add items by voice
Just tap the mic and speak what you need.
[Next]
```

**Screen 2: Search**
```
Find the best prices
We search 8+ stores instantly.
[Next]
```

**Screen 3: Navigate**
```
Get there fast
Optimize routes to save time and gas.
[Start Shopping]
```

---

## Accessibility Considerations

### Screen Reader Labels
Provide context that sighted users get visually.

**Visual:** [🎤] (microphone icon)  
**Screen reader:** "Voice input button. Tap to add items by speaking."

**Visual:** [✓] (checkmark)  
**Screen reader:** "Mark task as complete"

---

### Alt Text for Icons
All icons need meaningful labels.

❌ "Icon"  
❌ "Image"  
✅ "Microphone"  
✅ "Shopping cart"

---

## Emoji Usage

### When to Use Emojis
✅ **Store logos:** 🛒 Walmart, 🎯 Target  
✅ **Feature icons:** 📍 Location, 🎤 Voice  
✅ **Success states:** ✅ Completed, 🎉 Celebration  
✅ **Empty states:** 📝 No items yet

### When NOT to Use Emojis
❌ **Error messages:** "❌ Error" (too casual)  
❌ **Body text:** "Get 📍 location" (hard to scan)  
❌ **Legal/serious:** Privacy policy, terms

---

### Emoji Accessibility
Always pair with text, never emoji alone.

✅ "📍 Location" (icon + text)  
❌ "📍" (emoji alone, not screen-reader friendly)

---

## Brand Names & Trademarks

### Capitalization
Use official brand capitalization.

✅ "Walmart" (not "WalMart")  
✅ "Google Maps" (not "Google maps")  
✅ "iPhone" (not "IPhone" or "iphone")

---

### Possessives
Don't make brand names possessive.

✅ "Open the Walmart app"  
❌ "Open Walmart's app"

---

## Copy Review Checklist

Before publishing any new copy, ask:

- [ ] Is it in active voice?
- [ ] Is every word necessary?
- [ ] Would a 12-year-old understand it?
- [ ] Does it answer "What's in it for me?"
- [ ] Is it free of jargon and technical terms?
- [ ] Is it in sentence case (not Title Case)?
- [ ] Are contractions used naturally?
- [ ] Does it sound like a helpful friend (not a robot)?
- [ ] Is there a clear call to action?
- [ ] Would I say this out loud to a friend?

---

## Examples: Before & After

### Example 1: Input Placeholder
❌ **Before:** "Please enter the name of the item you wish to add to your shopping list"  
✅ **After:** "What do you need?"

**Why better:** Shorter (3 words vs 15), conversational, invites action

---

### Example 2: Error Message
❌ **Before:** "Error: Location services are currently disabled"  
✅ **After:** "Location is off. Enable in Settings to find nearby stores."

**Why better:** Plain language, explains benefit, clear action

---

### Example 3: Success Message
❌ **Before:** "The task has been successfully added to your list"  
✅ **After:** "Added to your list"

**Why better:** 4 words vs 10, active voice, no redundant "successfully"

---

### Example 4: Empty State
❌ **Before:** "No data available"  
✅ **After:**
```
Your list is empty
Add items to start finding deals near you.
[Add First Item]
```

**Why better:** Explains WHY empty, suggests action, positive framing

---

### Example 5: Button
❌ **Before:** "Click here to submit"  
✅ **After:** "Add to list"

**Why better:** Specific action, no "click here", mobile-friendly

---

### Example 6: Confirmation Dialog
❌ **Before:** "Are you sure?" [Yes] [No]  
✅ **After:** "Delete 'Organic milk'?" [Delete] [Cancel]

**Why better:** Shows what will be deleted, button labels match actions

---

## Terminology Glossary

### Consistent Terms
Use the SAME word for the same concept everywhere.

| Concept | Use This | Not This |
|---------|----------|----------|
| Shopping items | "items" or "tasks" | "entries", "todos", "records" |
| Finish shopping | "complete" | "done", "finish", "check off" |
| Remove from list | "delete" | "remove", "clear", "erase" |
| Your saved locations | "saved locations" | "pins", "markers", "favorites" |
| Store search results | "results" | "matches", "findings", "options" |
| Navigation app | "navigation app" | "maps", "GPS", "directions" |

---

## Special Contexts

### Loading States
Show progress, not just "loading."

✅ "Finding nearby stores..."  
✅ "Searching 8 stores..."  
✅ "Getting your location..."  
❌ "Loading..."  
❌ "Please wait..."

---

### Permission Requests
Explain the benefit before asking.

✅ "Enable location to find stores near you"  
❌ "This app needs location access"

✅ "Enable microphone for hands-free shopping"  
❌ "Microphone permission required"

---

### Settings Descriptions
Explain what each setting does.

✅ "Default navigation app - Choose Apple Maps, Google Maps, or Waze"  
❌ "Navigation preference"

✅ "Smart reminders - Get notified when near a store with items on your list"  
❌ "Enable notifications"

---

## Voice & Tone Spectrum

```
Too Formal          Just Right           Too Casual
─────────────────────────────────────────────────────
"We apologize       "Couldn't find       "Oops! No clue
for the             that product.        where that is
inconvenience"      Try searching        lol 🤷"
                    again."
```

**Sweet Spot:** Helpful friend who knows what they're talking about.

---

## Testing Your Copy

### Read It Out Loud
If it sounds awkward spoken, it's awkward written.

---

### The Mom Test
Would your mom understand it without explanation?

---

### The 5-Second Test
Can user understand what to do in 5 seconds?

---

### The Deletion Test
Remove every word that doesn't add meaning. Can you cut 30%?

---

## Localization Considerations

### Design for Translation
- Avoid idioms ("piece of cake", "ballpark figure")
- Keep sentences short (easier to translate)
- Don't embed text in images
- Allow 30% more space for German, 50% for Russian

---

### Cultural Sensitivity
- Avoid culture-specific references
- Use universal icons (✓ ✗ rather than words when possible)
- Be mindful of emoji meanings (👍 is offensive in some cultures)

---

**Document Maintainer:** Content Team  
**Last Updated:** December 30, 2024  
**Next Review:** Quarterly or before major copy changes

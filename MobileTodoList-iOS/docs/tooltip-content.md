# Ellio Tooltip Content Library
**Version:** 1.0  
**Last Updated:** December 30, 2024  
**Purpose:** Complete library of all tooltips, hints, and progressive disclosure content

---

## Progressive Disclosure Philosophy

**Goal:** Guide users without overwhelming them

**Principles:**
1. **Show Only When Needed:** Tooltips appear on first interaction or when user seems stuck
2. **Be Brief:** Max 2 sentences, under 100 characters ideal
3. **Be Helpful:** Explain *why* not just *what*
4. **One at a Time:** Never show multiple tooltips simultaneously
5. **Dismissible:** User can always close and continue
6. **Don't Repeat:** Once dismissed, don't show again (unless user requests)

---

## Tooltip Component Specification

### Visual Design
```
┌──────────────────────────────┐
│ 💡 Feature Title             │
├──────────────────────────────┤
│ Brief explanation of what    │
│ this feature does and why    │
│ it's useful to the user.     │
├──────────────────────────────┤
│         [Got It!]            │
└──────────────────────────────┘
       ▼ (arrow pointing to feature)
```

### Component Props
```typescript
interface FeatureTipProps {
  id: string;              // Unique identifier for persistence
  title: string;           // Feature name (2-4 words)
  content: string;         // Explanation (1-2 sentences)
  icon?: string;           // Optional icon/emoji
  position?: 'above' | 'below' | 'left' | 'right';
  showOnce?: boolean;      // Default: true
  trigger?: 'auto' | 'manual' | 'hover' | 'press';
  delay?: number;          // ms to wait before showing (default: 500)
  children: ReactNode;     // The element to attach tooltip to
}
```

---

## Core Feature Tooltips

### Voice Input
**ID:** `tooltip-voice-input`  
**Icon:** 🎤  
**Title:** Voice Input  
**Content:** Tap and speak what you need. We'll add it to your list instantly!  
**Trigger:** First tap of microphone button  
**Position:** Below  

**Extended Help (if user taps "Learn More"):**
Voice input lets you add items hands-free. Great when:
- Your hands are full of groceries
- Driving to the store
- Multitasking in the kitchen

Tips for best results:
- Speak clearly and at normal pace
- Say the item name only (e.g., "Milk" not "Add milk to my list")
- You can speak multiple items: "Bread, eggs, and butter"

---

### Camera/Product Scanner
**ID:** `tooltip-camera-scan`  
**Icon:** 📸  
**Title:** Scan Products  
**Content:** Point at a barcode or product name. We'll find it in nearby stores!  
**Trigger:** First tap of camera button  
**Position:** Below  

**Extended Help:**
Two ways to scan:
1. **Barcode:** Point camera at barcode for instant product identification
2. **Text:** Snap a photo of product label to extract brand and details

What happens next:
- Product info auto-fills your task
- We search stores automatically
- You see prices and availability instantly

---

### Store Search
**ID:** `tooltip-store-search`  
**Icon:** 🔍  
**Title:** Store Finder  
**Content:** We search 8+ nearby stores for prices and availability. Tap any result to get directions!  
**Trigger:** After first automatic search completes  
**Position:** Above results list  

**Extended Help:**
Store search checks:
- Walmart
- Target  
- Kroger
- Whole Foods
- Safeway
- Trader Joe's
- Costco
- Instacart

Shows you:
- Current price
- In stock / Low stock / Out of stock
- Distance from you
- Store ratings
- Direct link to product page

Auto-searches as you type (after 3+ characters).

---

### GPS Location Tagging
**ID:** `tooltip-gps-location`  
**Icon:** 📍  
**Title:** Location Tagging  
**Content:** Save the store location to get reminders when you're nearby!  
**Trigger:** First tap of "Use Current Location" button  
**Position:** Below  

**Extended Help:**
Why save location?
- Get notified when near the store
- Plan multi-stop routes efficiently
- Track which stores you visit most

How it works:
- We save GPS coordinates with your task
- Location is private (never shared)
- Use manual entry if GPS unavailable

---

### Route Planning
**ID:** `tooltip-route-planner`  
**Icon:** 🗺️  
**Title:** Route Optimizer  
**Content:** Have 3+ stores to visit? We'll plan the fastest route to save time and gas!  
**Trigger:** When user has 3+ tasks with locations  
**Position:** Above button  

**Extended Help:**
Route planner:
- Finds shortest path through all stores
- Estimates drive time with current traffic
- Lets you reorder stops manually
- Works with Apple Maps, Google Maps, or Waze

Saves:
- Average 15 minutes per shopping trip
- 2-3 miles of unnecessary driving
- Helps you stick to your list (fewer impulse stops!)

---

### Navigation App Choice
**ID:** `tooltip-nav-preference`  
**Icon:** 🧭  
**Title:** Your Navigation App  
**Content:** Pick your favorite! Directions will always open in your chosen app.  
**Trigger:** First time tapping a store result  
**Position:** Above chips  

**Extended Help:**
Supported apps:
- **Apple Maps:** Built-in, no install needed
- **Google Maps:** Best for public transit
- **Waze:** Real-time traffic and police alerts

Your choice is saved for all future directions.

Change anytime in Settings.

---

## Onboarding Tooltips

### Welcome (First Launch)
**ID:** `onboarding-welcome`  
**Title:** Welcome to Ellio!  
**Content:** Your smart shopping assistant. Add items by typing, speaking, or scanning - we'll find the best prices near you.  
**Screen:** Full-screen modal (not tooltip)  
**Action:** "Get Started" button  

---

### First Task Added
**ID:** `onboarding-first-task`  
**Icon:** ✅  
**Title:** Great Start!  
**Content:** Now try tapping 🔍 to see where this item is available nearby.  
**Trigger:** Immediately after first task added  
**Position:** Above search button  

---

### First Store Result
**ID:** `onboarding-first-result`  
**Icon:** 🏪  
**Title:** Found It!  
**Content:** Tap any store card to open directions. Prices and availability update daily.  
**Trigger:** First search results appear  
**Position:** Above first result card  

---

### Route Suggestion
**ID:** `onboarding-route-hint`  
**Icon:** 💡  
**Title:** Pro Tip  
**Content:** You have locations for 3 items. Want us to plan the fastest route through all stores?  
**Trigger:** When 3+ tasks have locations AND route hasn't been used yet  
**Position:** Floating bottom banner  
**Actions:** ["Plan Route", "Not Now"]  

---

## Empty State Guidance

### No Tasks Yet
**Title:** Your list is empty  
**Content:** Add your first item by typing, speaking, or scanning. We'll help you find the best price!  
**CTA Button:** "Add First Item" (focuses input)  
**Visual:** Friendly illustration of shopping basket  

---

### No Search Results
**Title:** No results found nearby  
**Content:** Try a different product name or expand your search radius in Settings.  
**CTA Button:** "Try Another Item"  

---

### No Location Permission
**Title:** Location Needed  
**Content:** We use your location to find nearby stores and compare prices. Your location is never shared or sold.  
**CTA Button:** "Enable Location" → Opens Settings  

---

### No Microphone Permission
**Title:** Microphone Access Needed  
**Content:** Voice input requires microphone access. Enable in Settings to use hands-free shopping.  
**CTA Button:** "Enable Microphone" → Opens Settings  

---

### No Camera Permission
**Title:** Camera Access Needed  
**Content:** Product scanning needs camera access. Enable in Settings to scan barcodes and labels.  
**CTA Button:** "Enable Camera" → Opens Settings  

---

## Error Recovery Tooltips

### Voice Recognition Failed
**ID:** `error-voice-failed`  
**Icon:** ❌  
**Title:** Didn't Catch That  
**Content:** Try speaking closer to the mic or in a quieter location. You can also type the item manually.  
**Trigger:** Voice service returns empty transcript  
**Duration:** 4 seconds (auto-dismiss)  

---

### Store Search Failed
**ID:** `error-search-failed`  
**Icon:** ⚠️  
**Title:** Search Unavailable  
**Content:** Couldn't connect to store APIs. Check your internet connection and try again.  
**Trigger:** API timeout or network error  
**Duration:** 5 seconds (auto-dismiss)  
**Action:** "Retry" button  

---

### Location Unavailable
**ID:** `error-location-failed`  
**Icon:** 📍  
**Title:** Location Not Found  
**Content:** GPS signal weak. Try moving near a window or manually enter store address.  
**Trigger:** Geolocation timeout  
**Duration:** 5 seconds  
**Action:** "Enter Manually" button  

---

### Camera Scan Failed
**ID:** `error-scan-failed`  
**Icon:** 📸  
**Title:** Couldn't Read Product  
**Content:** Try better lighting or a closer shot. You can also type the product name manually.  
**Trigger:** OCR returns no text  
**Duration:** 4 seconds  
**Action:** "Try Again" or "Type It"  

---

## Discovery Hints (Contextual)

### After 5 Voice Adds
**ID:** `hint-voice-pro`  
**Icon:** 🎉  
**Title:** Voice Input Pro!  
**Content:** You're getting good at this! Did you know you can say multiple items at once? Try: "Bread, milk, and eggs"  
**Trigger:** 5th successful voice add  
**Show Once:** Yes  

---

### After 10 Store Searches
**ID:** `hint-search-auto`  
**Icon:** 💡  
**Title:** Smart Search Tip  
**Content:** We automatically search stores as you type (no need to tap 🔍 every time).  
**Trigger:** 10th manual search tap  
**Show Once:** Yes  

---

### First Weekend Use
**ID:** `hint-route-weekend`  
**Icon:** 🗓️  
**Title:** Weekend Shopping?  
**Content:** Traffic is lighter on weekend mornings. Plan your route to save even more time!  
**Trigger:** Saturday/Sunday 9am-11am  
**Show Once:** Per week  

---

### After Completing 20 Tasks
**ID:** `milestone-20-tasks`  
**Icon:** 🏆  
**Title:** 20 Tasks Completed!  
**Content:** You're on a roll! Share Ellio with friends and shop together.  
**Trigger:** 20th task marked complete  
**Show Once:** Yes  
**Action:** "Invite Friends" (future feature)  

---

## Settings/Advanced Tooltips

### Notification Settings
**ID:** `tooltip-notifications`  
**Title:** Smart Reminders  
**Content:** Get notified when you're near a store with items on your list (requires location access).  
**Trigger:** When toggling notification setting  
**Position:** Right of toggle  

---

### Data Sync
**ID:** `tooltip-sync`  
**Title:** Cloud Sync  
**Content:** Your shopping list stays in sync across all your devices (requires account login).  
**Trigger:** When enabling sync  
**Position:** Below toggle  

---

### Export Data
**ID:** `tooltip-export`  
**Title:** Export Your Data  
**Content:** Download all your tasks, shopping history, and analytics as a CSV file.  
**Trigger:** Hover/tap on export button  
**Position:** Below button  

---

## Tooltip Sequencing

### First Time User Journey
```
App Launch
  ↓
1. Welcome modal (full screen)
  ↓
2. User adds first task (text or voice)
  ↓
3. Tooltip: "Try tapping 🔍 to search stores"
  ↓
4. User taps search
  ↓
5. Results appear
  ↓
6. Tooltip: "Tap any card to get directions"
  ↓
7. User taps card
  ↓
8. Tooltip: "Choose your navigation app"
  ↓
9. User chooses app
  ↓
10. Directions open
  ↓
11. User returns to app
  ↓
12. Tooltip: "Great job! You're all set. Explore other features in Settings."
```

**Total Time:** ~2-3 minutes  
**Total Tooltips:** 5 (spaced by user actions, not time)

---

## Tooltip Triggers

### Auto-Trigger Rules
- **First Interaction:** Show on first tap/use of feature
- **Idle Detection:** If user inactive for 10 seconds on new screen, show context hint
- **Milestone:** After X completions, congratulate and suggest next feature
- **Error Recovery:** Immediately when error occurs, with helpful guidance
- **Feature Discovery:** If user hasn't used a feature in 7 days, gentle reminder

### Manual Trigger
- **"?" Icon:** Every feature has optional help icon for on-demand tooltips
- **Help Menu:** Settings > Help & Tips shows all available tooltips
- **Reset Tooltips:** Settings > Advanced > Reset All Tips (for re-onboarding)

---

## Accessibility Considerations

### Screen Reader Support
All tooltips must include:
```typescript
<FeatureTip
  accessible={true}
  accessibilityLabel={title}
  accessibilityHint={content}
  accessibilityRole="tooltip"
>
```

### Keyboard Navigation
- Tab to focus on element
- Tooltip appears after 1 second focus
- Spacebar to dismiss tooltip
- Enter to activate primary action

### Visual
- Minimum 4.5:1 contrast ratio
- Font size: 14-16px (never smaller)
- Clear arrow pointing to target
- Semi-transparent backdrop to dim rest of UI

---

## Implementation Checklist

- [ ] Create FeatureTip component with all props
- [ ] Add AsyncStorage for "shown" state persistence
- [ ] Implement tooltip queue (one at a time)
- [ ] Add tooltip manager for triggering logic
- [ ] Create all 25+ tooltip content entries
- [ ] Design tooltip visual style (matches design system)
- [ ] Add accessibility attributes
- [ ] Test on iOS and Android
- [ ] Verify no tooltip conflicts
- [ ] Add analytics for tooltip engagement

---

## Analytics Events

Track tooltip effectiveness:
```typescript
analytics().logEvent('tooltip_shown', {
  tooltip_id: 'tooltip-voice-input',
  trigger: 'first_tap',
  screen: 'home',
});

analytics().logEvent('tooltip_dismissed', {
  tooltip_id: 'tooltip-voice-input',
  time_shown: 3.2, // seconds
  action: 'got_it' | 'background_tap' | 'auto_dismiss',
});

analytics().logEvent('tooltip_action', {
  tooltip_id: 'tooltip-route-planner',
  action: 'plan_route',
  converted: true,
});
```

**Success Metrics:**
- Dismissal rate < 20% (most users read and act)
- Average time shown > 2 seconds (actually reading)
- Feature adoption rate > 60% after seeing tooltip

---

**Document Maintainer:** UX Team  
**Last Updated:** December 30, 2024  
**Next Review:** After user testing feedback

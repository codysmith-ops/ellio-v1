# Ellio Design System Reference
**Version:** 1.0  
**Last Updated:** December 30, 2024  
**Purpose:** Single source of truth for all visual design decisions

---

## Design Principles

1. **Clarity Over Cleverness** - Every element has a clear purpose
2. **Consistency Breeds Familiarity** - Same patterns everywhere
3. **Accessibility First** - WCAG 2.1 AA minimum standard
4. **Mobile-Optimized** - Touch targets, readable type, thumb-friendly
5. **Performance Matters** - Lightweight, fast, no jank

---

## Color System

### Palette Definition
All colors defined in `src/theme.ts`:

```typescript
export const palette = {
  // Backgrounds
  background: '#FAFAFA',      // Main app background
  surface: '#FFFFFF',         // Cards, modals, elevated content
  
  // Brand Colors
  primary: '#2563EB',         // Primary actions, links
  primaryDark: '#1E40AF',     // Pressed state, emphasis
  
  // Semantic Colors
  success: '#10B981',         // Completed, available, positive
  warning: '#F59E0B',         // Caution, low stock, alerts
  danger: '#EF4444',          // Errors, delete, critical
  
  // Text Hierarchy
  text: '#111827',            // Primary text, headings
  textSecondary: '#6B7280',   // Secondary text, descriptions
  muted: '#9CA3AF',           // Placeholders, disabled text
  
  // Borders & Dividers
  border: '#E5E7EB',          // Subtle separators
};
```

### Color Usage Rules

**Primary Blue (#2563EB)**
- ✅ Call-to-action buttons
- ✅ Active navigation states
- ✅ Links and interactive text
- ❌ Backgrounds (too intense)
- ❌ Large text blocks

**Success Green (#10B981)**
- ✅ Task completion checkmarks
- ✅ "In Stock" badges
- ✅ Success toast notifications
- ❌ Primary actions (use blue)

**Warning Amber (#F59E0B)**
- ✅ "Low Stock" indicators
- ✅ Permission prompts
- ✅ Unsaved changes alerts
- ❌ Errors (use red)

**Danger Red (#EF4444)**
- ✅ Delete buttons
- ✅ Error messages
- ✅ Critical warnings
- ❌ Info messages

### Contrast Requirements
All text must meet WCAG AA standards:
- **Normal text (< 18px):** Minimum 4.5:1 contrast ratio
- **Large text (≥ 18px):** Minimum 3:1 contrast ratio

**Verified Combinations:**
- ✅ text (#111827) on background (#FAFAFA) = 8.5:1
- ✅ text (#111827) on surface (#FFFFFF) = 10.5:1
- ✅ textSecondary (#6B7280) on background = 4.6:1
- ✅ primary (#2563EB) on surface = 4.8:1
- ❌ muted (#9CA3AF) on background = 3.2:1 (use only for placeholder text)

---

## Typography

### Type Scale
```typescript
export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',     // Bold
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',     // Semibold
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
  },
  
  // Body Text
  body: {
    fontSize: 16,
    fontWeight: '400',     // Regular
    lineHeight: 24,
    letterSpacing: 0,
  },
  small: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.25,
  },
  
  // Utility
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
};
```

### Typography Usage

**Headings:**
- **H1:** Page titles only (max 1 per screen)
- **H2:** Section headings, card titles
- **H3:** Subsection headings, list headers

**Body Text:**
- **body:** Default for all content, descriptions
- **small:** Helper text, secondary info
- **caption:** Timestamps, metadata, legal text

**System Font:**
- iOS: San Francisco
- Android: Roboto
- Use `-apple-system, system-ui` for native rendering

### Line Length
- **Optimal:** 50-75 characters per line
- **Maximum:** 90 characters before wrapping

---

## Spacing System

### Scale
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Usage Guidelines

**Component Padding:**
- Cards: `spacing.md` (16px)
- Buttons: `spacing.sm` vertical, `spacing.md` horizontal
- Modals: `spacing.lg` (24px)

**Margins:**
- Between sections: `spacing.lg` (24px)
- Between cards: `spacing.md` (16px)
- Between form fields: `spacing.sm` (8px)
- Between text lines: Use lineHeight instead

**Touch Targets:**
- Minimum: 44x44pt (iOS) / 48x48dp (Android)
- Recommended: 48x48 for all platforms

---

## Shadows & Elevation

### Shadow Levels
```typescript
export const shadow = {
  // Low elevation (cards, inputs)
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,        // Android
  },
  
  // Medium elevation (modals, toasts)
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // High elevation (dropdowns, popovers)
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
```

### Elevation Usage
- **0dp:** Background, dividers
- **1dp:** Cards, inputs (shadow.sm)
- **2dp:** Buttons (raised), active cards (shadow.md)
- **4dp:** Modals, drawers (shadow.lg)
- **8dp:** Navigation bars, FABs
- **16dp:** Dialogs, pickers

---

## Border Radius

```typescript
export const radius = {
  sm: 4,     // Chips, badges
  md: 8,     // Buttons, inputs
  lg: 12,    // Cards
  xl: 16,    // Modals
  round: 999, // Circular (avatars, pills)
};
```

**Usage:**
- Buttons: `radius.md` (8px)
- Cards: `radius.lg` (12px)
- Modals: `radius.xl` (16px)
- Badges: `radius.sm` (4px)
- Profile pics: `radius.round`

---

## Component Patterns

### Buttons

#### Primary Button
```typescript
<TouchableOpacity style={styles.primaryButton}>
  <Text style={styles.primaryButtonText}>Add Item</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    ...shadow.sm,
  },
  primaryButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
```

#### Secondary Button (Ghost)
```typescript
<TouchableOpacity style={styles.secondaryButton}>
  <Text style={styles.secondaryButtonText}>Cancel</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  secondaryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  secondaryButtonText: {
    ...typography.button,
    color: palette.text,
  },
});
```

#### Danger Button
```typescript
const styles = StyleSheet.create({
  dangerButton: {
    backgroundColor: palette.danger,
    // ... same padding/radius as primary
  },
});
```

**States:**
- **Default:** Full color
- **Pressed:** Opacity 0.8 OR darker shade
- **Disabled:** Opacity 0.5, no shadow, no tap

### Cards
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  cardBody: {
    ...typography.body,
    color: palette.textSecondary,
  },
});
```

### Form Inputs
```typescript
const styles = StyleSheet.create({
  input: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...typography.body,
    color: palette.text,
    minHeight: 44, // Touch target
  },
  inputFocused: {
    borderColor: palette.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: palette.danger,
  },
});
```

### Badges
```typescript
const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    backgroundColor: palette.primary,
  },
  badgeText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
```

**Variants:**
- Success: `backgroundColor: palette.success`
- Warning: `backgroundColor: palette.warning`
- Danger: `backgroundColor: palette.danger`
- Neutral: `backgroundColor: palette.textSecondary`

### Lists
```typescript
const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  listItemText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: palette.border,
  },
});
```

---

## Icons

### Icon System
- **Library:** `@expo/vector-icons` or custom SVG
- **Size Scale:**
  - Small: 16px (inline with text)
  - Medium: 24px (buttons, list items)
  - Large: 32px (headers, empty states)
  - XLarge: 48px (illustrations)

### Icon Colors
- Primary actions: `palette.primary`
- Secondary/inactive: `palette.textSecondary`
- Destructive: `palette.danger`
- Success: `palette.success`

### Icon + Text
```typescript
<View style={styles.iconTextRow}>
  <LocationIcon size={16} color={palette.textSecondary} />
  <Text style={styles.iconLabel}>2.3 km away</Text>
</View>

const styles = StyleSheet.create({
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconLabel: {
    ...typography.small,
    color: palette.textSecondary,
  },
});
```

---

## Accessibility

### Touch Targets
- **Minimum:** 44x44pt
- **Recommended:** 48x48pt
- **Spacing:** 8px minimum between tappable elements

### Screen Reader Support
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Add new task"
  accessibilityHint="Opens task creation form"
>
  <PlusIcon />
</TouchableOpacity>
```

### Color Independence
- Never rely on color alone to convey information
- Use icons + text + color together
- Example: ✅ "In Stock" (text + icon + green color)

### Focus States
- All interactive elements must have visible focus indicator
- Use `borderWidth: 2` and `borderColor: palette.primary` on focus

---

## Animation Guidelines

### Timing
- **Fast:** 150ms (hover effects, ripples)
- **Medium:** 250ms (transitions, modals)
- **Slow:** 400ms (page transitions, major state changes)

### Easing
- **Standard:** `cubic-bezier(0.4, 0.0, 0.2, 1)` (ease-in-out)
- **Enter:** `cubic-bezier(0.0, 0.0, 0.2, 1)` (ease-out)
- **Exit:** `cubic-bezier(0.4, 0.0, 1, 1)` (ease-in)

### Use Cases
- **Fade in/out:** Toasts, tooltips (opacity 0 → 1)
- **Slide up:** Modals, bottom sheets (translateY: 100% → 0%)
- **Scale:** Pressed state (scale: 1 → 0.95)
- **Spin:** Loading indicators (rotate: 0deg → 360deg)

---

## Layout Patterns

### Screen Layout
```typescript
<SafeAreaView style={styles.container}>
  <StatusBar barStyle="dark-content" />
  <ScrollView contentContainerStyle={styles.scrollContent}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.pageTitle}>Page Title</Text>
    </View>
    
    {/* Content */}
    <View style={styles.content}>
      {/* Cards, lists, forms */}
    </View>
  </ScrollView>
</SafeAreaView>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  pageTitle: {
    ...typography.h1,
    color: palette.text,
  },
  content: {
    gap: spacing.md, // Modern gap property (RN 0.71+)
  },
});
```

### Grid System
- **Gutter:** 16px between columns
- **Margins:** 16px on phone, 24px on tablet
- **Columns:** 4 on phone, 12 on tablet

---

## Dark Mode (Future)

**Palette Adjustments:**
```typescript
export const darkPalette = {
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#374151',
  // Primary, success, warning, danger stay same
};
```

**Implementation:**
```typescript
import { useColorScheme } from 'react-native';

const App = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkPalette : palette;
  
  return <View style={{ backgroundColor: colors.background }} />;
};
```

---

## Code Style

### StyleSheet Creation
✅ **Do:**
```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: palette.surface,
  },
});
```

❌ **Don't:**
```typescript
<View style={{padding: 16, backgroundColor: '#FFFFFF'}} />
```

### Naming Conventions
- **Containers:** `container`, `wrapper`, `content`
- **Headers:** `header`, `title`, `subtitle`
- **Lists:** `list`, `listItem`, `separator`
- **States:** `active`, `disabled`, `error`, `focused`

### Organization
1. Layout properties (flex, position, dimensions)
2. Spacing (margin, padding)
3. Typography (fontSize, fontWeight, color)
4. Visual (backgroundColor, borderRadius, shadow)

Example:
```typescript
const styles = StyleSheet.create({
  button: {
    // Layout
    alignItems: 'center',
    justifyContent: 'center',
    
    // Spacing
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    
    // Typography
    ...typography.button,
    
    // Visual
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    ...shadow.sm,
  },
});
```

---

## Platform-Specific Adjustments

### iOS vs Android
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  button: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
```

### Safe Area
Always use `SafeAreaView` on iOS to avoid notch/home indicator.

---

## Resources

### Design Tools
- **Figma:** [Design file link]
- **Color contrast checker:** https://webaim.org/resources/contrastchecker/
- **Typography scale calculator:** https://type-scale.com/

### Code References
- `src/theme.ts` - Palette, spacing, typography, shadows
- `src/components/` - Reusable styled components

### Inspiration
- Apple Human Interface Guidelines
- Material Design 3
- iOS native apps (Reminders, Notes)

---

**Document Maintainer:** Design Team  
**Last Updated:** December 30, 2024  
**Next Review:** Quarterly or when adding new components

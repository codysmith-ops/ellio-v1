/**
 * ELLIO V2.0 DESIGN SYSTEM TOKENS
 * 
 * Single source of visual truth derived from the ellio brand identity.
 * 
 * ⚠️ DO NOT MODIFY WITHOUT DOCUMENTATION ⚠️
 * All tokens are calibrated for calm, harmonious, enterprise-grade UX
 * 
 * Derived from: ellio logo, brand guidelines, and accessibility standards
 * Maintained by: Design System Team
 * Last updated: December 30, 2025
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * Primary brand colors derived from ellio logo
 * Based on calm indigo palette with enterprise accessibility
 */
export const EllioColors = {
  /**
   * PRIMARY BRAND
   * Core ellio brand color - calm indigo
   */
  primary: {
    main: '#5159B0',      // Primary indigo (from ellio logo)
    light: '#818CF8',     // Light indigo (accessible tints)
    dark: '#3d4389',      // Dark indigo (hover states)
    subtle: 'rgba(81, 89, 176, 0.05)', // Very light background
  },

  /**
   * SURFACES
   * Clean, calm backgrounds for content
   */
  surface: {
    background: '#FFFFFF',        // Primary white background
    elevated: '#F1F5F9',          // Subtle elevation (off-white)
    overlay: '#FAFBFC',          // Modal/overlay background
    dark: '#1E293B',             // Dark mode surface (NOT pure black)
  },

  /**
   * TEXT HIERARCHY
   * Clear, readable text with calm contrast
   */
  text: {
    primary: '#0F172A',          // Primary readable text
    secondary: '#64748B',        // Muted secondary text
    tertiary: '#94A3B8',         // Descriptive tertiary text
    inverse: '#F1F5F9',          // Text on dark backgrounds
    onPrimary: '#FFFFFF',        // Text on primary color
  },

  /**
   * BORDERS & DIVIDERS
   * Subtle separation, never harsh
   */
  border: {
    main: '#E5E7EB',             // Standard 1px borders
    light: '#F1F5F9',            // Very subtle dividers
    dark: '#334155',             // Borders on dark backgrounds
  },

  /**
   * SEMANTIC STATES
   * Calm alerts - reserved for actual system states
   */
  states: {
    success: {
      main: '#059669',           // Green - success only
      light: 'rgba(5, 150, 105, 0.05)',
      text: '#065F46',
    },
    warning: {
      main: '#D97706',           // Orange - warnings only  
      light: 'rgba(217, 119, 6, 0.05)',
      text: '#92400E',
    },
    error: {
      main: '#DC2626',           // Red - errors only
      light: 'rgba(220, 38, 38, 0.05)',
      text: '#991B1B',
    },
    info: {
      main: '#818CF8',           // Light indigo - information
      light: 'rgba(129, 140, 248, 0.05)',
      text: '#4338CA',
    },
  },

  /**
   * OVERLAYS
   * Calm, non-intrusive overlays
   */
  overlay: {
    dark: 'rgba(15, 23, 42, 0.6)',
    light: 'rgba(15, 23, 42, 0.3)',
    subtle: 'rgba(15, 23, 42, 0.1)',
  },
} as const;

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Consistent spacing scale for harmonious layout
 * Base unit: 4px for 8pt grid system compatibility
 */
export const EllioSpacing = {
  /** 4px - Minimal spacing */
  xs: 4,
  /** 8px - Small spacing */
  sm: 8,
  /** 16px - Standard spacing */
  md: 16,
  /** 24px - Large spacing */
  lg: 24,
  /** 32px - Extra large spacing */
  xl: 32,
  /** 48px - Section spacing */
  xxl: 48,
  /** 64px - Page section spacing */
  xxxl: 64,
} as const;

// ============================================================================
// RADIUS SYSTEM
// ============================================================================

/**
 * Border radius scale for calm, soft edges
 * Follows 6/8/12px pattern from design system
 */
export const EllioRadius = {
  /** 6px - Badges, pills, small elements */
  badge: 6,
  /** 8px - Buttons, inputs, small cards */
  button: 8,
  /** 12px - Cards, containers */
  card: 12,
  /** 16px - Large containers */
  large: 16,
  /** Full circle */
  full: 9999,
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Typography scale calibrated for readability
 * 
 * Quicksand: Brand headings (matches ellio logo)
 * Inter: Body copy (enterprise readability)
 */
export const EllioTypography = {
  /**
   * Display - Extra large headings
   * Quicksand Bold
   */
  display: {
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 56,
    fontFamily: 'Quicksand-Bold',
    letterSpacing: -0.5,
  },

  /**
   * H1 - Page titles
   * Quicksand Bold
   */
  h1: {
    fontSize: 42,
    fontWeight: '700' as const,
    lineHeight: 48,
    fontFamily: 'Quicksand-Bold',
    letterSpacing: -0.5,
  },

  /**
   * H2 - Section headings
   * Quicksand Bold
   */
  h2: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    fontFamily: 'Quicksand-Bold',
    letterSpacing: -0.25,
  },

  /**
   * H3 - Subsection headings
   * Quicksand Bold
   */
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    fontFamily: 'Quicksand-Bold',
    letterSpacing: 0,
  },

  /**
   * Subtitle - Section subtitles
   * Quicksand SemiBold
   */
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: 'Quicksand-SemiBold',
    letterSpacing: 0,
  },

  /**
   * Body - Standard readable text
   * Inter Regular
   */
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0,
  },

  /**
   * Body Bold - Emphasized body text
   * Inter SemiBold
   */
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0,
  },

  /**
   * Body Large - Slightly larger body text
   * Inter Regular
   */
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0,
  },

  /**
   * Secondary - Supporting text
   * Inter Regular
   */
  secondary: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0,
  },

  /**
   * Caption - Small descriptive text
   * Inter Regular
   */
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.2,
  },

  /**
   * Label - All-caps labels
   * Inter Medium
   */
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase' as const,
    letterSpacing: 1.0,
  },
} as const;

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

/**
 * Elevation system for calm, subtle depth
 * iOS-compatible shadow specifications
 */
export const EllioShadow = {
  /**
   * None - No shadow (flat)
   */
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  /**
   * Light - Subtle card elevation
   * 0 2px 8px rgba(15, 23, 42, 0.04)
   */
  light: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  /**
   * Medium - Standard elevation
   * 0 4px 16px rgba(15, 23, 42, 0.08)
   */
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  /**
   * Elevated - Modal/overlay elevation
   * 0 4px 16px rgba(15, 23, 42, 0.15)
   */
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },

  /**
   * Featured - Primary brand elevation
   * 0 8px 32px rgba(81, 89, 176, 0.2)
   */
  featured: {
    shadowColor: '#5159B0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

// ============================================================================
// MOTION SYSTEM
// ============================================================================

/**
 * Animation timing for calm, purposeful motion
 * All values in milliseconds
 */
export const EllioMotion = {
  /** 150ms - Instant feedback */
  instant: 150,
  /** 200ms - Fast transitions */
  fast: 200,
  /** 300ms - Standard transitions */
  normal: 300,
  /** 500ms - Slow, intentional motion */
  slow: 500,
  /** 700ms - Page transitions */
  page: 700,
} as const;

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================

/**
 * Layout and interaction constants
 */
export const EllioLayout = {
  /**
   * Touch targets - iOS accessibility minimum
   */
  touchTarget: {
    min: 44,           // Minimum 44x44pt per iOS HIG
    comfortable: 48,   // Comfortable target size
  },

  /**
   * Border widths
   */
  borderWidth: {
    thin: 1,          // Standard 1px borders
    medium: 2,        // Emphasized borders
    thick: 3,         // Accent borders
  },

  /**
   * Icon sizes
   */
  iconSize: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
  },

  /**
   * Container widths
   */
  container: {
    maxWidth: 1200,   // Maximum content width
    padding: EllioSpacing.lg,
  },
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Complete ellio design system
 */
export const Ellio = {
  colors: EllioColors,
  spacing: EllioSpacing,
  radius: EllioRadius,
  typography: EllioTypography,
  shadow: EllioShadow,
  motion: EllioMotion,
  layout: EllioLayout,
} as const;

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Aliases for backward compatibility with existing codebase
 * @deprecated Use Ellio.colors instead
 */
export const palette = {
  primary: EllioColors.primary.main,
  primaryLight: EllioColors.primary.light,
  primaryDark: EllioColors.primary.dark,
  
  background: EllioColors.surface.background,
  backgroundDark: EllioColors.surface.dark,
  surface: EllioColors.surface.background,
  surfaceElevated: EllioColors.surface.elevated,
  
  text: EllioColors.text.primary,
  textSecondary: EllioColors.text.secondary,
  textTertiary: EllioColors.text.tertiary,
  textInverse: EllioColors.text.inverse,
  textOnDark: EllioColors.text.inverse,
  textOnDarkSecondary: EllioColors.text.tertiary,
  textOnDarkTertiary: EllioColors.text.secondary,
  
  success: EllioColors.states.success.main,
  successLight: EllioColors.states.success.light,
  warning: EllioColors.states.warning.main,
  warningLight: EllioColors.states.warning.light,
  error: EllioColors.states.error.main,
  errorLight: EllioColors.states.error.light,
  danger: EllioColors.states.error.main,
  info: EllioColors.states.info.main,
  infoLight: EllioColors.states.info.light,
  
  alertCritical: EllioColors.states.error.main,
  alertWarning: EllioColors.states.warning.main,
  alertSuccess: EllioColors.states.success.main,
  alertInfo: EllioColors.states.info.main,
  
  priorityHigh: EllioColors.states.error.main,
  priorityMedium: EllioColors.states.warning.main,
  priorityLow: EllioColors.states.success.main,
  
  border: EllioColors.border.main,
  borderDark: EllioColors.border.dark,
  divider: EllioColors.border.light,
  
  overlay: EllioColors.overlay.dark,
  overlayLight: EllioColors.overlay.light,
  
  labelOnDark: EllioColors.primary.light,
} as const;

/**
 * @deprecated Use Ellio.spacing instead
 */
export const spacing = EllioSpacing;

/**
 * @deprecated Use Ellio.radius instead
 */
export const radius = EllioRadius;

/**
 * @deprecated Use Ellio.typography instead
 */
export const typography = EllioTypography;

/**
 * @deprecated Use Ellio.shadow instead
 */
export const shadow = EllioShadow.light;

/**
 * @deprecated Use Ellio.shadow.elevated instead
 */
export const shadowLarge = EllioShadow.elevated;

/**
 * @deprecated Use Ellio.motion instead
 */
export const animations = {
  fast: EllioMotion.fast,
  normal: EllioMotion.normal,
  slow: EllioMotion.slow,
};

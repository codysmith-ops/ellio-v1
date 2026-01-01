/**
 * ELLIO V2.0 DESIGN SYSTEM
 * Re-exports from ellioTokens.ts for backward compatibility
 * All new code should import from ellioTokens.ts directly
 */
import {
  palette as elliopalette,
  spacing as ellioSpacing,
  radius as ellioRadius,
  typography as ellioTypography,
  shadow as ellioShadow,
  shadowLarge as ellioShadowLarge,
  animations as ellioAnimations,
} from './theme/ellioTokens';

// Re-export for backward compatibility
export const palette = elliopalette;
export const spacing = ellioSpacing;
export const radius = ellioRadius;
export const typography = ellioTypography;
export const shadow = ellioShadow;
export const shadowLarge = ellioShadowLarge;
export const animations = ellioAnimations;

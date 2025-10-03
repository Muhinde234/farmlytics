// src/config/theme.ts

export const colors = {
  primary: '#00A1DE',      // Rwandan Flag Blue
  secondary: '#FDC400',    // Rwandan Flag Yellow
  tertiary: '#23B24F',      // Original Rwandan Flag Green
  darkGreen: '#187B3D',    // NEW: Darker Green for depth/accents
  text: '#333333',
  lightText: '#FFFFFF',
  background: '#F9F9F9',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  success: '#28A745',
  error: '#DC3545',
  placeholder: '#999999',
  gradientStart: '#00A1DE', // Blue for gradient start
  gradientEnd: '#23B24F',   // Original Green for gradient end
  darkGradientEnd: '#187B3D', // Darker green for gradient end for more contrast
};

export const spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 40,
  xxxl: 60, // Added for larger spacing
};

export const fontSizes = {
  xsmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40, // Added for very large titles
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  pill: 50,
};

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  fontSizes: typeof fontSizes;
  borderRadius: typeof borderRadius;
};

export const defaultTheme: Theme = {
  colors,
  spacing,
  fontSizes,
  borderRadius,
};
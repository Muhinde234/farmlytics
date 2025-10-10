

export const colors = {
  primary: '#00A1DE',     
  secondary: '#FDC400',    
  tertiary: '#187B3D',    
  darkGreen: '#187B3D',   
  text: '#333333',
  lightText: '#FFFFFF',
  background: '#F9F9F9',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  success: '#187B3D',
  error: '#DC3545',
  placeholder: '#999999',
  gradientStart: '#00A1DE',
  gradientEnd: '#187B3D',   
  darkGradientEnd: '#187B3D', 
};

export const spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 40,
  xxxl: 60, 
};

export const fontSizes = {
  xsmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40, 
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

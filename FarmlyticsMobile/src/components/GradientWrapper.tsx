// src/components/GradientWrapper.tsx

import React from 'react';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { defaultTheme } from '../config/theme'; // Import defaultTheme

// CRITICAL FIX: Make the required props optional in the interface
// This allows styled-components to use GradientWrapper without immediately demanding 'colors'
interface GradientWrapperProps extends Omit<LinearGradientProps, 'colors' | 'start' | 'end'> {
  colors?: LinearGradientProps['colors']; // Now optional
  start?: LinearGradientProps['start'];   // Now optional
  end?: LinearGradientProps['end'];       // Now optional
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({
  // Provide default values here, which LinearGradient will receive
  colors = [defaultTheme.colors.gradientStart, defaultTheme.colors.darkGradientEnd],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
  ...rest // Capture any other LinearGradientProps
}) => {
  return (
    // Pass all props, including our defaults/overrides, to LinearGradient
    <LinearGradient colors={colors} start={start} end={end} {...rest}>
      {children}
    </LinearGradient>
  );
};

export default GradientWrapper;
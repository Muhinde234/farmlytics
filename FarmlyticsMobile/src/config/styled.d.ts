// src/config/styled.d.ts
import 'styled-components/native';
import { Theme } from './theme'; // Import your Theme type from your theme file

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {} // Extend DefaultTheme with your custom Theme
}
// index.js (or index.ts)
import { registerRootComponent } from 'expo';
import App from './App'; // Make sure this path is correct if App.tsx is in src/

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
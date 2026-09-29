// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // TODO: these React Compiler-readiness rules flag existing data-fetching
    // effects across the app; downgraded to warn until that's refactored.
    // react-hooks/immutability also false-positives on Reanimated's
    // useSharedValue().value mutation, which is the correct API for it.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]);

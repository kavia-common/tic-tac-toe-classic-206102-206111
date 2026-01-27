module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Keep the default RN/Expo transform behavior from the preset.
  // Add small, stable defaults for local dev and CI.
  verbose: false,
};

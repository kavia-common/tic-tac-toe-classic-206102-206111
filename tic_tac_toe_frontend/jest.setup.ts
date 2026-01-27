import '@testing-library/jest-native/extend-expect';

// Keep the test env clean between tests.
afterEach(() => {
  jest.clearAllMocks();
});

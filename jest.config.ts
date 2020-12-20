export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(test).ts',
  ],
  testPathIgnorePatterns: ['dist'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
};

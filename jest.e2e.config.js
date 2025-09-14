// jest.e2e.config.js

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.[tj]s$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleFileExtensions: ['js', 'mjs', 'ts', 'json', 'node'],
  testMatch: ['**/ts/__tests__/e2e/**/*.test.ts'],
  testTimeout: 60000,
};

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
  moduleNameMapper: {
    // '^./configs/configurations$': '<rootDir>/src/configs/__mocks__/configurations.ts',
    // '^./database/database$': '<rootDir>/src/database/__mocks__/database.ts',
    // '^./router$': '<rootDir>/src/__mocks__/router.ts',
    // '^./utils/logger$': '<rootDir>/src/utils/__mocks__/logger.ts',
  },
};

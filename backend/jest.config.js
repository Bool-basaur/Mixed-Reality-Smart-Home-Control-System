module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  restoreMocks: true,
  forceExit: true,
  
  moduleNameMapper: {
    "^@services/(.*)$": "<rootDir>/src/application/services/$1",
    "^@usecases/(.*)$": "<rootDir>/src/application/usecases/$1",
    "^@logger/(.*)$": "<rootDir>/src/infrastructure/logger/$1"
  }
};

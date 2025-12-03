export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@scenes/(.*)$': '<rootDir>/src/scenes/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@systems/(.*)$': '<rootDir>/src/systems/$1',
    '^@patterns/(.*)$': '<rootDir>/src/patterns/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: '@shelf/jest-mongodb',
    coverageDirectory: './coverage',
    collectCoverageFrom: ['/src/**/*.ts'],
    collectCoverage: true,
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    testTimeout: 20000,
    resetMocks: true,
    clearMocks: true
};
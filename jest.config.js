/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.spec.ts"],
  coverageReporters: ["json", "json-summary", "text", "lcov"],
};

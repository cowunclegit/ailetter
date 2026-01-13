/** @type {import('jest').Config} */
const config = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>"
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",
  
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./tests/setup.js'],

  // The default timeout for tests
  testTimeout: 5000,
};

module.exports = config;

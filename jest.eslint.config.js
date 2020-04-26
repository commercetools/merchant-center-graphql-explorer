module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  moduleFileExtensions: ['js'],
  modulePathIgnorePatterns: ['dist', 'public'],
  testMatch: ['<rootDir>/**/*.js'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-master'],
};

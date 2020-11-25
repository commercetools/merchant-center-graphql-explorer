process.env.ENABLE_NEW_JSX_TRANSFORM = 'true';

module.exports = {
  extends: [
    '@commercetools-frontend/eslint-config-mc-app',
    'plugin:testing-library/react',
  ],
  plugins: ['react-hooks'],
  rules: {
    'max-classes-per-file': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jest/expect-expect': 'off',
    'testing-library/prefer-presence-queries': 'error',
    'testing-library/await-async-query': 'error',
  },
  settings: { react: { version: '^16.14' } },
  overrides: [
    {
      files: ['*.spec.js'],
      rules: { 'prefer-promise-reject-errors': 0, 'no-console': 0 },
    },
  ],
};

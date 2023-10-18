module.exports = {
    root: true,
    env: { es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'airbnb',
      'airbnb/hooks',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'src/api'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', '@typescript-eslint'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'import/no-extraneous-dependencies': 'off',
      'indent': ['error', 'tab'],
      'react/jsx-indent': ['error', 'tab'],
      'react/jsx-indent-props': ['error', 'tab'],
      'no-tabs': ['error', { allowIndentationTabs: true }],
      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/react-in-jsx-scope': 'off',
      'max-len': ['error', 140],
      'import/extensions': ['error', { 'ts': 'never', 'tsx': 'never' }],
      'import/no-unresolved': 'off',
      'import/order': ['error', { groups: [['builtin', 'external']], 'newlines-between': 'always' }],
    },
  }
  
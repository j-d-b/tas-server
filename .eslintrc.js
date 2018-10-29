module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: 'eslint:recommended',
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'eqeqeq': ['error', 'always'],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    'no-return-await': 'error',
    'no-trailing-spaces': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};

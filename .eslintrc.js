module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'indent': ["off", 2],
    'comma-dangle': 0,
    'no-trailing-spaces': 0,
    'eol-last': 0,
    'space-before-function-paren': 0,
    "comma-spacing": 0,
    "vue/multi-word-component-names": 0,
    "import\first": 0,
    "quotes": 0,
    "arrow-spacing": 0,
    "semi": 0,
    "object-curly-spacing": 0,
    "prefer-const": 0,
    "key-spacing": 0,
    "no-multiple-empty-lines": 0,
    "padded-blocks": 0,
    "prefer-const": 0,
    "padded-blocks": 0,
    "key-spacing": 0,
    "space-before-blocks": 0,
    "no-unused-vars": 0,
    "import/first": 0,
    "quote-props": 0,
    "space-in-parens": 0
  }
}

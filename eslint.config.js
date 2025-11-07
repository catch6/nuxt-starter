import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
}, {
  ignores: [
    '.nuxt/**',
    '.vscode/**',
  ],
  rules: {
    'no-console': 'off',
    'vue/html-self-closing': 'off',
    'antfu/top-level-function': 'off',
  },
})

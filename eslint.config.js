import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
}, {
  settings: {
    'better-tailwindcss': {
      entryPoint: 'app/assets/css/tailwind.css',
    },
  },
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

import type { Config } from 'prettier'

// The Config type doesn't prevent bad values because Prettier intentionally
// allows arbitrary properties through an index signature. What Config
// actually does is give you better type hinting when you start with "".
const config: Config = {
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  tabWidth: 2,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  trailingComma: 'none',
  endOfLine: 'auto'
  // printWidth: 120,
}

export default config

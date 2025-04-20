// frontend/.lintstagedrc.js
module.exports = {
  // Run type-check on changes to TypeScript files
  '**/*.ts?(x)': () => 'pnpm type-check',
  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `pnpm eslint ${filenames.join(' ')}`,
    `pnpm prettier --write ${filenames.join(' ')}`,
  ],
  // Prettify only Markdown and JSON files
  '**/*.(md|json)': (filenames) => `pnpm prettier --write ${filenames.join(' ')}`,
};

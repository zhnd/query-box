/* eslint-disable no-undef */
module.exports = {
  '*.{js,jsx,mjs,ts,tsx,mts,mdx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,css,html,yml,yaml,scss}': ['prettier --write'],
  '*.rs': ['cargo fmt --manifest-path=./src-tauri/Cargo.toml --'],
}

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// get release type from command line argument
const releaseType = process.argv[2] // 'patch', 'minor', 'major', 'prerelease', etc.

if (!releaseType) {
  console.error(
    `❌ Please provide a release type as the first argument. Example: "patch", "minor", "major", "prerelease".`
  )
  process.exit(1)
}

// read package.json
const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

// calculate new version
const oldVersion = pkg.version
const newVersion = execSync(`semver ${oldVersion} -i ${releaseType}`, {
  encoding: 'utf-8',
}).trim()

if (!newVersion) {
  console.error(
    `❌ Failed to bump version from "${oldVersion}" using type "${releaseType}".`
  )
  process.exit(1)
}

// update package.json with new version
try {
  const output = execSync(`npm version ${newVersion} --no-git-tag-version`, {
    stdio: 'inherit',
  })

  console.log(
    `✅ Updated to version ${newVersion}， ${output.toString().trim()}`
  )
} catch (err) {
  console.error(`❌ Failed to update version: ${err.message}`)
  process.exit(1)
}

console.log(`✅ Bumped version: ${oldVersion} → ${newVersion}`)

import { readFile } from "node:fs/promises"

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
)

const serializedPackage = JSON.stringify(packageJson)
const requiredKeywords = [
  "medusa-v2",
  "medusa-plugin-integration",
  "medusa-plugin-other",
]
const missingKeywords = requiredKeywords.filter(
  (keyword) => !packageJson.keywords?.includes(keyword)
)

if (missingKeywords.length) {
  throw new Error(
    `Missing Medusa discovery keywords: ${missingKeywords.join(", ")}`
  )
}

if (packageJson.private) {
  throw new Error("The npm package must not be marked private.")
}

if (
  process.env.GITHUB_REF_NAME &&
  process.env.GITHUB_REF_NAME !== `v${packageJson.version}`
) {
  throw new Error(
    `Release tag ${process.env.GITHUB_REF_NAME} does not match package version v${packageJson.version}.`
  )
}

console.log(`Package metadata is ready for ${packageJson.name}@${packageJson.version}.`)

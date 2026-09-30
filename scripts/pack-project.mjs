import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const zipName = "mtc-digital-student-pass-complete.zip";
const zipPath = join(root, zipName);

const includes = [
  "src",
  "public",
  "scripts",
  "out",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "drizzle.config.json",
  "README.md",
  ".env.example",
  ".gitignore",
  "next-env.d.ts",
].filter((p) => existsSync(join(root, p)));

const args = [
  "-r",
  zipName,
  ...includes,
  "-x",
  "node_modules/*",
  ".next/*",
  "src/app/api/health/route.ts.demo-bak",
  "scripts/.health-route.bak",
];

const result = spawnSync("zip", args, { cwd: root, stdio: "inherit" });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
console.log(`Created ${zipPath}`);

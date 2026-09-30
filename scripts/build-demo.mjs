import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, writeFileSync, readdirSync, unlinkSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const healthRoute = join(root, "src/app/api/health/route.ts");
const healthBackup = join(root, "scripts/.health-route.bak");

function run(command, extraEnv = {}) {
  const result = spawnSync(command, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function restoreHealthRoute() {
  if (existsSync(healthBackup) && !existsSync(healthRoute)) {
    renameSync(healthBackup, healthRoute);
  }
}

function cleanExportArtifacts(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      cleanExportArtifacts(full);
    } else if (name.endsWith(".txt")) {
      unlinkSync(full);
    }
  }
}

process.on("exit", restoreHealthRoute);
process.on("SIGINT", () => {
  restoreHealthRoute();
  process.exit(1);
});

console.log("\n[1/2] Static export → out/\n");
if (existsSync(healthRoute)) {
  renameSync(healthRoute, healthBackup);
}
try {
  run("npx next build", { STATIC_EXPORT: "1" });
  const apiDir = join(root, "out/api");
  mkdirSync(apiDir, { recursive: true });
  writeFileSync(join(apiDir, "health"), JSON.stringify({ ok: true }));
  writeFileSync(join(apiDir, "health.json"), JSON.stringify({ ok: true }));
  cleanExportArtifacts(join(root, "out"));
} finally {
  restoreHealthRoute();
}

console.log("\n[2/2] Production server build → .next/\n");
run("npx next build", { STATIC_EXPORT: "" });

console.log("\nBuild complete.");
console.log("  • Server build: .next/   (npm start)");
console.log("  • Static site:  out/     (npx serve out)\n");

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";

const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
const run = (args) => spawnSync(process.execPath, [next, ...args], { stdio: "inherit" });

// The host can reuse the preview's dev output, which has no production build. --webpack avoids Turbopack's local port, which the sandbox blocks.
if (!existsSync(new URL("../.next/BUILD_ID", import.meta.url))) {
  console.log("No production build found; running `next build` first.");
  const build = run(["build", "--webpack"]);
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const server = spawn(process.execPath, [next, "start"], { stdio: "inherit" });
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => server.kill(sig));
server.on("exit", (code) => process.exit(code ?? 0));

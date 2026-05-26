#!/usr/bin/env node
// Downloads the UPR-FVX release zip, extracts UPR-FVX.jar to public/randomizer.jar,
// and verifies a pinned SHA-256.
//
// Pinned to upstream tag vFVX1.5.1. To bump:
//   1. Update FVX_TAG + ZIP_ASSET below.
//   2. Run: node scripts/fetch-randomizer-jar.mjs
//   3. Copy the printed SHA into JAR_SHA256.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FVX_TAG    = "vFVX1.5.1";
const ZIP_ASSET  = "UPR_FVX-v1_5_1-Linux_x86.zip";
const JAR_INSIDE = "UPR-FVX.jar";
const JAR_SHA256 = "330de79c1b40b0a283c87b61c0012bb30a647de4c79f91f5dcb93bfea3d5bc97";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir   = join(repoRoot, "public");
const outPath  = join(outDir, "randomizer.jar");

if (existsSync(outPath)) {
  const existing = createHash("sha256").update(readFileSync(outPath)).digest("hex");
  if (existing === JAR_SHA256) {
    console.log(`[fetch-randomizer-jar] ${outPath} already up-to-date (sha256 match).`);
    process.exit(0);
  }
  console.log(`[fetch-randomizer-jar] existing JAR has sha256=${existing}, expected ${JAR_SHA256} — refetching.`);
}

const downloadUrl = `https://github.com/upr-fvx/universal-pokemon-randomizer-fvx/releases/download/${FVX_TAG}/${ZIP_ASSET}`;
console.log(`[fetch-randomizer-jar] downloading ${downloadUrl}`);

const res = await fetch(downloadUrl, { redirect: "follow" });
if (!res.ok) {
  console.error(`[fetch-randomizer-jar] download failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const zipBytes = new Uint8Array(await res.arrayBuffer());

const work = join(tmpdir(), `upr-fvx-${process.pid}`);
mkdirSync(work, { recursive: true });
const zipPath = join(work, ZIP_ASSET);
writeFileSync(zipPath, zipBytes);

try {
  console.log(`[fetch-randomizer-jar] extracting ${JAR_INSIDE} from zip`);
  execFileSync("unzip", ["-p", zipPath, JAR_INSIDE], {
    stdio: ["ignore", "pipe", "inherit"],
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (e) {
  if (e.code === "ENOENT") {
    console.error("[fetch-randomizer-jar] 'unzip' binary not found. Install it (apt-get install unzip / brew install unzip) and re-run.");
  } else {
    console.error("[fetch-randomizer-jar] unzip failed:", e.message);
  }
  process.exit(1);
}

const jarBytes = execFileSync("unzip", ["-p", zipPath, JAR_INSIDE], {
  stdio: ["ignore", "pipe", "inherit"],
  maxBuffer: 64 * 1024 * 1024,
});

const actualSha = createHash("sha256").update(jarBytes).digest("hex");
if (actualSha !== JAR_SHA256) {
  console.error(`[fetch-randomizer-jar] SHA-256 mismatch! expected ${JAR_SHA256}, got ${actualSha}`);
  console.error("If this is intentional (you bumped FVX_TAG), update JAR_SHA256 in this script.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, jarBytes);
rmSync(work, { recursive: true, force: true });

console.log(`[fetch-randomizer-jar] wrote ${outPath} (${jarBytes.length} bytes, sha256 ok).`);

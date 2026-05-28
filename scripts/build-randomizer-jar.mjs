#!/usr/bin/env node
// Rebuilds the UPR-FVX randomizer jar so it runs under CheerpJ.
//
// Why this exists: upstream releases compile UPR-FVX with Java 25, but CheerpJ
// only supports up to Java 17. This script checks out the pinned submodule,
// applies scripts/upr-fvx-java17.patch (source tweaks + a toolchain override so
// the jar targets Java 17 bytecode), builds the fat jar, and copies it to
// public/randomizer.jar — which is committed to the repo and served as-is by
// Vite/Vercel/GitHub Pages.
//
// Requirements: a JDK (the patch pins the Gradle toolchain to Java 21) plus
// network access for Gradle + Maven dependencies. Run manually after an
// upstream bump; the deploy build does NOT run this (it uses the committed jar).
//
//   node scripts/build-randomizer-jar.mjs

import { execFileSync } from "node:child_process";
import { existsSync, copyFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const submodule = join(repoRoot, "randomizer");
const patch = join(repoRoot, "scripts", "upr-fvx-java17.patch");
const builtJar = join(submodule, "random", "build", "libs", "UPR-FVX.jar");
const outDir = join(repoRoot, "public");
const outJar = join(outDir, "randomizer.jar");

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit" });

// 1. Ensure the submodule is checked out at the pinned commit.
if (!existsSync(join(submodule, "build.gradle.kts"))) {
  console.log("[build-randomizer-jar] initializing submodule");
  run("git", ["submodule", "update", "--init", "randomizer"], repoRoot);
}

// 2. Reset the submodule to a clean pinned state, then apply our Java-17 patch.
console.log("[build-randomizer-jar] resetting submodule working tree");
run("git", ["-C", submodule, "checkout", "--", "."], repoRoot);
console.log(`[build-randomizer-jar] applying ${patch}`);
run("git", ["-C", submodule, "apply", patch], repoRoot);

// 3. Build the fat jar (compiles to Java 17 bytecode via the patched toolchain).
console.log("[build-randomizer-jar] building :random:jar");
const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
run(gradlew, [":random:jar", "--console=plain", "--no-daemon"], submodule);

if (!existsSync(builtJar)) {
  console.error(`[build-randomizer-jar] expected jar not found at ${builtJar}`);
  process.exit(1);
}

// 4. Publish to public/randomizer.jar (committed; served at /randomizer.jar).
mkdirSync(outDir, { recursive: true });
copyFileSync(builtJar, outJar);
console.log(`[build-randomizer-jar] wrote ${outJar}`);
console.log("[build-randomizer-jar] done. Commit public/randomizer.jar to publish.");

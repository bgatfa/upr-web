export interface RandomizeResult {
  romBlob: Blob;
  filename: string;
  log: string;
}

// cheerpjInit must only be called once per page — cache the promise
let _initPromise: Promise<void> | null = null;
function ensureInit(): Promise<void> {
  if (!_initPromise) {
    if (typeof cheerpjInit !== "function") {
      throw new Error("CheerpJ loader not available");
    }
    _initPromise = cheerpjInit({ version: 17, javaProperties: ["java.awt.headless=true"] });
  }
  return _initPromise!;
}

export async function cheerpjRandomize(
  romFile: File,
  settingsBytes: Uint8Array,
  jarPath: string
): Promise<RandomizeResult> {
  try {
    await ensureInit();
  } catch (error) {
    throw new Error(`CheerpJ init failed: ${String(error)}`);
  }

  const romBytes = new Uint8Array(await romFile.arrayBuffer());
  const extMatch = romFile.name.match(/(\.[^.]+)$/);
  const romExt = extMatch?.[1] ?? ".gba";
  const inputPath = `/str/input${romExt}`;
  const outputPath = `/files/output${romExt}`;

  // Write input files to the read-only /str/ mount (readable from Java)
  if (typeof cheerpOSAddStringFile !== "function" || typeof cheerpjRunJar !== "function" || typeof cjFileBlob !== "function") {
    throw new Error("CheerpJ runtime APIs are unavailable");
  }
  try {
    cheerpOSAddStringFile(inputPath, romBytes);
    cheerpOSAddStringFile("/str/settings.rnqs", settingsBytes);
  } catch (error) {
    throw new Error(`CheerpJ file staging failed: ${String(error)}`);
  }

  // Guard + diagnostic: CheerpJ has mishandled large binary files staged via
  // cheerpOSAddStringFile. Read the ROM back from the virtual filesystem and
  // compare, so a staging corruption surfaces clearly here instead of as a
  // cryptic "No valid pointer" failure deep inside the randomizer's ROM loader.
  try {
    const staged = new Uint8Array(await (await cjFileBlob(inputPath)).arrayBuffer());
    if (staged.length !== romBytes.length) {
      throw new Error(
        `CheerpJ-staged ROM is ${staged.length} bytes but the upload is ${romBytes.length} bytes — ` +
        `the virtual filesystem corrupted the file.`
      );
    }
    let diff = -1;
    for (let i = 0; i < romBytes.length; i++) {
      if (staged[i] !== romBytes[i]) { diff = i; break; }
    }
    if (diff !== -1) {
      throw new Error(
        `CheerpJ-staged ROM differs from the upload at byte 0x${diff.toString(16)} ` +
        `(read ${staged[diff]}, expected ${romBytes[diff]}) — the virtual filesystem corrupted the file.`
      );
    }
    console.log(`[upr] ROM staging verified: ${staged.length} bytes intact`);
  } catch (error) {
    // Definitive corruption is worth failing on; an inability to verify is not.
    if (error instanceof Error && error.message.startsWith("CheerpJ-staged ROM")) throw error;
    console.warn(`[upr] could not verify staged ROM (continuing): ${String(error)}`);
  }

  // CheerpJ routes the JVM's System.out / System.err to the browser console.
  // Capture it so the randomizer's output — and, on failure, its error/stack
  // trace — is surfaced instead of being silently lost.
  const consoleMethods = ["log", "info", "warn", "error", "debug"] as const;
  const captured: string[] = [];
  const originals: Record<string, (...args: unknown[]) => void> = {};
  for (const name of consoleMethods) {
    originals[name] = console[name];
    console[name] = (...args: unknown[]) => {
      captured.push(args.map(arg => String(arg)).join(" "));
      originals[name](...args);
    };
  }

  // Run the JAR; output goes to /files/ (writable from Java)
  let exitCode: number;
  try {
    exitCode = await cheerpjRunJar(
      jarPath,
      "cli",
      "-s", "/str/settings.rnqs",
      "-i", inputPath,
      "-o", outputPath,
      "-l"
    );
  } catch (error) {
    throw new Error(`CheerpJ JAR execution failed: ${String(error)}\n${captured.join("\n")}`.trim());
  } finally {
    for (const name of consoleMethods) console[name] = originals[name];
  }

  if (exitCode !== 0) {
    throw new Error(`Randomizer exited with code ${exitCode}.\n${captured.join("\n")}`.trim());
  }

  // Read the output ROM
  let blob: Blob;
  try {
    blob = await cjFileBlob(outputPath);
  } catch (error) {
    throw new Error(`CheerpJ output read failed at ${outputPath}: ${String(error)}`);
  }

  // The CLI writes a detailed log next to the output ROM when -l is passed.
  let log = captured.join("\n");
  try {
    const logBlob = await cjFileBlob(`${outputPath}.log`);
    const text = (await logBlob.text()).replace(/^﻿/, "");
    if (text.trim()) log = text;
  } catch {
    // No log file (older builds / write failure) — fall back to captured output.
  }

  // Derive output filename from input
  const outName = romFile.name.replace(/(\.[^.]+)$/, "_randomized$1");

  return { romBlob: blob, filename: outName, log };
}

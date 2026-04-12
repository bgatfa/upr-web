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
    _initPromise = cheerpjInit({ javaProperties: ["java.awt.headless=true"] });
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
    throw new Error(`CheerpJ JAR execution failed: ${String(error)}`);
  }
  if (exitCode !== 0) {
    throw new Error(`Randomizer exited with code ${exitCode}`);
  }

  // Read the output ROM
  let blob: Blob;
  try {
    blob = await cjFileBlob(outputPath);
  } catch (error) {
    throw new Error(`CheerpJ output read failed at ${outputPath}: ${String(error)}`);
  }

  // Derive output filename from input
  const outName = romFile.name.replace(/(\.[^.]+)$/, "_randomized$1");

  // Note: CheerpJ stdout is not easily capturable — log will be empty
  return { romBlob: blob, filename: outName, log: "" };
}

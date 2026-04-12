import type { UPRSettings } from "@/types/settings";
import { generationRestrictionMask, hasAnyGenerationSelected } from "@/lib/genRestrictions";

export interface RomProfile {
  fileName: string;
  extension: string;
  gameTitle: string;
  gameCode: string;
  family:
    | "gen1"
    | "gen2"
    | "rs"
    | "emerald"
    | "frlg"
    | "dp"
    | "pt"
    | "hgss"
    | "bw"
    | "bw2"
    | "xy"
    | "oras"
    | "sm"
    | "usum"
    | "unknown";
  generation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  hasPhysicalSpecialSplit: boolean;
  hasMoveTutors: boolean;
  supportsStarterHeldItems: boolean;
  hasTimeBasedEncounters: boolean;
  hasShopRandomization: boolean;
  canChangeStaticPokemon: boolean;
  hasMainGameLegendaries: boolean;
  hasStaticMusicFix: boolean;
  hasStarterAltFormes: boolean;
  hasWildAltFormes: boolean;
  hasFunctionalFormes: boolean;
  hasMegaEvolutions: boolean;
  hasStaticAltFormes: boolean;
  miscTweakMask: number;
}

const MISC = {
  BW_EXP_PATCH: 1 << 0,
  NERF_X_ACCURACY: 1 << 1,
  FIX_CRIT_RATE: 1 << 2,
  FASTEST_TEXT: 1 << 3,
  RUNNING_SHOES_INDOORS: 1 << 4,
  RANDOMIZE_PC_POTION: 1 << 5,
  ALLOW_PIKACHU_EVOLUTION: 1 << 6,
  NATIONAL_DEX_AT_START: 1 << 7,
  UPDATE_TYPE_EFFECTIVENESS: 1 << 8,
  FORCE_CHALLENGE_MODE: 1 << 9,
  LOWER_CASE_POKEMON_NAMES: 1 << 10,
  RANDOMIZE_CATCHING_TUTORIAL: 1 << 11,
  BAN_LUCKY_EGG: 1 << 12,
  NO_FREE_LUCKY_EGG: 1 << 13,
  BAN_BIG_MANIAC_ITEMS: 1 << 14,
  SOS_BATTLES_FOR_ALL: 1 << 15,
  BALANCE_STATIC_LEVELS: 1 << 16,
  RETAIN_ALT_FORMES: 1 << 17,
  RUN_WITHOUT_RUNNING_SHOES: 1 << 18,
  FASTER_HP_AND_EXP_BARS: 1 << 19,
  FAST_DISTORTION_WORLD: 1 << 20,
  UPDATE_ROTOM_FORME_TYPING: 1 << 21,
  DISABLE_LOW_HP_MUSIC: 1 << 22,
} as const;

function decodeAscii(bytes: Uint8Array, start: number, length: number): string {
  return Array.from(bytes.slice(start, start + length))
    .map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ""))
    .join("")
    .replace(/\0/g, "")
    .trim();
}

function normalizeText(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function findProductCode(header: Uint8Array): string {
  const headerText = decodeAscii(header, 0, header.length);
  const match = headerText.match(/CTR-P-[A-Z0-9]{4}/);
  return match?.[0] ?? "";
}

function detectFamily(extension: string, title: string, code: string, fileName: string): RomProfile["family"] {
  const lowerName = fileName.toLowerCase();
  const normalizedTitle = normalizeText(title);
  const normalizedName = normalizeText(fileName);

  if (extension === ".gba") {
    if (code.startsWith("BPR") || code.startsWith("BPG")) return "frlg";
    if (code.startsWith("BPE")) return "emerald";
    if (code.startsWith("AXV") || code.startsWith("AXP")) return "rs";
  }

  if (extension === ".gb") {
    return "gen1";
  }

  if (extension === ".gbc") {
    if (normalizedTitle.includes("CRYSTAL") || normalizedTitle.includes("GOLD") || normalizedTitle.includes("SILVER")) return "gen2";
    return "gen2";
  }

  if (extension === ".nds") {
    if (code.startsWith("IRE") || code.startsWith("IRD")) return "bw2";
    if (code.startsWith("IRB") || code.startsWith("IRA")) return "bw";
    if (code.startsWith("IPK") || code.startsWith("IPG")) return "hgss";
    if (code.startsWith("CPU")) return "pt";
    if (code.startsWith("ADA") || code.startsWith("APA")) return "dp";

    if (normalizedTitle.includes("BLACK2") || normalizedName.includes("BLACK2") || normalizedTitle.includes("WHITE2") || normalizedName.includes("WHITE2")) return "bw2";
    if (normalizedTitle.includes("BLACK") || normalizedName.includes("POKEMONBLACK") || normalizedTitle.includes("WHITE") || normalizedName.includes("POKEMONWHITE")) return "bw";
    if (normalizedTitle.includes("HEARTGOLD") || normalizedName.includes("HEARTGOLD") || normalizedTitle.includes("SOULSILVER") || normalizedName.includes("SOULSILVER")) return "hgss";
    if (normalizedTitle.includes("PLATINUM") || normalizedName.includes("PLATINUM")) return "pt";
    if (normalizedTitle.includes("DIAMOND") || normalizedName.includes("DIAMOND") || normalizedTitle.includes("PEARL") || normalizedName.includes("PEARL")) return "dp";
  }

  if (extension === ".3ds" || extension === ".cxi") {
    if (code.startsWith("CTR-P-A2A") || code.startsWith("CTR-P-A2B")) return "usum";
    if (code.startsWith("CTR-P-BND") || code.startsWith("CTR-P-BNE")) return "sm";
    if (code.startsWith("CTR-P-ECR") || code.startsWith("CTR-P-ECL")) return "oras";
    if (code.startsWith("CTR-P-EKJ") || code.startsWith("CTR-P-EK2")) return "xy";

    if (lowerName.includes("ultra sun") || lowerName.includes("ultra moon")) return "usum";
    if (lowerName.includes("omega ruby") || lowerName.includes("alpha sapphire")) return "oras";
    if (lowerName.includes("pokemon x") || lowerName.includes("pokemon y")) return "xy";
    if (lowerName.includes("sun") || lowerName.includes("moon")) return "sm";
  }

  return "unknown";
}

function getGeneration(family: RomProfile["family"]): RomProfile["generation"] {
  switch (family) {
    case "gen1": return 1;
    case "gen2": return 2;
    case "rs":
    case "emerald":
    case "frlg": return 3;
    case "dp":
    case "pt":
    case "hgss": return 4;
    case "bw":
    case "bw2": return 5;
    case "xy":
    case "oras": return 6;
    case "sm":
    case "usum": return 7;
    default: return null;
  }
}

function getMiscTweakMask(family: RomProfile["family"]): number {
  switch (family) {
    case "gen1":
      return MISC.LOWER_CASE_POKEMON_NAMES | MISC.UPDATE_TYPE_EFFECTIVENESS | MISC.FASTEST_TEXT |
        MISC.RANDOMIZE_PC_POTION | MISC.ALLOW_PIKACHU_EVOLUTION | MISC.RANDOMIZE_CATCHING_TUTORIAL |
        MISC.BW_EXP_PATCH | MISC.NERF_X_ACCURACY | MISC.FIX_CRIT_RATE;
    case "gen2":
      return MISC.LOWER_CASE_POKEMON_NAMES | MISC.UPDATE_TYPE_EFFECTIVENESS | MISC.FASTEST_TEXT |
        MISC.RANDOMIZE_CATCHING_TUTORIAL | MISC.BAN_LUCKY_EGG | MISC.BW_EXP_PATCH;
    case "rs":
      return MISC.LOWER_CASE_POKEMON_NAMES | MISC.NATIONAL_DEX_AT_START | MISC.UPDATE_TYPE_EFFECTIVENESS |
        MISC.RUNNING_SHOES_INDOORS | MISC.FASTEST_TEXT | MISC.RANDOMIZE_CATCHING_TUTORIAL |
        MISC.RANDOMIZE_PC_POTION | MISC.BAN_LUCKY_EGG | MISC.RUN_WITHOUT_RUNNING_SHOES;
    case "emerald":
      return MISC.LOWER_CASE_POKEMON_NAMES | MISC.NATIONAL_DEX_AT_START | MISC.UPDATE_TYPE_EFFECTIVENESS |
        MISC.RUNNING_SHOES_INDOORS | MISC.FASTEST_TEXT | MISC.RANDOMIZE_CATCHING_TUTORIAL |
        MISC.RANDOMIZE_PC_POTION | MISC.BAN_LUCKY_EGG | MISC.RUN_WITHOUT_RUNNING_SHOES;
    case "frlg":
      return MISC.LOWER_CASE_POKEMON_NAMES | MISC.NATIONAL_DEX_AT_START | MISC.UPDATE_TYPE_EFFECTIVENESS |
        MISC.RUNNING_SHOES_INDOORS | MISC.FASTEST_TEXT | MISC.RANDOMIZE_CATCHING_TUTORIAL |
        MISC.RANDOMIZE_PC_POTION | MISC.BAN_LUCKY_EGG | MISC.RUN_WITHOUT_RUNNING_SHOES |
        MISC.BALANCE_STATIC_LEVELS;
    case "dp":
      return MISC.LOWER_CASE_POKEMON_NAMES | MISC.RANDOMIZE_CATCHING_TUTORIAL | MISC.UPDATE_TYPE_EFFECTIVENESS |
        MISC.BAN_LUCKY_EGG | MISC.NATIONAL_DEX_AT_START | MISC.RUN_WITHOUT_RUNNING_SHOES |
        MISC.FASTER_HP_AND_EXP_BARS;
    case "pt":
    case "hgss":
      return MISC.LOWER_CASE_POKEMON_NAMES | MISC.RANDOMIZE_CATCHING_TUTORIAL | MISC.UPDATE_TYPE_EFFECTIVENESS |
        MISC.FASTEST_TEXT | MISC.BAN_LUCKY_EGG | MISC.NATIONAL_DEX_AT_START | MISC.RUN_WITHOUT_RUNNING_SHOES |
        MISC.FASTER_HP_AND_EXP_BARS | MISC.UPDATE_ROTOM_FORME_TYPING |
        (family === "pt" ? MISC.FAST_DISTORTION_WORLD : 0);
    case "bw":
      return MISC.FASTEST_TEXT | MISC.BAN_LUCKY_EGG | MISC.NO_FREE_LUCKY_EGG | MISC.BAN_BIG_MANIAC_ITEMS |
        MISC.UPDATE_TYPE_EFFECTIVENESS | MISC.BALANCE_STATIC_LEVELS | MISC.NATIONAL_DEX_AT_START |
        MISC.RUN_WITHOUT_RUNNING_SHOES | MISC.DISABLE_LOW_HP_MUSIC;
    case "bw2":
      return MISC.FASTEST_TEXT | MISC.BAN_LUCKY_EGG | MISC.NO_FREE_LUCKY_EGG | MISC.BAN_BIG_MANIAC_ITEMS |
        MISC.UPDATE_TYPE_EFFECTIVENESS | MISC.NATIONAL_DEX_AT_START | MISC.RUN_WITHOUT_RUNNING_SHOES |
        MISC.FORCE_CHALLENGE_MODE | MISC.DISABLE_LOW_HP_MUSIC;
    case "xy":
    case "oras":
      return MISC.FASTEST_TEXT | MISC.BAN_LUCKY_EGG | MISC.RETAIN_ALT_FORMES | MISC.NATIONAL_DEX_AT_START;
    case "sm":
    case "usum":
      return MISC.FASTEST_TEXT | MISC.BAN_LUCKY_EGG | MISC.SOS_BATTLES_FOR_ALL | MISC.RETAIN_ALT_FORMES;
    default:
      return 0;
  }
}

function buildCapabilities(family: RomProfile["family"]) {
  const generation = getGeneration(family);

  return {
    generation,
    hasPhysicalSpecialSplit: generation !== null && generation >= 4,
    hasMoveTutors:
      family === "frlg" || family === "emerald" || family === "pt" || family === "hgss" ||
      family === "bw2" || family === "oras" || family === "usum",
    supportsStarterHeldItems:
      family === "rs" || family === "emerald" || family === "frlg" || family === "dp" || family === "pt" ||
      family === "xy" || family === "oras" || family === "sm" || family === "usum",
    hasTimeBasedEncounters:
      family === "gen2" || family === "hgss" || family === "bw" || family === "bw2" || family === "sm" || family === "usum",
    hasShopRandomization:
      family !== "gen1" && family !== "gen2" && family !== "unknown",
    canChangeStaticPokemon:
      family !== "unknown",
    hasMainGameLegendaries:
      family !== "unknown",
    hasStaticMusicFix:
      family === "rs" || family === "emerald" || family === "frlg" || family === "pt" ||
      family === "hgss" || family === "bw" || family === "bw2",
    hasStarterAltFormes:
      family === "xy" || family === "oras" || family === "sm" || family === "usum",
    hasWildAltFormes:
      family === "bw" || family === "bw2" || family === "xy" || family === "oras" || family === "sm" || family === "usum",
    hasFunctionalFormes:
      family === "pt" || family === "hgss" || family === "bw" || family === "bw2" ||
      family === "xy" || family === "oras" || family === "sm" || family === "usum",
    hasMegaEvolutions:
      family === "xy" || family === "oras" || family === "sm" || family === "usum",
    hasStaticAltFormes:
      family === "xy" || family === "oras" || family === "sm" || family === "usum",
    miscTweakMask: getMiscTweakMask(family),
  };
}

export async function detectRomProfile(file: File): Promise<RomProfile> {
  const extensionMatch = file.name.toLowerCase().match(/\.[^.]+$/);
  const extension = extensionMatch?.[0] ?? "";
  const header = new Uint8Array(await file.slice(0, 0x400).arrayBuffer());
  const gameTitle = extension === ".gba"
    ? decodeAscii(header, 0xa0, 12)
    : extension === ".gb" || extension === ".gbc"
      ? decodeAscii(header, 0x134, 16)
      : extension === ".nds"
        ? decodeAscii(header, 0x0, 12)
        : "";
  const gameCode = extension === ".gba"
    ? decodeAscii(header, 0xac, 4)
    : extension === ".nds"
      ? decodeAscii(header, 0xc, 4)
      : extension === ".3ds" || extension === ".cxi"
        ? findProductCode(header)
        : "";

  const family = detectFamily(extension, gameTitle, gameCode, file.name);
  const capabilities = buildCapabilities(family);

  return {
    fileName: file.name,
    extension,
    gameTitle,
    gameCode,
    family,
    ...capabilities,
  };
}

export function sanitizeSettingsForRom(settings: UPRSettings, rom: RomProfile | null): UPRSettings {
  if (!rom) return settings;

  const next: UPRSettings = { ...settings };

  if (!rom.hasPhysicalSpecialSplit) {
    next.randomizeMoveCategory = false;
  }
  if (!rom.hasMoveTutors) {
    next.moveTutorMovesMod = "UNCHANGED";
    next.moveTutorsCompatibilityMod = "UNCHANGED";
    next.tutorLevelUpMoveSanity = false;
    next.keepFieldMoveTutors = false;
    next.tutorsForceGoodDamaging = false;
    next.tutorsGoodDamagingPercent = 0;
    next.blockBrokenTutorMoves = false;
    next.tutorFollowEvolutions = false;
  }
  if (!rom.supportsStarterHeldItems) {
    next.randomizeStartersHeldItems = false;
    next.banBadRandomStarterHeldItems = false;
  }
  if (!rom.hasTimeBasedEncounters) {
    next.useTimeBasedEncounters = false;
  }
  if (!rom.hasShopRandomization) {
    next.shopItemsMod = "UNCHANGED";
    next.banBadRandomShopItems = false;
    next.banRegularShopItems = false;
    next.banOPShopItems = false;
    next.balanceShopPrices = false;
    next.guaranteeEvolutionItems = false;
    next.guaranteeXItems = false;
  }
  if ((rom.generation ?? 3) < 3) {
    next.pickupItemsMod = "UNCHANGED";
    next.banBadRandomPickupItems = false;
  }
  if (!rom.hasStaticMusicFix) {
    next.correctStaticMusic = false;
  }
  if (!rom.hasStarterAltFormes) {
    next.allowStarterAltFormes = false;
  }
  if (!rom.hasWildAltFormes) {
    next.allowWildAltFormes = false;
  }
  if (!rom.hasFunctionalFormes) {
    next.allowTrainerAlternateFormes = false;
  }
  if (!rom.hasMegaEvolutions) {
    next.baseStatsFollowMegaEvolutions = false;
    next.typesFollowMegaEvolutions = false;
    next.abilitiesFollowMegaEvolutions = false;
    next.swapTrainerMegaEvos = false;
    next.swapStaticMegaEvos = false;
  }
  if (!rom.hasStaticAltFormes) {
    next.allowStaticAltFormes = false;
  }

  next.currentRestrictions &= generationRestrictionMask(rom.generation);
  if (!hasAnyGenerationSelected(next.currentRestrictions)) {
    next.currentRestrictions = 0;
  }

  next.currentMiscTweaks &= rom.miscTweakMask;

  return next;
}

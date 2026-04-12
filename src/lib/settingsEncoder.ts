// Encodes UPRSettings → binary .rnqs file (Uint8Array)
// Mirrors com.dabomstew.pkrandom.Settings.write() / toString()
// VERSION 322 (UPR-ZX 4.6.1)

import type { UPRSettings } from "@/types/settings";

const UPR_VERSION = 322; // Version.VERSION

// ─── CRC-32 (ISO 3309, same as java.util.zip.CRC32) ─────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    t[i] = c;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const b of bytes) {
    crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) | 0; // signed int32 to match Java's (int)checksum.getValue()
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function bits(...bools: boolean[]): number {
  let v = 0;
  for (let i = 0; i < bools.length && i < 8; i++) {
    if (bools[i]) v |= 1 << i;
  }
  return v & 0xff;
}

function putInt32BE(arr: number[], v: number) {
  arr.push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
}

function put2ByteLE(arr: number[], v: number) {
  arr.push(v & 0xff, (v >> 8) & 0xff);
}

function expCurveToByte(curve: UPRSettings["selectedEXPCurve"]): number {
  switch (curve) {
    case "MEDIUM_FAST": return 0;
    case "ERRATIC":     return 1;
    case "FLUCTUATING": return 2;
    case "MEDIUM_SLOW": return 3;
    case "FAST":        return 4;
    case "SLOW":        return 5;
  }
}

// ─── main encoder ────────────────────────────────────────────────────────────

/**
 * Encodes settings to a binary .rnqs Uint8Array that UPR's CLI can read with -s.
 */
export function encodeSettings(s: UPRSettings): Uint8Array {
  // Step 1: build the 51-byte binary payload + romName + checksum
  const body: number[] = [];

  // [0] general options
  body.push(bits(
    s.changeImpossibleEvolutions,
    s.updateMoves,
    s.updateMovesLegacy,
    s.randomizeTrainerNames,
    s.randomizeTrainerClassNames,
    s.makeEvolutionsEasier,
    s.removeTimeBasedEvolutions,
  ));

  // [1] base stats
  body.push(bits(
    s.baseStatsFollowEvolutions,
    s.baseStatisticsMod === "RANDOM",
    s.baseStatisticsMod === "SHUFFLE",
    s.baseStatisticsMod === "UNCHANGED",
    s.standardizeEXPCurves,
    s.updateBaseStats,
    s.baseStatsFollowMegaEvolutions,
    s.assignEvoStatsRandomly,
  ));

  // [2] types + general
  body.push(bits(
    s.typesMod === "RANDOM_FOLLOW_EVOLUTIONS",
    s.typesMod === "COMPLETELY_RANDOM",
    s.typesMod === "UNCHANGED",
    s.raceMode,
    s.blockBrokenMoves,
    s.limitPokemon,
    s.typesFollowMegaEvolutions,
    s.dualTypeOnly,
  ));

  // [3] abilities
  body.push(bits(
    s.abilitiesMod === "UNCHANGED",
    s.abilitiesMod === "RANDOMIZE",
    s.allowWonderGuard,
    s.abilitiesFollowEvolutions,
    s.banTrappingAbilities,
    s.banNegativeAbilities,
    s.banBadAbilities,
    s.abilitiesFollowMegaEvolutions,
  ));

  // [4] starters
  body.push(bits(
    s.startersMod === "CUSTOM",
    s.startersMod === "COMPLETELY_RANDOM",
    s.startersMod === "UNCHANGED",
    s.startersMod === "RANDOM_WITH_TWO_EVOLUTIONS",
    s.randomizeStartersHeldItems,
    s.banBadRandomStarterHeldItems,
    s.allowStarterAltFormes,
  ));

  // [5-10] custom starters (little-endian 2-byte each, value = index - 1)
  put2ByteLE(body, (s.customStarters[0] ?? 1) - 1);
  put2ByteLE(body, (s.customStarters[1] ?? 4) - 1);
  put2ByteLE(body, (s.customStarters[2] ?? 7) - 1);

  // [11] movesets
  const movesetsBase = bits(
    s.movesetsMod === "COMPLETELY_RANDOM",
    s.movesetsMod === "RANDOM_PREFER_SAME_TYPE",
    s.movesetsMod === "UNCHANGED",
    s.movesetsMod === "METRONOME_ONLY",
    s.startWithGuaranteedMoves,
    s.reorderDamagingMoves,
  );
  body.push((movesetsBase | (((s.guaranteedMoveCount - 2) & 0x3) << 6)) & 0xff);

  // [12] movesets good damaging
  body.push(((s.movesetsForceGoodDamaging ? 0x80 : 0) | (s.movesetsGoodDamagingPercent & 0x7f)) & 0xff);

  // [13] trainer pokemon
  body.push(bits(
    s.trainersMod === "UNCHANGED",
    s.trainersMod === "RANDOM",
    s.trainersMod === "DISTRIBUTED",
    s.trainersMod === "MAINPLAYTHROUGH",
    s.trainersMod === "TYPE_THEMED",
    s.trainersMod === "TYPE_THEMED_ELITE4_GYMS",
  ));

  // [14] trainer force fully evolved
  body.push(((s.trainersForceFullyEvolved ? 0x80 : 0) | (s.trainersForceFullyEvolvedLevel & 0x7f)) & 0xff);

  // [15] wild pokemon
  body.push(bits(
    s.wildPokemonRestrictionMod === "CATCH_EM_ALL",
    s.wildPokemonMod === "AREA_MAPPING",
    s.wildPokemonRestrictionMod === "NONE",
    s.wildPokemonRestrictionMod === "TYPE_THEME_AREAS",
    s.wildPokemonMod === "GLOBAL_MAPPING",
    s.wildPokemonMod === "RANDOM",
    s.wildPokemonMod === "UNCHANGED",
    s.useTimeBasedEncounters,
  ));

  // [16] wild pokemon 2
  body.push(bits(
    s.useMinimumCatchRate,
    s.blockWildLegendaries,
    s.wildPokemonRestrictionMod === "SIMILAR_STRENGTH",
    s.randomizeWildPokemonHeldItems,
    s.banBadRandomWildPokemonHeldItems,
    false,
    false,
    s.balanceShakingGrass,
  ));

  // [17] static pokemon
  body.push(bits(
    s.staticPokemonMod === "UNCHANGED",
    s.staticPokemonMod === "RANDOM_MATCHING",
    s.staticPokemonMod === "COMPLETELY_RANDOM",
    s.staticPokemonMod === "SIMILAR_STRENGTH",
    s.limitMainGameLegendaries,
    s.limit600,
    s.allowStaticAltFormes,
    s.swapStaticMegaEvos,
  ));

  // [18] TM randomization
  body.push(bits(
    s.tmsHmsCompatibilityMod === "COMPLETELY_RANDOM",
    s.tmsHmsCompatibilityMod === "RANDOM_PREFER_TYPE",
    s.tmsHmsCompatibilityMod === "UNCHANGED",
    s.tmsMod === "RANDOM",
    s.tmsMod === "UNCHANGED",
    s.tmLevelUpMoveSanity,
    s.keepFieldMoveTMs,
    s.tmsHmsCompatibilityMod === "FULL",
  ));

  // [19] TMs part 2
  body.push(bits(s.fullHMCompat, s.tmsFollowEvolutions, s.tutorFollowEvolutions));

  // [20] TMs good damaging
  body.push(((s.tmsForceGoodDamaging ? 0x80 : 0) | (s.tmsGoodDamagingPercent & 0x7f)) & 0xff);

  // [21] move tutors
  body.push(bits(
    s.moveTutorsCompatibilityMod === "COMPLETELY_RANDOM",
    s.moveTutorsCompatibilityMod === "RANDOM_PREFER_TYPE",
    s.moveTutorsCompatibilityMod === "UNCHANGED",
    s.moveTutorMovesMod === "RANDOM",
    s.moveTutorMovesMod === "UNCHANGED",
    s.tutorLevelUpMoveSanity,
    s.keepFieldMoveTutors,
    s.moveTutorsCompatibilityMod === "FULL",
  ));

  // [22] tutors good damaging
  body.push(((s.tutorsForceGoodDamaging ? 0x80 : 0) | (s.tutorsGoodDamagingPercent & 0x7f)) & 0xff);

  // [23] in-game trades
  body.push(bits(
    s.inGameTradesMod === "RANDOMIZE_GIVEN_AND_REQUESTED",
    s.inGameTradesMod === "RANDOMIZE_GIVEN",
    s.randomizeInGameTradesItems,
    s.randomizeInGameTradesIVs,
    s.randomizeInGameTradesNicknames,
    s.randomizeInGameTradesOTs,
    s.inGameTradesMod === "UNCHANGED",
  ));

  // [24] field items
  body.push(bits(
    s.fieldItemsMod === "RANDOM",
    s.fieldItemsMod === "SHUFFLE",
    s.fieldItemsMod === "UNCHANGED",
    s.banBadRandomFieldItems,
    s.fieldItemsMod === "RANDOM_EVEN",
  ));

  // [25] move randomizers + static music
  body.push(bits(
    s.randomizeMovePowers,
    s.randomizeMoveAccuracies,
    s.randomizeMovePPs,
    s.randomizeMoveTypes,
    s.randomizeMoveCategory,
    s.correctStaticMusic,
  ));

  // [26] evolutions
  body.push(bits(
    s.evolutionsMod === "UNCHANGED",
    s.evolutionsMod === "RANDOM",
    s.evosSimilarStrength,
    s.evosSameTyping,
    s.evosMaxThreeStages,
    s.evosForceChange,
    s.evosAllowAltFormes,
    s.evolutionsMod === "RANDOM_EVERY_LEVEL",
  ));

  // [27] trainer pokemon misc
  body.push(bits(
    s.trainersUsePokemonOfSimilarStrength,
    s.rivalCarriesStarterThroughout,
    s.trainersMatchTypingDistribution,
    s.trainersBlockLegendaries,
    s.trainersBlockEarlyWonderGuard,
    s.swapTrainerMegaEvos,
    s.shinyChance,
    s.betterTrainerMovesets,
  ));

  // [28-31] pokemon restrictions (big-endian int32)
  putInt32BE(body, s.currentRestrictions ?? 0);

  // [32-35] misc tweaks (big-endian int32)
  putInt32BE(body, s.currentMiscTweaks ?? 0);

  // [36] trainer level modifier
  body.push(((s.trainersLevelModified ? 0x80 : 0) | ((s.trainersLevelModifier + 50) & 0x7f)) & 0xff);

  // [37] shop items
  body.push(bits(
    s.shopItemsMod === "RANDOM",
    s.shopItemsMod === "SHUFFLE",
    s.shopItemsMod === "UNCHANGED",
    s.banBadRandomShopItems,
    s.banRegularShopItems,
    s.banOPShopItems,
    s.balanceShopPrices,
    s.guaranteeEvolutionItems,
  ));

  // [38] wild level modifier
  body.push(((s.wildLevelsModified ? 0x80 : 0) | ((s.wildLevelModifier + 50) & 0x7f)) & 0xff);

  // [39] EXP curve mod, block broken moves, alt forme stuff
  body.push(bits(
    s.expCurveMod === "LEGENDARIES",
    s.expCurveMod === "STRONG_LEGENDARIES",
    s.expCurveMod === "ALL",
    s.blockBrokenMovesetMoves,
    s.blockBrokenTMMoves,
    s.blockBrokenTutorMoves,
    s.allowTrainerAlternateFormes,
    s.allowWildAltFormes,
  ));

  // [40] double battle / additional trainer pokemon / weigh abilities
  body.push(
    (s.doubleBattleMode ? 0x1 : 0) |
    ((s.additionalBossTrainerPokemon & 0x7) << 1) |
    ((s.additionalImportantTrainerPokemon & 0x7) << 4) |
    (s.weighDuplicateAbilitiesTogether ? 0x80 : 0)
  );

  // [41] additional regular trainer / aura / evolution moves / guarantee X
  body.push(
    (s.additionalRegularTrainerPokemon & 0x7) |
    (s.auraMod === "UNCHANGED" ? 0x8 : 0) |
    (s.auraMod === "RANDOM" ? 0x10 : 0) |
    (s.auraMod === "SAME_STRENGTH" ? 0x20 : 0) |
    (s.evolutionMovesForAll ? 0x40 : 0) |
    (s.guaranteeXItems ? 0x80 : 0)
  );

  // [42] totem pokemon
  body.push(bits(
    s.totemPokemonMod === "UNCHANGED",
    s.totemPokemonMod === "RANDOM",
    s.totemPokemonMod === "SIMILAR_STRENGTH",
    s.allyPokemonMod === "UNCHANGED",
    s.allyPokemonMod === "RANDOM",
    s.allyPokemonMod === "SIMILAR_STRENGTH",
    s.randomizeTotemHeldItems,
    s.allowTotemAltFormes,
  ));

  // [43] totem level modifier
  body.push(((s.totemLevelsModified ? 0x80 : 0) | ((s.totemLevelModifier + 50) & 0x7f)) & 0xff);

  // [44] updateBaseStatsToGeneration
  body.push(s.updateBaseStatsToGeneration & 0xff);

  // [45] updateMovesToGeneration
  body.push(s.updateMovesToGeneration & 0xff);

  // [46] selectedEXPCurve
  body.push(expCurveToByte(s.selectedEXPCurve));

  // [47] static level modifier
  body.push(((s.staticLevelModified ? 0x80 : 0) | ((s.staticLevelModifier + 50) & 0x7f)) & 0xff);

  // [48] trainer held items / ensure two abilities
  body.push(bits(
    s.randomizeHeldItemsForBossTrainerPokemon,
    s.randomizeHeldItemsForImportantTrainerPokemon,
    s.randomizeHeldItemsForRegularTrainerPokemon,
    s.consumableItemsOnlyForTrainerPokemon,
    s.sensibleItemsOnlyForTrainerPokemon,
    s.highestLevelOnlyGetsItemsForTrainerPokemon,
    s.ensureTwoAbilities,
  ));

  // [49] pickup items
  body.push(bits(
    s.pickupItemsMod === "RANDOM",
    s.pickupItemsMod === "UNCHANGED",
    s.banBadRandomPickupItems,
    s.banIrregularAltFormes,
  ));

  // [50] elite four + min catch rate level
  body.push(
    (s.eliteFourUniquePokemonNumber & 0x7) |
    (((s.minimumCatchRateLevel - 1) & 0x7) << 3)
  );

  // romName (ASCII)
  const romNameBytes = encodeAscii(s.romName ?? "");
  body.push(romNameBytes.length);
  body.push(...romNameBytes);

  // CRC32 over body so far
  const bodyArray = new Uint8Array(body);
  const checksum = crc32(bodyArray);
  putInt32BE(body, checksum);

  // Custom names file checksum: 0 (no custom names)
  putInt32BE(body, 0);

  // Step 2: base64-encode the binary payload
  const finalBinary = new Uint8Array(body);
  const base64 = btoa(String.fromCharCode(...finalBinary));

  // Step 3: encode as UTF-8 bytes
  const settingsBytes = new TextEncoder().encode(base64);

  // Step 4: wrap in .rnqs header: [VERSION 4B BE] [length 4B BE] [settingsBytes]
  const totalLen = 8 + settingsBytes.length;
  const result = new Uint8Array(totalLen);
  const view = new DataView(result.buffer);
  view.setInt32(0, UPR_VERSION, false); // big-endian
  view.setInt32(4, settingsBytes.length, false);
  result.set(settingsBytes, 8);

  return result;
}

function encodeAscii(str: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < Math.min(str.length, 255); i++) {
    const code = str.charCodeAt(i);
    out.push(code < 128 ? code : 63); // replace non-ASCII with '?'
  }
  return out;
}

// ─── decode a settings string (base64) back into a partial UPRSettings ────────

function restoreState(b: number, index: number): boolean {
  return ((b >>> index) & 1) === 1;
}

export function decodeSettingsString(base64: string): Partial<UPRSettings> {
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const d = binary;

  // verify checksum
  const storedCrc = new DataView(d.buffer).getInt32(d.length - 8, false);
  const computed = crc32(d.slice(0, d.length - 8));
  if (storedCrc !== computed) {
    throw new Error("Settings string checksum mismatch — string may be corrupted or from a different version");
  }

  const s: Partial<UPRSettings> = {};

  // [0]
  s.changeImpossibleEvolutions = restoreState(d[0], 0);
  s.updateMoves = restoreState(d[0], 1);
  s.updateMovesLegacy = restoreState(d[0], 2);
  s.randomizeTrainerNames = restoreState(d[0], 3);
  s.randomizeTrainerClassNames = restoreState(d[0], 4);
  s.makeEvolutionsEasier = restoreState(d[0], 5);
  s.removeTimeBasedEvolutions = restoreState(d[0], 6);

  // [1]
  s.baseStatsFollowEvolutions = restoreState(d[1], 0);
  s.baseStatisticsMod = restoreState(d[1], 3) ? "UNCHANGED" : restoreState(d[1], 2) ? "SHUFFLE" : "RANDOM";
  s.standardizeEXPCurves = restoreState(d[1], 4);
  s.updateBaseStats = restoreState(d[1], 5);
  s.baseStatsFollowMegaEvolutions = restoreState(d[1], 6);
  s.assignEvoStatsRandomly = restoreState(d[1], 7);

  // [2]
  s.typesMod = restoreState(d[2], 2) ? "UNCHANGED" : restoreState(d[2], 0) ? "RANDOM_FOLLOW_EVOLUTIONS" : "COMPLETELY_RANDOM";
  s.raceMode = restoreState(d[2], 3);
  s.blockBrokenMoves = restoreState(d[2], 4);
  s.limitPokemon = restoreState(d[2], 5);
  s.typesFollowMegaEvolutions = restoreState(d[2], 6);
  s.dualTypeOnly = restoreState(d[2], 7);

  // [3]
  s.abilitiesMod = restoreState(d[3], 1) ? "RANDOMIZE" : "UNCHANGED";
  s.allowWonderGuard = restoreState(d[3], 2);
  s.abilitiesFollowEvolutions = restoreState(d[3], 3);
  s.banTrappingAbilities = restoreState(d[3], 4);
  s.banNegativeAbilities = restoreState(d[3], 5);
  s.banBadAbilities = restoreState(d[3], 6);
  s.abilitiesFollowMegaEvolutions = restoreState(d[3], 7);

  // [4]
  s.startersMod = restoreState(d[4], 2) ? "UNCHANGED"
    : restoreState(d[4], 0) ? "CUSTOM"
    : restoreState(d[4], 3) ? "RANDOM_WITH_TWO_EVOLUTIONS"
    : "COMPLETELY_RANDOM";
  s.randomizeStartersHeldItems = restoreState(d[4], 4);
  s.banBadRandomStarterHeldItems = restoreState(d[4], 5);
  s.allowStarterAltFormes = restoreState(d[4], 6);

  // [5-10] custom starters
  const s0 = (d[5] | (d[6] << 8)) + 1;
  const s1 = (d[7] | (d[8] << 8)) + 1;
  const s2 = (d[9] | (d[10] << 8)) + 1;
  s.customStarters = [s0, s1, s2];

  // [11-12]
  s.movesetsMod = restoreState(d[11], 2) ? "UNCHANGED"
    : restoreState(d[11], 0) ? "COMPLETELY_RANDOM"
    : restoreState(d[11], 3) ? "METRONOME_ONLY"
    : "RANDOM_PREFER_SAME_TYPE";
  s.startWithGuaranteedMoves = restoreState(d[11], 4);
  s.reorderDamagingMoves = restoreState(d[11], 5);
  s.guaranteedMoveCount = ((d[11] >> 6) & 0x3) + 2;
  s.movesetsForceGoodDamaging = restoreState(d[12], 7);
  s.movesetsGoodDamagingPercent = d[12] & 0x7f;

  // [13-14]
  s.trainersMod = restoreState(d[13], 0) ? "UNCHANGED"
    : restoreState(d[13], 1) ? "RANDOM"
    : restoreState(d[13], 2) ? "DISTRIBUTED"
    : restoreState(d[13], 3) ? "MAINPLAYTHROUGH"
    : restoreState(d[13], 4) ? "TYPE_THEMED"
    : "TYPE_THEMED_ELITE4_GYMS";
  s.trainersForceFullyEvolved = restoreState(d[14], 7);
  s.trainersForceFullyEvolvedLevel = d[14] & 0x7f;

  // [15-16]
  s.wildPokemonMod = restoreState(d[15], 6) ? "UNCHANGED"
    : restoreState(d[15], 5) ? "RANDOM"
    : restoreState(d[15], 1) ? "AREA_MAPPING"
    : "GLOBAL_MAPPING";
  s.wildPokemonRestrictionMod = restoreState(d[15], 2) ? "NONE"
    : restoreState(d[15], 0) ? "CATCH_EM_ALL"
    : restoreState(d[15], 3) ? "TYPE_THEME_AREAS"
    : restoreState(d[16], 2) ? "SIMILAR_STRENGTH"
    : "NONE";
  s.useTimeBasedEncounters = restoreState(d[15], 7);
  s.useMinimumCatchRate = restoreState(d[16], 0);
  s.blockWildLegendaries = restoreState(d[16], 1);
  s.randomizeWildPokemonHeldItems = restoreState(d[16], 3);
  s.banBadRandomWildPokemonHeldItems = restoreState(d[16], 4);
  s.balanceShakingGrass = restoreState(d[16], 7);

  // [17]
  s.staticPokemonMod = restoreState(d[17], 0) ? "UNCHANGED"
    : restoreState(d[17], 1) ? "RANDOM_MATCHING"
    : restoreState(d[17], 2) ? "COMPLETELY_RANDOM"
    : "SIMILAR_STRENGTH";
  s.limitMainGameLegendaries = restoreState(d[17], 4);
  s.limit600 = restoreState(d[17], 5);
  s.allowStaticAltFormes = restoreState(d[17], 6);
  s.swapStaticMegaEvos = restoreState(d[17], 7);

  // [18-20]
  s.tmsHmsCompatibilityMod = restoreState(d[18], 2) ? "UNCHANGED"
    : restoreState(d[18], 0) ? "COMPLETELY_RANDOM"
    : restoreState(d[18], 7) ? "FULL"
    : "RANDOM_PREFER_TYPE";
  s.tmsMod = restoreState(d[18], 4) ? "UNCHANGED" : "RANDOM";
  s.tmLevelUpMoveSanity = restoreState(d[18], 5);
  s.keepFieldMoveTMs = restoreState(d[18], 6);
  s.fullHMCompat = restoreState(d[19], 0);
  s.tmsFollowEvolutions = restoreState(d[19], 1);
  s.tutorFollowEvolutions = restoreState(d[19], 2);
  s.tmsForceGoodDamaging = restoreState(d[20], 7);
  s.tmsGoodDamagingPercent = d[20] & 0x7f;

  // [21-22]
  s.moveTutorsCompatibilityMod = restoreState(d[21], 2) ? "UNCHANGED"
    : restoreState(d[21], 0) ? "COMPLETELY_RANDOM"
    : restoreState(d[21], 7) ? "FULL"
    : "RANDOM_PREFER_TYPE";
  s.moveTutorMovesMod = restoreState(d[21], 4) ? "UNCHANGED" : "RANDOM";
  s.tutorLevelUpMoveSanity = restoreState(d[21], 5);
  s.keepFieldMoveTutors = restoreState(d[21], 6);
  s.tutorsForceGoodDamaging = restoreState(d[22], 7);
  s.tutorsGoodDamagingPercent = d[22] & 0x7f;

  // [23]
  s.inGameTradesMod = restoreState(d[23], 6) ? "UNCHANGED"
    : restoreState(d[23], 0) ? "RANDOMIZE_GIVEN_AND_REQUESTED"
    : "RANDOMIZE_GIVEN";
  s.randomizeInGameTradesItems = restoreState(d[23], 2);
  s.randomizeInGameTradesIVs = restoreState(d[23], 3);
  s.randomizeInGameTradesNicknames = restoreState(d[23], 4);
  s.randomizeInGameTradesOTs = restoreState(d[23], 5);

  // [24]
  s.fieldItemsMod = restoreState(d[24], 2) ? "UNCHANGED"
    : restoreState(d[24], 0) ? "RANDOM"
    : restoreState(d[24], 4) ? "RANDOM_EVEN"
    : "SHUFFLE";
  s.banBadRandomFieldItems = restoreState(d[24], 3);

  // [25]
  s.randomizeMovePowers = restoreState(d[25], 0);
  s.randomizeMoveAccuracies = restoreState(d[25], 1);
  s.randomizeMovePPs = restoreState(d[25], 2);
  s.randomizeMoveTypes = restoreState(d[25], 3);
  s.randomizeMoveCategory = restoreState(d[25], 4);
  s.correctStaticMusic = restoreState(d[25], 5);

  // [26]
  s.evolutionsMod = restoreState(d[26], 0) ? "UNCHANGED"
    : restoreState(d[26], 7) ? "RANDOM_EVERY_LEVEL"
    : "RANDOM";
  s.evosSimilarStrength = restoreState(d[26], 2);
  s.evosSameTyping = restoreState(d[26], 3);
  s.evosMaxThreeStages = restoreState(d[26], 4);
  s.evosForceChange = restoreState(d[26], 5);
  s.evosAllowAltFormes = restoreState(d[26], 6);

  // [27]
  s.trainersUsePokemonOfSimilarStrength = restoreState(d[27], 0);
  s.rivalCarriesStarterThroughout = restoreState(d[27], 1);
  s.trainersMatchTypingDistribution = restoreState(d[27], 2);
  s.trainersBlockLegendaries = restoreState(d[27], 3);
  s.trainersBlockEarlyWonderGuard = restoreState(d[27], 4);
  s.swapTrainerMegaEvos = restoreState(d[27], 5);
  s.shinyChance = restoreState(d[27], 6);
  s.betterTrainerMovesets = restoreState(d[27], 7);

  // [28-35]
  const dv = new DataView(d.buffer, d.byteOffset);
  s.currentRestrictions = dv.getInt32(28, false);
  s.currentMiscTweaks = dv.getInt32(32, false);

  // [36]
  s.trainersLevelModified = restoreState(d[36], 7);
  s.trainersLevelModifier = (d[36] & 0x7f) - 50;

  // [37]
  s.shopItemsMod = restoreState(d[37], 2) ? "UNCHANGED" : restoreState(d[37], 0) ? "RANDOM" : "SHUFFLE";
  s.banBadRandomShopItems = restoreState(d[37], 3);
  s.banRegularShopItems = restoreState(d[37], 4);
  s.banOPShopItems = restoreState(d[37], 5);
  s.balanceShopPrices = restoreState(d[37], 6);
  s.guaranteeEvolutionItems = restoreState(d[37], 7);

  // [38]
  s.wildLevelsModified = restoreState(d[38], 7);
  s.wildLevelModifier = (d[38] & 0x7f) - 50;

  // [39]
  s.expCurveMod = restoreState(d[39], 0) ? "LEGENDARIES"
    : restoreState(d[39], 1) ? "STRONG_LEGENDARIES"
    : "ALL";
  s.blockBrokenMovesetMoves = restoreState(d[39], 3);
  s.blockBrokenTMMoves = restoreState(d[39], 4);
  s.blockBrokenTutorMoves = restoreState(d[39], 5);
  s.allowTrainerAlternateFormes = restoreState(d[39], 6);
  s.allowWildAltFormes = restoreState(d[39], 7);

  // [40]
  s.doubleBattleMode = restoreState(d[40], 0);
  s.additionalBossTrainerPokemon = (d[40] >> 1) & 0x7;
  s.additionalImportantTrainerPokemon = (d[40] >> 4) & 0x7;
  s.weighDuplicateAbilitiesTogether = restoreState(d[40], 7);

  // [41]
  s.additionalRegularTrainerPokemon = d[41] & 0x7;
  s.auraMod = restoreState(d[41], 3) ? "UNCHANGED" : restoreState(d[41], 4) ? "RANDOM" : "SAME_STRENGTH";
  s.evolutionMovesForAll = restoreState(d[41], 6);
  s.guaranteeXItems = restoreState(d[41], 7);

  // [42]
  s.totemPokemonMod = restoreState(d[42], 0) ? "UNCHANGED" : restoreState(d[42], 1) ? "RANDOM" : "SIMILAR_STRENGTH";
  s.allyPokemonMod = restoreState(d[42], 3) ? "UNCHANGED" : restoreState(d[42], 4) ? "RANDOM" : "SIMILAR_STRENGTH";
  s.randomizeTotemHeldItems = restoreState(d[42], 6);
  s.allowTotemAltFormes = restoreState(d[42], 7);

  // [43]
  s.totemLevelsModified = restoreState(d[43], 7);
  s.totemLevelModifier = (d[43] & 0x7f) - 50;

  // [44-46]
  s.updateBaseStatsToGeneration = d[44];
  s.updateMovesToGeneration = d[45];
  const expCurveByte = d[46];
  s.selectedEXPCurve = expCurveByte === 1 ? "ERRATIC"
    : expCurveByte === 2 ? "FLUCTUATING"
    : expCurveByte === 3 ? "MEDIUM_SLOW"
    : expCurveByte === 4 ? "FAST"
    : expCurveByte === 5 ? "SLOW"
    : "MEDIUM_FAST";

  // [47]
  s.staticLevelModified = restoreState(d[47], 7);
  s.staticLevelModifier = (d[47] & 0x7f) - 50;

  // [48]
  s.randomizeHeldItemsForBossTrainerPokemon = restoreState(d[48], 0);
  s.randomizeHeldItemsForImportantTrainerPokemon = restoreState(d[48], 1);
  s.randomizeHeldItemsForRegularTrainerPokemon = restoreState(d[48], 2);
  s.consumableItemsOnlyForTrainerPokemon = restoreState(d[48], 3);
  s.sensibleItemsOnlyForTrainerPokemon = restoreState(d[48], 4);
  s.highestLevelOnlyGetsItemsForTrainerPokemon = restoreState(d[48], 5);
  s.ensureTwoAbilities = restoreState(d[48], 6);

  // [49]
  s.pickupItemsMod = restoreState(d[49], 1) ? "UNCHANGED" : "RANDOM";
  s.banBadRandomPickupItems = restoreState(d[49], 2);
  s.banIrregularAltFormes = restoreState(d[49], 3);

  // [50]
  s.eliteFourUniquePokemonNumber = d[50] & 0x7;
  s.minimumCatchRateLevel = ((d[50] >> 3) & 0x7) + 1;

  // romName
  let offset = 51;
  const nameLen = d[offset++];
  const nameBytes = d.slice(offset, offset + nameLen);
  s.romName = new TextDecoder("ascii").decode(nameBytes);

  return s;
}

/**
 * Parses a .rnqs file buffer and returns the embedded settings string (base64)
 */
export function parseRnqsFile(buffer: ArrayBuffer): string {
  const view = new DataView(buffer);
  // const version = view.getInt32(0, false); // big-endian
  const length = view.getInt32(4, false);
  const bytes = new Uint8Array(buffer, 8, length);
  return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Encodes settings to a base64 settings string (for display / import-export)
 */
export function settingsToString(s: UPRSettings): string {
  const rnqs = encodeSettings(s);
  const view = new DataView(rnqs.buffer);
  const length = view.getInt32(4, false);
  const settingsBytes = new Uint8Array(rnqs.buffer, 8, length);
  return new TextDecoder("utf-8").decode(settingsBytes);
}

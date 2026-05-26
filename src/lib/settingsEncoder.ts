// Encodes UPRSettings → binary .rnqs file (Uint8Array)
// Mirrors com.uprfvx.random.Settings.toStringWithoutVersion()
// VERSION 422 (UPR-FVX 1.5.1)

import { POKEMON_TYPE_INDEX, type PokemonType, type UPRSettings } from "@/types/settings";

const UPR_VERSION = 422; // Version.LATEST.id
const LENGTH_OF_SETTINGS_DATA = 67;

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
  return (crc ^ 0xffffffff) | 0;
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

function putInt32LE(arr: number[], v: number) {
  arr.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
}

function put2ByteLE(arr: number[], v: number) {
  // FVX's write2ByteIntBigEndian() is misnamed: implementation is little-endian.
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

// Trainer/wild/static/totem/evolution level modifiers in FVX are stored as
// signed int8 in the range [-128, 127] with a shift of -28 from the source
// range [-100, 155]. Java `out.write(int)` keeps the low 8 bits, so we mask.
function signedInt8Shift(modifier: number): number {
  return (modifier - 28) & 0xff;
}

// ─── main encoder ────────────────────────────────────────────────────────────

/**
 * Encodes settings to a binary .rnqs Uint8Array that UPR-FVX's CLI can read with -s.
 */
export function encodeSettings(s: UPRSettings): Uint8Array {
  const body: number[] = [];

  // 0: general options #1 + estimateLevelForEvolutionImprovements (bit 7)
  body.push(bits(
    s.changeImpossibleEvolutions,
    s.updateMoves,
    s.updateMovesLegacy,
    s.randomizeTrainerNames,
    s.randomizeTrainerClassNames,
    s.makeEvolutionsEasier,
    s.removeTimeBasedEvolutions,
    s.estimateLevelForEvolutionImprovements,
  ));

  // 1: base stats
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

  // 2: species types (FVX dropped raceMode/blockBrokenMoves/limitPokemon here;
  //                   those moved to byte 65)
  body.push(bits(
    s.speciesTypesMod === "RANDOM_FOLLOW_EVOLUTIONS",
    s.speciesTypesMod === "COMPLETELY_RANDOM",
    s.speciesTypesMod === "UNCHANGED",
    false,
    false,
    false,
    s.typesFollowMegaEvolutions,
    s.dualTypeOnly,
  ));

  // 3: abilities
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

  // 4: starters (bit 7 = RANDOM_BASIC, new in FVX)
  body.push(bits(
    s.startersMod === "CUSTOM",
    s.startersMod === "COMPLETELY_RANDOM",
    s.startersMod === "UNCHANGED",
    s.startersMod === "RANDOM_WITH_TWO_EVOLUTIONS",
    s.randomizeStartersHeldItems,
    s.banBadRandomStarterHeldItems,
    s.allowStarterAltFormes,
    s.startersMod === "RANDOM_BASIC",
  ));

  // 5-10: custom starters (LE, 1-based species index — FVX writes raw value)
  put2ByteLE(body, s.customStarters[0] ?? 1);
  put2ByteLE(body, s.customStarters[1] ?? 4);
  put2ByteLE(body, s.customStarters[2] ?? 7);

  // 11: movesets
  const movesetsBase = bits(
    s.movesetsMod === "COMPLETELY_RANDOM",
    s.movesetsMod === "RANDOM_PREFER_SAME_TYPE",
    s.movesetsMod === "UNCHANGED",
    s.movesetsMod === "METRONOME_ONLY",
    s.startWithGuaranteedMoves,
    s.reorderDamagingMoves,
  );
  body.push((movesetsBase | (((s.guaranteedMoveCount - 2) & 0x3) << 6)) & 0xff);

  // 12: movesets good damaging
  body.push(((s.movesetsForceGoodDamaging ? 0x80 : 0) | (s.movesetsGoodDamagingPercent & 0x7f)) & 0xff);

  // 13: trainers (8 enum values: 6 ZX + 2 FVX new)
  body.push(bits(
    s.trainersMod === "UNCHANGED",
    s.trainersMod === "RANDOM",
    s.trainersMod === "DISTRIBUTED",
    s.trainersMod === "MAINPLAYTHROUGH",
    s.trainersMod === "TYPE_THEMED",
    s.trainersMod === "TYPE_THEMED_ELITE4_GYMS",
    s.trainersMod === "KEEP_THEMED",
    s.trainersMod === "KEEP_THEME_OR_PRIMARY",
  ));

  // 14: trainer evolution level modifier (NEW in FVX)
  body.push(signedInt8Shift(s.trainersEvolutionLevelModifier));

  // 15: wild pokemon (areas) — FVX restructure
  body.push(bits(
    !s.randomizeWildPokemon,                              // bit 0 (inverted)
    s.wildPokemonZoneMod === "NONE",                      // bit 1
    s.wildPokemonZoneMod === "ENCOUNTER_SET",             // bit 2
    s.wildPokemonZoneMod === "GAME",                      // bit 3
    s.keepWildEvolutionFamilies,                          // bit 4
    s.wildPokemonZoneMod === "NAMED_LOCATION",            // bit 5
    s.wildPokemonZoneMod === "MAP",                       // bit 6
    s.splitWildZoneByEncounterTypes,                      // bit 7
  ));

  // 16: wild pokemon (restriction)
  body.push(bits(
    false,                                                 // bit 0
    s.similarStrengthEncounters,                           // bit 1
    s.catchEmAllEncounters,                                // bit 2
  ));

  // 17: wild pokemon (types/evolutions) — NEW in FVX
  body.push(bits(
    s.wildPokemonTypeMod === "NONE",                       // bit 0
    s.wildPokemonTypeMod === "KEEP_PRIMARY",               // bit 1
    s.wildPokemonTypeMod === "RANDOM_THEMES",              // bit 2
    s.keepWildTypeThemes,                                  // bit 3
    s.wildPokemonEvolutionMod === "NONE",                  // bit 4
    s.wildPokemonEvolutionMod === "BASIC_ONLY",            // bit 5
    s.wildPokemonEvolutionMod === "KEEP_STAGE",            // bit 6
  ));

  // 18: wild pokemon (various)
  body.push(bits(
    s.useTimeBasedEncounters,
    s.useMinimumCatchRate,
    s.blockWildLegendaries,
    s.randomizeWildPokemonHeldItems,
    s.banBadRandomWildPokemonHeldItems,
    s.balanceShakingGrass,
  ));

  // 19: static pokemon
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

  // 20: TM randomization
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

  // 21: TMs part 2
  body.push(bits(s.fullHMCompat, s.tmsFollowEvolutions, s.tutorFollowEvolutions));

  // 22: TMs good damaging
  body.push(((s.tmsForceGoodDamaging ? 0x80 : 0) | (s.tmsGoodDamagingPercent & 0x7f)) & 0xff);

  // 23: move tutors
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

  // 24: tutors good damaging
  body.push(((s.tutorsForceGoodDamaging ? 0x80 : 0) | (s.tutorsGoodDamagingPercent & 0x7f)) & 0xff);

  // 25: in-game trades
  body.push(bits(
    s.inGameTradesMod === "RANDOMIZE_GIVEN_AND_REQUESTED",
    s.inGameTradesMod === "RANDOMIZE_GIVEN",
    s.randomizeInGameTradesItems,
    s.randomizeInGameTradesIVs,
    s.randomizeInGameTradesNicknames,
    s.randomizeInGameTradesOTs,
    s.inGameTradesMod === "UNCHANGED",
  ));

  // 26: field items
  body.push(bits(
    s.fieldItemsMod === "RANDOM",
    s.fieldItemsMod === "SHUFFLE",
    s.fieldItemsMod === "UNCHANGED",
    s.banBadRandomFieldItems,
    s.fieldItemsMod === "RANDOM_EVEN",
  ));

  // 27: move randomizers + static music + randomizeMoveNames (bit 6, NEW in FVX)
  body.push(bits(
    s.randomizeMovePowers,
    s.randomizeMoveAccuracies,
    s.randomizeMovePPs,
    s.randomizeMoveTypes,
    s.randomizeMoveCategory,
    s.correctStaticMusic,
    s.randomizeMoveNames,
  ));

  // 28: evolutions 1
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

  // 29: trainer misc (bit 7 = trainersAvoidDuplicates, NEW in FVX)
  body.push(bits(
    s.trainersUsePokemonOfSimilarStrength,
    s.rivalCarriesStarterThroughout,
    s.trainersMatchTypingDistribution,
    s.trainersBlockLegendaries,
    s.trainersBlockEarlyWonderGuard,
    s.swapTrainerMegaEvos,
    s.shinyChance,
    s.trainersAvoidDuplicates,
  ));

  // 30-33: pokemon restrictions (FVX uses LITTLE-endian int32)
  putInt32LE(body, s.currentRestrictions ?? 0);

  // 34-37: misc tweaks (big-endian int32)
  putInt32BE(body, s.currentMiscTweaks ?? 0);

  // 38: trainer level modifier (signed int8 - 28)
  body.push(signedInt8Shift(s.trainersLevelModifier));

  // 39: shop items 1 (FVX moved balanceShopPrices to byte 64; bit 6 unused)
  body.push(bits(
    s.shopItemsMod === "RANDOM",
    s.shopItemsMod === "SHUFFLE",
    s.shopItemsMod === "UNCHANGED",
    s.banBadRandomShopItems,
    s.banRegularShopItems,
    s.banOPShopItems,
    false,
    s.guaranteeEvolutionItems,
  ));

  // 40: wild level modifier
  body.push(signedInt8Shift(s.wildLevelModifier));

  // 41: EXP curve mod, block broken moves, alt forme stuff
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

  // 42: legacy double battle (always 0), additional boss/important, weigh dup abilities
  body.push(
    0 |
    ((s.additionalBossTrainerPokemon & 0x7) << 1) |
    ((s.additionalImportantTrainerPokemon & 0x7) << 4) |
    (s.weighDuplicateAbilitiesTogether ? 0x80 : 0)
  );

  // 43: additional regular trainer + aura + evo moves + guarantee X items
  body.push(
    (s.additionalRegularTrainerPokemon & 0x7) |
    (s.auraMod === "UNCHANGED" ? 0x8 : 0) |
    (s.auraMod === "RANDOM" ? 0x10 : 0) |
    (s.auraMod === "SAME_STRENGTH" ? 0x20 : 0) |
    (s.evolutionMovesForAll ? 0x40 : 0) |
    (s.guaranteeXItems ? 0x80 : 0)
  );

  // 44: totem
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

  // 45: totem level modifier (signed int8 - 28)
  body.push(signedInt8Shift(s.totemLevelModifier));

  // 46: updateBaseStatsToGeneration
  body.push(s.updateBaseStatsToGeneration & 0xff);

  // 47: updateMovesToGeneration
  body.push(s.updateMovesToGeneration & 0xff);

  // 48: selectedEXPCurve
  body.push(expCurveToByte(s.selectedEXPCurve));

  // 49: static level modifier (signed int8 - 28)
  body.push(signedInt8Shift(s.staticLevelModifier));

  // 50: trainer held items + ensureTwoAbilities + trainersUseLocalPokemon (NEW bit 7)
  body.push(bits(
    s.randomizeHeldItemsForBossTrainerPokemon,
    s.randomizeHeldItemsForImportantTrainerPokemon,
    s.randomizeHeldItemsForRegularTrainerPokemon,
    s.consumableItemsOnlyForTrainerPokemon,
    s.sensibleItemsOnlyForTrainerPokemon,
    s.highestLevelOnlyGetsItemsForTrainerPokemon,
    s.ensureTwoAbilities,
    s.trainersUseLocalPokemon,
  ));

  // 51: pickup items
  body.push(bits(
    s.pickupItemsMod === "RANDOM",
    s.pickupItemsMod === "UNCHANGED",
    s.banBadRandomPickupItems,
    s.banIrregularAltFormes,
  ));

  // 52: elite four + min catch rate level
  body.push(
    (s.eliteFourUniquePokemonNumber & 0x7) |
    (((s.minimumCatchRateLevel - 1) & 0x7) << 3)
  );

  // 53: starter type mod + no legendaries + no dual types (NEW in FVX)
  body.push(bits(
    s.startersTypeMod === "NONE",
    s.startersTypeMod === "FIRE_WATER_GRASS",
    s.startersTypeMod === "TRIANGLE",
    s.startersTypeMod === "UNIQUE",
    s.startersTypeMod === "SINGLE_TYPE",
    false,
    s.startersNoLegendaries,
    s.startersNoDualTypes,
  ));

  // 54: starter single-type choice (Type.toInt() + 1, or 0 if null)
  body.push(typeToByte(s.startersSingleType));

  // 55: pokemon palettes (NEW in FVX)
  body.push(bits(
    s.pokemonPalettesMod === "UNCHANGED",
    s.pokemonPalettesMod === "RANDOM",
    s.pokemonPalettesFollowTypes,
    s.pokemonPalettesFollowEvolutions,
    s.pokemonPalettesShinyFromNormal,
  ));

  // 56: type effectiveness (NEW in FVX)
  body.push(bits(
    s.typeEffectivenessMod === "UNCHANGED",
    s.typeEffectivenessMod === "RANDOM",
    s.typeEffectivenessMod === "RANDOM_BALANCED",
    s.typeEffectivenessMod === "KEEP_IDENTITIES",
    s.typeEffectivenessMod === "INVERSE",
    s.inverseTypesRandomImmunities,
    s.updateTypeEffectiveness,
  ));

  // 57: evolutions 2 (evosForceGrowth, evosNoConvergence — NEW in FVX)
  body.push(bits(s.evosForceGrowth, s.evosNoConvergence));

  // 58-60: starter BST limits (12-bit packed)
  // highEndByte = ((min >> 8) & 0x0F) | ((max >> 4) & 0xF0)
  const min = s.startersBSTMinimum | 0;
  const max = s.startersBSTMaximum | 0;
  const highEndByte = (((min >> 8) & 0x0f) | ((max >> 4) & 0xf0)) & 0xff;
  body.push(highEndByte);
  body.push(min & 0xff);
  body.push(max & 0xff);

  // 61: trainer type diversity + better movesets (NEW in FVX)
  body.push(bits(
    s.diverseTypesForBossTrainers,
    s.diverseTypesForImportantTrainers,
    s.diverseTypesForRegularTrainers,
    s.betterBossTrainerMovesets,
    s.betterImportantTrainerMovesets,
    s.betterRegularTrainerMovesets,
  ));

  // 62: battle style (NEW in FVX)
  // modification bits 0-2 + style bits 3-6
  const modBits = bits(
    s.battleStyleModification === "UNCHANGED",
    s.battleStyleModification === "RANDOM",
    s.battleStyleModification === "SINGLE_STYLE",
  );
  const styleBits = bits(
    s.battleStyleType === "SINGLE_BATTLE",
    s.battleStyleType === "DOUBLE_BATTLE",
    s.battleStyleType === "TRIPLE_BATTLE",
    s.battleStyleType === "ROTATION_BATTLE",
  );
  body.push((modBits | (styleBits << 3)) & 0xff);

  // 63: trainer evolve + ban premature + level-modified flags (NEW in FVX)
  body.push(bits(
    s.trainersEvolveTheirPokemon,
    s.banPrematureEvos,
    s.trainersLevelModified,
    s.wildLevelsModified,
    s.totemLevelsModified,
    s.staticLevelModified,
  ));

  // 64: shop items 2 (balanceShopPrices, addCheapRareCandiesToShops — NEW in FVX)
  body.push(bits(s.balanceShopPrices, s.addCheapRareCandiesToShops));

  // 65: general options #2 (randomizeIntroMon, raceMode, limitPokemon)
  body.push(bits(s.randomizeIntroMon, s.raceMode, false, s.limitPokemon));

  // 66: makeEvolutionsEasierLvl (slider)
  body.push(s.makeEvolutionsEasierLvl & 0xff);

  if (body.length !== LENGTH_OF_SETTINGS_DATA) {
    throw new Error(
      `Settings payload is ${body.length} bytes, expected ${LENGTH_OF_SETTINGS_DATA}`,
    );
  }

  // romName (ASCII)
  const romNameBytes = encodeAscii(s.romName ?? "");
  body.push(romNameBytes.length);
  body.push(...romNameBytes);

  // CRC32 over body so far
  const checksum = crc32(new Uint8Array(body));
  putInt32BE(body, checksum);

  // Custom names file checksum: 0 (no custom names)
  putInt32BE(body, 0);

  const finalBinary = new Uint8Array(body);
  const base64 = btoa(String.fromCharCode(...finalBinary));
  const settingsBytes = new TextEncoder().encode(base64);

  // .rnqs wrapper: [VERSION 4B BE] [length 4B BE] [settingsBytes]
  const totalLen = 8 + settingsBytes.length;
  const result = new Uint8Array(totalLen);
  const view = new DataView(result.buffer);
  view.setInt32(0, UPR_VERSION, false);
  view.setInt32(4, settingsBytes.length, false);
  result.set(settingsBytes, 8);

  return result;
}

function typeToByte(type: PokemonType | null): number {
  if (type === null || type === undefined) return 0;
  return (POKEMON_TYPE_INDEX[type] + 1) & 0xff;
}

function byteToType(byte: number): PokemonType | null {
  if (byte === 0) return null;
  const idx = byte - 1;
  for (const [name, ordinal] of Object.entries(POKEMON_TYPE_INDEX)) {
    if (ordinal === idx) return name as PokemonType;
  }
  return null;
}

function encodeAscii(str: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < Math.min(str.length, 255); i++) {
    const code = str.charCodeAt(i);
    out.push(code < 128 ? code : 63);
  }
  return out;
}

// ─── decode a settings string (base64) back into a partial UPRSettings ────────

function restoreState(b: number, index: number): boolean {
  return ((b >>> index) & 1) === 1;
}

function readInt32LE(d: Uint8Array, o: number): number {
  return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) | 0;
}

function signedInt8Restore(byte: number): number {
  // byte was written as ((modifier - 28) & 0xff). Treat byte as signed int8,
  // then add 28 to recover the modifier.
  const signed = byte > 127 ? byte - 256 : byte;
  return signed + 28;
}

export function decodeSettingsString(base64: string): Partial<UPRSettings> {
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const d = binary;

  // verify checksum (last 8 bytes are: settings CRC32 + custom names CRC32)
  const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
  const storedCrc = dv.getInt32(d.length - 8, false);
  const computed = crc32(d.slice(0, d.length - 8));
  if (storedCrc !== computed) {
    throw new Error(
      "Settings string checksum mismatch — string may be corrupted or not a UPR-FVX 1.5.1 settings string",
    );
  }

  const s: Partial<UPRSettings> = {};

  // 0
  s.changeImpossibleEvolutions = restoreState(d[0], 0);
  s.updateMoves = restoreState(d[0], 1);
  s.updateMovesLegacy = restoreState(d[0], 2);
  s.randomizeTrainerNames = restoreState(d[0], 3);
  s.randomizeTrainerClassNames = restoreState(d[0], 4);
  s.makeEvolutionsEasier = restoreState(d[0], 5);
  s.removeTimeBasedEvolutions = restoreState(d[0], 6);
  s.estimateLevelForEvolutionImprovements = restoreState(d[0], 7);

  // 1
  s.baseStatsFollowEvolutions = restoreState(d[1], 0);
  s.baseStatisticsMod = restoreState(d[1], 3) ? "UNCHANGED" : restoreState(d[1], 2) ? "SHUFFLE" : "RANDOM";
  s.standardizeEXPCurves = restoreState(d[1], 4);
  s.updateBaseStats = restoreState(d[1], 5);
  s.baseStatsFollowMegaEvolutions = restoreState(d[1], 6);
  s.assignEvoStatsRandomly = restoreState(d[1], 7);

  // 2 (species types only; race/blockBroken/limit moved to byte 65)
  s.speciesTypesMod = restoreState(d[2], 2) ? "UNCHANGED"
    : restoreState(d[2], 0) ? "RANDOM_FOLLOW_EVOLUTIONS"
    : "COMPLETELY_RANDOM";
  s.typesFollowMegaEvolutions = restoreState(d[2], 6);
  s.dualTypeOnly = restoreState(d[2], 7);

  // 3
  s.abilitiesMod = restoreState(d[3], 1) ? "RANDOMIZE" : "UNCHANGED";
  s.allowWonderGuard = restoreState(d[3], 2);
  s.abilitiesFollowEvolutions = restoreState(d[3], 3);
  s.banTrappingAbilities = restoreState(d[3], 4);
  s.banNegativeAbilities = restoreState(d[3], 5);
  s.banBadAbilities = restoreState(d[3], 6);
  s.abilitiesFollowMegaEvolutions = restoreState(d[3], 7);

  // 4
  s.startersMod = restoreState(d[4], 2) ? "UNCHANGED"
    : restoreState(d[4], 0) ? "CUSTOM"
    : restoreState(d[4], 3) ? "RANDOM_WITH_TWO_EVOLUTIONS"
    : restoreState(d[4], 7) ? "RANDOM_BASIC"
    : "COMPLETELY_RANDOM";
  s.randomizeStartersHeldItems = restoreState(d[4], 4);
  s.banBadRandomStarterHeldItems = restoreState(d[4], 5);
  s.allowStarterAltFormes = restoreState(d[4], 6);

  // 5-10 custom starters (LE, no -1 in FVX)
  s.customStarters = [
    d[5] | (d[6] << 8),
    d[7] | (d[8] << 8),
    d[9] | (d[10] << 8),
  ];

  // 11-12
  s.movesetsMod = restoreState(d[11], 2) ? "UNCHANGED"
    : restoreState(d[11], 0) ? "COMPLETELY_RANDOM"
    : restoreState(d[11], 3) ? "METRONOME_ONLY"
    : "RANDOM_PREFER_SAME_TYPE";
  s.startWithGuaranteedMoves = restoreState(d[11], 4);
  s.reorderDamagingMoves = restoreState(d[11], 5);
  s.guaranteedMoveCount = ((d[11] >> 6) & 0x3) + 2;
  s.movesetsForceGoodDamaging = restoreState(d[12], 7);
  s.movesetsGoodDamagingPercent = d[12] & 0x7f;

  // 13
  s.trainersMod = restoreState(d[13], 0) ? "UNCHANGED"
    : restoreState(d[13], 1) ? "RANDOM"
    : restoreState(d[13], 2) ? "DISTRIBUTED"
    : restoreState(d[13], 3) ? "MAINPLAYTHROUGH"
    : restoreState(d[13], 4) ? "TYPE_THEMED"
    : restoreState(d[13], 5) ? "TYPE_THEMED_ELITE4_GYMS"
    : restoreState(d[13], 6) ? "KEEP_THEMED"
    : "KEEP_THEME_OR_PRIMARY";

  // 14
  s.trainersEvolutionLevelModifier = signedInt8Restore(d[14]);

  // 15
  s.randomizeWildPokemon = !restoreState(d[15], 0);
  s.wildPokemonZoneMod = restoreState(d[15], 1) ? "NONE"
    : restoreState(d[15], 2) ? "ENCOUNTER_SET"
    : restoreState(d[15], 3) ? "GAME"
    : restoreState(d[15], 5) ? "NAMED_LOCATION"
    : restoreState(d[15], 6) ? "MAP"
    : "GAME";
  s.keepWildEvolutionFamilies = restoreState(d[15], 4);
  s.splitWildZoneByEncounterTypes = restoreState(d[15], 7);

  // 16
  s.similarStrengthEncounters = restoreState(d[16], 1);
  s.catchEmAllEncounters = restoreState(d[16], 2);

  // 17
  s.wildPokemonTypeMod = restoreState(d[17], 0) ? "NONE"
    : restoreState(d[17], 1) ? "KEEP_PRIMARY"
    : restoreState(d[17], 2) ? "RANDOM_THEMES"
    : "NONE";
  s.keepWildTypeThemes = restoreState(d[17], 3);
  s.wildPokemonEvolutionMod = restoreState(d[17], 4) ? "NONE"
    : restoreState(d[17], 5) ? "BASIC_ONLY"
    : restoreState(d[17], 6) ? "KEEP_STAGE"
    : "NONE";

  // 18
  s.useTimeBasedEncounters = restoreState(d[18], 0);
  s.useMinimumCatchRate = restoreState(d[18], 1);
  s.blockWildLegendaries = restoreState(d[18], 2);
  s.randomizeWildPokemonHeldItems = restoreState(d[18], 3);
  s.banBadRandomWildPokemonHeldItems = restoreState(d[18], 4);
  s.balanceShakingGrass = restoreState(d[18], 5);

  // 19
  s.staticPokemonMod = restoreState(d[19], 0) ? "UNCHANGED"
    : restoreState(d[19], 1) ? "RANDOM_MATCHING"
    : restoreState(d[19], 2) ? "COMPLETELY_RANDOM"
    : "SIMILAR_STRENGTH";
  s.limitMainGameLegendaries = restoreState(d[19], 4);
  s.limit600 = restoreState(d[19], 5);
  s.allowStaticAltFormes = restoreState(d[19], 6);
  s.swapStaticMegaEvos = restoreState(d[19], 7);

  // 20-22
  s.tmsHmsCompatibilityMod = restoreState(d[20], 2) ? "UNCHANGED"
    : restoreState(d[20], 0) ? "COMPLETELY_RANDOM"
    : restoreState(d[20], 7) ? "FULL"
    : "RANDOM_PREFER_TYPE";
  s.tmsMod = restoreState(d[20], 4) ? "UNCHANGED" : "RANDOM";
  s.tmLevelUpMoveSanity = restoreState(d[20], 5);
  s.keepFieldMoveTMs = restoreState(d[20], 6);
  s.fullHMCompat = restoreState(d[21], 0);
  s.tmsFollowEvolutions = restoreState(d[21], 1);
  s.tutorFollowEvolutions = restoreState(d[21], 2);
  s.tmsForceGoodDamaging = restoreState(d[22], 7);
  s.tmsGoodDamagingPercent = d[22] & 0x7f;

  // 23-24
  s.moveTutorsCompatibilityMod = restoreState(d[23], 2) ? "UNCHANGED"
    : restoreState(d[23], 0) ? "COMPLETELY_RANDOM"
    : restoreState(d[23], 7) ? "FULL"
    : "RANDOM_PREFER_TYPE";
  s.moveTutorMovesMod = restoreState(d[23], 4) ? "UNCHANGED" : "RANDOM";
  s.tutorLevelUpMoveSanity = restoreState(d[23], 5);
  s.keepFieldMoveTutors = restoreState(d[23], 6);
  s.tutorsForceGoodDamaging = restoreState(d[24], 7);
  s.tutorsGoodDamagingPercent = d[24] & 0x7f;

  // 25
  s.inGameTradesMod = restoreState(d[25], 6) ? "UNCHANGED"
    : restoreState(d[25], 0) ? "RANDOMIZE_GIVEN_AND_REQUESTED"
    : "RANDOMIZE_GIVEN";
  s.randomizeInGameTradesItems = restoreState(d[25], 2);
  s.randomizeInGameTradesIVs = restoreState(d[25], 3);
  s.randomizeInGameTradesNicknames = restoreState(d[25], 4);
  s.randomizeInGameTradesOTs = restoreState(d[25], 5);

  // 26
  s.fieldItemsMod = restoreState(d[26], 2) ? "UNCHANGED"
    : restoreState(d[26], 0) ? "RANDOM"
    : restoreState(d[26], 4) ? "RANDOM_EVEN"
    : "SHUFFLE";
  s.banBadRandomFieldItems = restoreState(d[26], 3);

  // 27
  s.randomizeMovePowers = restoreState(d[27], 0);
  s.randomizeMoveAccuracies = restoreState(d[27], 1);
  s.randomizeMovePPs = restoreState(d[27], 2);
  s.randomizeMoveTypes = restoreState(d[27], 3);
  s.randomizeMoveCategory = restoreState(d[27], 4);
  s.correctStaticMusic = restoreState(d[27], 5);
  s.randomizeMoveNames = restoreState(d[27], 6);

  // 28
  s.evolutionsMod = restoreState(d[28], 0) ? "UNCHANGED"
    : restoreState(d[28], 7) ? "RANDOM_EVERY_LEVEL"
    : "RANDOM";
  s.evosSimilarStrength = restoreState(d[28], 2);
  s.evosSameTyping = restoreState(d[28], 3);
  s.evosMaxThreeStages = restoreState(d[28], 4);
  s.evosForceChange = restoreState(d[28], 5);
  s.evosAllowAltFormes = restoreState(d[28], 6);

  // 29
  s.trainersUsePokemonOfSimilarStrength = restoreState(d[29], 0);
  s.rivalCarriesStarterThroughout = restoreState(d[29], 1);
  s.trainersMatchTypingDistribution = restoreState(d[29], 2);
  s.trainersBlockLegendaries = restoreState(d[29], 3);
  s.trainersBlockEarlyWonderGuard = restoreState(d[29], 4);
  s.swapTrainerMegaEvos = restoreState(d[29], 5);
  s.shinyChance = restoreState(d[29], 6);
  s.trainersAvoidDuplicates = restoreState(d[29], 7);

  // 30-37
  s.currentRestrictions = readInt32LE(d, 30);
  s.currentMiscTweaks = dv.getInt32(34, false);

  // 38
  s.trainersLevelModifier = signedInt8Restore(d[38]);

  // 39
  s.shopItemsMod = restoreState(d[39], 2) ? "UNCHANGED" : restoreState(d[39], 0) ? "RANDOM" : "SHUFFLE";
  s.banBadRandomShopItems = restoreState(d[39], 3);
  s.banRegularShopItems = restoreState(d[39], 4);
  s.banOPShopItems = restoreState(d[39], 5);
  s.guaranteeEvolutionItems = restoreState(d[39], 7);

  // 40
  s.wildLevelModifier = signedInt8Restore(d[40]);

  // 41
  s.expCurveMod = restoreState(d[41], 0) ? "LEGENDARIES"
    : restoreState(d[41], 1) ? "STRONG_LEGENDARIES"
    : "ALL";
  s.blockBrokenMovesetMoves = restoreState(d[41], 3);
  s.blockBrokenTMMoves = restoreState(d[41], 4);
  s.blockBrokenTutorMoves = restoreState(d[41], 5);
  s.allowTrainerAlternateFormes = restoreState(d[41], 6);
  s.allowWildAltFormes = restoreState(d[41], 7);

  // 42 (legacy bit 0 ignored)
  s.additionalBossTrainerPokemon = (d[42] >> 1) & 0x7;
  s.additionalImportantTrainerPokemon = (d[42] >> 4) & 0x7;
  s.weighDuplicateAbilitiesTogether = restoreState(d[42], 7);

  // 43
  s.additionalRegularTrainerPokemon = d[43] & 0x7;
  s.auraMod = restoreState(d[43], 3) ? "UNCHANGED" : restoreState(d[43], 4) ? "RANDOM" : "SAME_STRENGTH";
  s.evolutionMovesForAll = restoreState(d[43], 6);
  s.guaranteeXItems = restoreState(d[43], 7);

  // 44
  s.totemPokemonMod = restoreState(d[44], 0) ? "UNCHANGED" : restoreState(d[44], 1) ? "RANDOM" : "SIMILAR_STRENGTH";
  s.allyPokemonMod = restoreState(d[44], 3) ? "UNCHANGED" : restoreState(d[44], 4) ? "RANDOM" : "SIMILAR_STRENGTH";
  s.randomizeTotemHeldItems = restoreState(d[44], 6);
  s.allowTotemAltFormes = restoreState(d[44], 7);

  // 45-49
  s.totemLevelModifier = signedInt8Restore(d[45]);
  s.updateBaseStatsToGeneration = d[46];
  s.updateMovesToGeneration = d[47];
  const expCurveByte = d[48];
  s.selectedEXPCurve = expCurveByte === 1 ? "ERRATIC"
    : expCurveByte === 2 ? "FLUCTUATING"
    : expCurveByte === 3 ? "MEDIUM_SLOW"
    : expCurveByte === 4 ? "FAST"
    : expCurveByte === 5 ? "SLOW"
    : "MEDIUM_FAST";
  s.staticLevelModifier = signedInt8Restore(d[49]);

  // 50
  s.randomizeHeldItemsForBossTrainerPokemon = restoreState(d[50], 0);
  s.randomizeHeldItemsForImportantTrainerPokemon = restoreState(d[50], 1);
  s.randomizeHeldItemsForRegularTrainerPokemon = restoreState(d[50], 2);
  s.consumableItemsOnlyForTrainerPokemon = restoreState(d[50], 3);
  s.sensibleItemsOnlyForTrainerPokemon = restoreState(d[50], 4);
  s.highestLevelOnlyGetsItemsForTrainerPokemon = restoreState(d[50], 5);
  s.ensureTwoAbilities = restoreState(d[50], 6);
  s.trainersUseLocalPokemon = restoreState(d[50], 7);

  // 51
  s.pickupItemsMod = restoreState(d[51], 1) ? "UNCHANGED" : "RANDOM";
  s.banBadRandomPickupItems = restoreState(d[51], 2);
  s.banIrregularAltFormes = restoreState(d[51], 3);

  // 52
  s.eliteFourUniquePokemonNumber = d[52] & 0x7;
  s.minimumCatchRateLevel = ((d[52] >> 3) & 0x7) + 1;

  // 53-54
  s.startersTypeMod = restoreState(d[53], 0) ? "NONE"
    : restoreState(d[53], 1) ? "FIRE_WATER_GRASS"
    : restoreState(d[53], 2) ? "TRIANGLE"
    : restoreState(d[53], 3) ? "UNIQUE"
    : restoreState(d[53], 4) ? "SINGLE_TYPE"
    : "NONE";
  s.startersNoLegendaries = restoreState(d[53], 6);
  s.startersNoDualTypes = restoreState(d[53], 7);
  s.startersSingleType = byteToType(d[54]);

  // 55
  s.pokemonPalettesMod = restoreState(d[55], 0) ? "UNCHANGED"
    : restoreState(d[55], 1) ? "RANDOM"
    : "UNCHANGED";
  s.pokemonPalettesFollowTypes = restoreState(d[55], 2);
  s.pokemonPalettesFollowEvolutions = restoreState(d[55], 3);
  s.pokemonPalettesShinyFromNormal = restoreState(d[55], 4);

  // 56
  s.typeEffectivenessMod = restoreState(d[56], 0) ? "UNCHANGED"
    : restoreState(d[56], 1) ? "RANDOM"
    : restoreState(d[56], 2) ? "RANDOM_BALANCED"
    : restoreState(d[56], 3) ? "KEEP_IDENTITIES"
    : restoreState(d[56], 4) ? "INVERSE"
    : "UNCHANGED";
  s.inverseTypesRandomImmunities = restoreState(d[56], 5);
  s.updateTypeEffectiveness = restoreState(d[56], 6);

  // 57
  s.evosForceGrowth = restoreState(d[57], 0);
  s.evosNoConvergence = restoreState(d[57], 1);

  // 58-60: starter BST limits (12-bit packed)
  // highEndByte = ((min >> 8) & 0x0F) | ((max >> 4) & 0xF0)
  s.startersBSTMinimum = ((d[58] & 0x0f) << 8) | d[59];
  s.startersBSTMaximum = ((d[58] & 0xf0) << 4) | d[60];

  // 61
  s.diverseTypesForBossTrainers = restoreState(d[61], 0);
  s.diverseTypesForImportantTrainers = restoreState(d[61], 1);
  s.diverseTypesForRegularTrainers = restoreState(d[61], 2);
  s.betterBossTrainerMovesets = restoreState(d[61], 3);
  s.betterImportantTrainerMovesets = restoreState(d[61], 4);
  s.betterRegularTrainerMovesets = restoreState(d[61], 5);

  // 62
  s.battleStyleModification = restoreState(d[62], 0) ? "UNCHANGED"
    : restoreState(d[62], 1) ? "RANDOM"
    : restoreState(d[62], 2) ? "SINGLE_STYLE"
    : "UNCHANGED";
  const styleNib = (d[62] >> 3) & 0xf;
  s.battleStyleType = (styleNib & 1) ? "SINGLE_BATTLE"
    : (styleNib & 2) ? "DOUBLE_BATTLE"
    : (styleNib & 4) ? "TRIPLE_BATTLE"
    : (styleNib & 8) ? "ROTATION_BATTLE"
    : "SINGLE_BATTLE";

  // 63
  s.trainersEvolveTheirPokemon = restoreState(d[63], 0);
  s.banPrematureEvos = restoreState(d[63], 1);
  s.trainersLevelModified = restoreState(d[63], 2);
  s.wildLevelsModified = restoreState(d[63], 3);
  s.totemLevelsModified = restoreState(d[63], 4);
  s.staticLevelModified = restoreState(d[63], 5);

  // 64
  s.balanceShopPrices = restoreState(d[64], 0);
  s.addCheapRareCandiesToShops = restoreState(d[64], 1);

  // 65
  s.randomizeIntroMon = restoreState(d[65], 0);
  s.raceMode = restoreState(d[65], 1);
  s.limitPokemon = restoreState(d[65], 3);

  // 66
  s.makeEvolutionsEasierLvl = d[66];

  // romName
  let offset = 67;
  const nameLen = d[offset++];
  const nameBytes = d.slice(offset, offset + nameLen);
  s.romName = new TextDecoder("ascii").decode(nameBytes);

  return s;
}

/**
 * Parses a .rnqs file buffer and returns the embedded settings string (base64).
 */
export function parseRnqsFile(buffer: ArrayBuffer): string {
  const view = new DataView(buffer);
  // const version = view.getInt32(0, false); // big-endian
  const length = view.getInt32(4, false);
  const bytes = new Uint8Array(buffer, 8, length);
  return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Encodes settings to a base64 settings string (for display / import-export).
 */
export function settingsToString(s: UPRSettings): string {
  const rnqs = encodeSettings(s);
  const view = new DataView(rnqs.buffer);
  const length = view.getInt32(4, false);
  const settingsBytes = new Uint8Array(rnqs.buffer, 8, length);
  return new TextDecoder("utf-8").decode(settingsBytes);
}

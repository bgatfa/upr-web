// TypeScript mirror of com.uprfvx.random.Settings
// VERSION 422 (UPR-FVX 1.5.1)

export type BaseStatisticsMod = "UNCHANGED" | "SHUFFLE" | "RANDOM";
export type ExpCurveMod = "LEGENDARIES" | "STRONG_LEGENDARIES" | "ALL";
export type AbilitiesMod = "UNCHANGED" | "RANDOMIZE";
export type StartersMod =
  | "UNCHANGED"
  | "CUSTOM"
  | "COMPLETELY_RANDOM"
  | "RANDOM_WITH_TWO_EVOLUTIONS"
  | "RANDOM_BASIC";
export type StartersTypeMod =
  | "NONE"
  | "FIRE_WATER_GRASS"
  | "TRIANGLE"
  | "UNIQUE"
  | "SINGLE_TYPE";
export type SpeciesTypesMod = "UNCHANGED" | "RANDOM_FOLLOW_EVOLUTIONS" | "COMPLETELY_RANDOM";
export type EvolutionsMod = "UNCHANGED" | "RANDOM" | "RANDOM_EVERY_LEVEL";
export type MovesetsMod = "UNCHANGED" | "RANDOM_PREFER_SAME_TYPE" | "COMPLETELY_RANDOM" | "METRONOME_ONLY";
export type TrainersMod =
  | "UNCHANGED"
  | "RANDOM"
  | "DISTRIBUTED"
  | "MAINPLAYTHROUGH"
  | "TYPE_THEMED"
  | "TYPE_THEMED_ELITE4_GYMS"
  | "KEEP_THEMED"
  | "KEEP_THEME_OR_PRIMARY";
export type WildPokemonZoneMod = "NONE" | "ENCOUNTER_SET" | "MAP" | "NAMED_LOCATION" | "GAME";
export type WildPokemonTypeMod = "NONE" | "RANDOM_THEMES" | "KEEP_PRIMARY";
export type WildPokemonEvolutionMod = "NONE" | "BASIC_ONLY" | "KEEP_STAGE";
export type StaticPokemonMod = "UNCHANGED" | "RANDOM_MATCHING" | "COMPLETELY_RANDOM" | "SIMILAR_STRENGTH";
export type TMsMod = "UNCHANGED" | "RANDOM";
export type TMsHMsCompatibilityMod = "UNCHANGED" | "RANDOM_PREFER_TYPE" | "COMPLETELY_RANDOM" | "FULL";
export type MoveTutorMovesMod = "UNCHANGED" | "RANDOM";
export type MoveTutorsCompatibilityMod = "UNCHANGED" | "RANDOM_PREFER_TYPE" | "COMPLETELY_RANDOM" | "FULL";
export type InGameTradesMod = "UNCHANGED" | "RANDOMIZE_GIVEN" | "RANDOMIZE_GIVEN_AND_REQUESTED";
export type FieldItemsMod = "UNCHANGED" | "SHUFFLE" | "RANDOM" | "RANDOM_EVEN";
export type ShopItemsMod = "UNCHANGED" | "SHUFFLE" | "RANDOM";
export type PickupItemsMod = "UNCHANGED" | "RANDOM";
export type TotemPokemonMod = "UNCHANGED" | "RANDOM" | "SIMILAR_STRENGTH";
export type AllyPokemonMod = "UNCHANGED" | "RANDOM" | "SIMILAR_STRENGTH";
export type AuraMod = "UNCHANGED" | "RANDOM" | "SAME_STRENGTH";
export type ExpCurve = "MEDIUM_FAST" | "ERRATIC" | "FLUCTUATING" | "MEDIUM_SLOW" | "FAST" | "SLOW";
export type PokemonPalettesMod = "UNCHANGED" | "RANDOM";
export type TypeEffectivenessMod =
  | "UNCHANGED"
  | "RANDOM"
  | "RANDOM_BALANCED"
  | "KEEP_IDENTITIES"
  | "INVERSE";
export type BattleStyleModification = "UNCHANGED" | "RANDOM" | "SINGLE_STYLE";
export type BattleStyleType = "SINGLE_BATTLE" | "DOUBLE_BATTLE" | "TRIPLE_BATTLE" | "ROTATION_BATTLE";
export type PokemonType =
  | "NORMAL" | "FIGHTING" | "FLYING" | "GRASS" | "WATER" | "FIRE"
  | "ROCK" | "GROUND" | "PSYCHIC" | "BUG" | "DRAGON" | "ELECTRIC"
  | "GHOST" | "POISON" | "ICE" | "STEEL" | "DARK" | "FAIRY";

// Type.toInt() ordinals from upstream Type.java
export const POKEMON_TYPE_INDEX: Record<PokemonType, number> = {
  NORMAL: 0, FIGHTING: 1, FLYING: 2, GRASS: 3, WATER: 4, FIRE: 5,
  ROCK: 6, GROUND: 7, PSYCHIC: 8, BUG: 9, DRAGON: 10, ELECTRIC: 11,
  GHOST: 12, POISON: 13, ICE: 14, STEEL: 15, DARK: 16, FAIRY: 17,
};

export interface UPRSettings {
  // Byte 0: general options #1
  changeImpossibleEvolutions: boolean;
  updateMoves: boolean;
  updateMovesLegacy: boolean;
  randomizeTrainerNames: boolean;
  randomizeTrainerClassNames: boolean;
  makeEvolutionsEasier: boolean;
  removeTimeBasedEvolutions: boolean;
  estimateLevelForEvolutionImprovements: boolean; // FVX: byte 0 bit 7

  // Byte 1: base stats
  baseStatsFollowEvolutions: boolean;
  baseStatisticsMod: BaseStatisticsMod;
  standardizeEXPCurves: boolean;
  updateBaseStats: boolean;
  baseStatsFollowMegaEvolutions: boolean;
  assignEvoStatsRandomly: boolean;
  updateBaseStatsToGeneration: number; // byte 46
  expCurveMod: ExpCurveMod; // byte 41
  selectedEXPCurve: ExpCurve; // byte 48

  // Byte 2: species types
  speciesTypesMod: SpeciesTypesMod;
  typesFollowMegaEvolutions: boolean;
  dualTypeOnly: boolean;

  // Byte 3: abilities
  abilitiesMod: AbilitiesMod;
  allowWonderGuard: boolean;
  abilitiesFollowEvolutions: boolean;
  abilitiesFollowMegaEvolutions: boolean;
  banTrappingAbilities: boolean;
  banNegativeAbilities: boolean;
  banBadAbilities: boolean;
  weighDuplicateAbilitiesTogether: boolean; // byte 42
  ensureTwoAbilities: boolean; // byte 50

  // Byte 4 + 53-54 + 58-60: starters
  startersMod: StartersMod;
  customStarters: [number, number, number]; // bytes 5-10 (LE, 1-based species index)
  randomizeStartersHeldItems: boolean;
  banBadRandomStarterHeldItems: boolean;
  allowStarterAltFormes: boolean;
  startersTypeMod: StartersTypeMod; // byte 53
  startersSingleType: PokemonType | null; // byte 54 (0 = null, else type ordinal + 1)
  startersNoLegendaries: boolean; // byte 53 bit 6
  startersNoDualTypes: boolean; // byte 53 bit 7
  startersBSTMinimum: number; // bytes 58-60 (12-bit packed)
  startersBSTMaximum: number;

  // Bytes 11-12 + 27 + 43: movesets / moves
  movesetsMod: MovesetsMod;
  startWithGuaranteedMoves: boolean;
  guaranteedMoveCount: number;
  reorderDamagingMoves: boolean;
  movesetsForceGoodDamaging: boolean;
  movesetsGoodDamagingPercent: number;
  blockBrokenMovesetMoves: boolean; // byte 41
  evolutionMovesForAll: boolean; // byte 43
  randomizeMoveNames: boolean; // FVX: byte 27 bit 6

  // Bytes 13-14 + 29 + 38 + 42 + 43 + 50 + 61 + 62 + 63: trainers
  trainersMod: TrainersMod;
  trainersEvolutionLevelModifier: number; // byte 14 (-100..155)
  trainersLevelModified: boolean; // byte 63 bit 2
  trainersLevelModifier: number; // byte 38 (-100..155)
  eliteFourUniquePokemonNumber: number;
  additionalBossTrainerPokemon: number;
  additionalImportantTrainerPokemon: number;
  additionalRegularTrainerPokemon: number;
  trainersUsePokemonOfSimilarStrength: boolean;
  rivalCarriesStarterThroughout: boolean;
  trainersMatchTypingDistribution: boolean;
  trainersBlockLegendaries: boolean;
  trainersBlockEarlyWonderGuard: boolean;
  swapTrainerMegaEvos: boolean;
  shinyChance: boolean;
  trainersAvoidDuplicates: boolean; // FVX: byte 29 bit 7
  trainersUseLocalPokemon: boolean; // FVX: byte 50 bit 7
  trainersEvolveTheirPokemon: boolean; // FVX: byte 63 bit 0
  banPrematureEvos: boolean; // FVX: byte 63 bit 1
  diverseTypesForBossTrainers: boolean; // FVX: byte 61
  diverseTypesForImportantTrainers: boolean;
  diverseTypesForRegularTrainers: boolean;
  betterBossTrainerMovesets: boolean; // FVX: byte 61
  betterImportantTrainerMovesets: boolean;
  betterRegularTrainerMovesets: boolean;
  battleStyleModification: BattleStyleModification; // FVX: byte 62
  battleStyleType: BattleStyleType; // FVX: byte 62
  allowTrainerAlternateFormes: boolean; // byte 41

  // Trainer held items (byte 50)
  randomizeHeldItemsForBossTrainerPokemon: boolean;
  randomizeHeldItemsForImportantTrainerPokemon: boolean;
  randomizeHeldItemsForRegularTrainerPokemon: boolean;
  consumableItemsOnlyForTrainerPokemon: boolean;
  sensibleItemsOnlyForTrainerPokemon: boolean;
  highestLevelOnlyGetsItemsForTrainerPokemon: boolean;

  // Bytes 15-18 + 40 + 63: wild pokemon
  randomizeWildPokemon: boolean; // FVX: byte 15 bit 0 (inverted)
  wildPokemonZoneMod: WildPokemonZoneMod; // byte 15
  splitWildZoneByEncounterTypes: boolean; // byte 15 bit 7
  keepWildEvolutionFamilies: boolean; // byte 15 bit 4
  wildPokemonTypeMod: WildPokemonTypeMod; // byte 17
  keepWildTypeThemes: boolean; // byte 17 bit 3
  wildPokemonEvolutionMod: WildPokemonEvolutionMod; // byte 17
  similarStrengthEncounters: boolean; // byte 16 bit 1
  catchEmAllEncounters: boolean; // byte 16 bit 2
  useTimeBasedEncounters: boolean;
  blockWildLegendaries: boolean;
  useMinimumCatchRate: boolean;
  minimumCatchRateLevel: number;
  randomizeWildPokemonHeldItems: boolean;
  banBadRandomWildPokemonHeldItems: boolean;
  balanceShakingGrass: boolean;
  wildLevelsModified: boolean; // byte 63 bit 3
  wildLevelModifier: number; // byte 40
  allowWildAltFormes: boolean; // byte 41

  // Byte 19 + 49 + 63: static pokemon
  staticPokemonMod: StaticPokemonMod;
  allowStaticAltFormes: boolean;
  swapStaticMegaEvos: boolean;
  staticLevelModified: boolean; // byte 63 bit 5
  staticLevelModifier: number; // byte 49
  correctStaticMusic: boolean;
  limitMainGameLegendaries: boolean;
  limit600: boolean;

  // Bytes 20-22: TMs
  tmsMod: TMsMod;
  tmsHmsCompatibilityMod: TMsHMsCompatibilityMod;
  tmLevelUpMoveSanity: boolean;
  keepFieldMoveTMs: boolean;
  fullHMCompat: boolean;
  tmsForceGoodDamaging: boolean;
  tmsGoodDamagingPercent: number;
  blockBrokenTMMoves: boolean; // byte 41
  tmsFollowEvolutions: boolean;

  // Bytes 23-24: tutors
  moveTutorMovesMod: MoveTutorMovesMod;
  moveTutorsCompatibilityMod: MoveTutorsCompatibilityMod;
  tutorLevelUpMoveSanity: boolean;
  keepFieldMoveTutors: boolean;
  tutorsForceGoodDamaging: boolean;
  tutorsGoodDamagingPercent: number;
  blockBrokenTutorMoves: boolean; // byte 41
  tutorFollowEvolutions: boolean;

  // Byte 25: in-game trades
  inGameTradesMod: InGameTradesMod;
  randomizeInGameTradesItems: boolean;
  randomizeInGameTradesIVs: boolean;
  randomizeInGameTradesNicknames: boolean;
  randomizeInGameTradesOTs: boolean;

  // Byte 26: field items
  fieldItemsMod: FieldItemsMod;
  banBadRandomFieldItems: boolean;

  // Byte 27: move randomizers
  randomizeMovePowers: boolean;
  randomizeMoveAccuracies: boolean;
  randomizeMovePPs: boolean;
  randomizeMoveTypes: boolean;
  randomizeMoveCategory: boolean;
  updateMovesToGeneration: number; // byte 47

  // Byte 28 + 57: evolutions
  evolutionsMod: EvolutionsMod;
  evosSimilarStrength: boolean;
  evosSameTyping: boolean;
  evosMaxThreeStages: boolean;
  evosForceChange: boolean;
  evosAllowAltFormes: boolean;
  evosForceGrowth: boolean; // FVX: byte 57 bit 0
  evosNoConvergence: boolean; // FVX: byte 57 bit 1

  // Bytes 30-33: restrictions (LE int32)
  currentRestrictions: number;

  // Bytes 34-37: misc tweaks (BE int32)
  currentMiscTweaks: number;

  // Byte 39 + 64: shop items
  shopItemsMod: ShopItemsMod;
  banBadRandomShopItems: boolean;
  banRegularShopItems: boolean;
  banOPShopItems: boolean;
  balanceShopPrices: boolean; // FVX: byte 64 bit 0
  guaranteeEvolutionItems: boolean;
  guaranteeXItems: boolean; // byte 43
  addCheapRareCandiesToShops: boolean; // FVX: byte 64 bit 1

  // Bytes 43-45 + 63: totem pokemon
  totemPokemonMod: TotemPokemonMod;
  allyPokemonMod: AllyPokemonMod;
  auraMod: AuraMod;
  randomizeTotemHeldItems: boolean;
  totemLevelsModified: boolean; // byte 63 bit 4
  totemLevelModifier: number; // byte 45
  allowTotemAltFormes: boolean;

  // Byte 51: pickup items
  pickupItemsMod: PickupItemsMod;
  banBadRandomPickupItems: boolean;
  banIrregularAltFormes: boolean;

  // Byte 55: pokemon palettes
  pokemonPalettesMod: PokemonPalettesMod;
  pokemonPalettesFollowTypes: boolean;
  pokemonPalettesFollowEvolutions: boolean;
  pokemonPalettesShinyFromNormal: boolean;

  // Byte 56: type effectiveness
  typeEffectivenessMod: TypeEffectivenessMod;
  inverseTypesRandomImmunities: boolean;
  updateTypeEffectiveness: boolean;

  // Byte 65: general options #2
  randomizeIntroMon: boolean;
  raceMode: boolean;
  limitPokemon: boolean;

  // Byte 66: make evolutions easier level
  makeEvolutionsEasierLvl: number; // default 40

  // ROM name (used in settings string; usually left empty for CLI use)
  romName: string;
}

export function defaultSettings(): UPRSettings {
  return {
    changeImpossibleEvolutions: false,
    updateMoves: false,
    updateMovesLegacy: false,
    randomizeTrainerNames: false,
    randomizeTrainerClassNames: false,
    makeEvolutionsEasier: false,
    removeTimeBasedEvolutions: false,
    estimateLevelForEvolutionImprovements: false,

    baseStatsFollowEvolutions: false,
    baseStatisticsMod: "UNCHANGED",
    standardizeEXPCurves: false,
    updateBaseStats: false,
    baseStatsFollowMegaEvolutions: false,
    assignEvoStatsRandomly: false,
    updateBaseStatsToGeneration: 0,
    expCurveMod: "LEGENDARIES",
    selectedEXPCurve: "MEDIUM_FAST",

    speciesTypesMod: "UNCHANGED",
    typesFollowMegaEvolutions: false,
    dualTypeOnly: false,

    abilitiesMod: "UNCHANGED",
    allowWonderGuard: true,
    abilitiesFollowEvolutions: false,
    abilitiesFollowMegaEvolutions: false,
    banTrappingAbilities: false,
    banNegativeAbilities: false,
    banBadAbilities: false,
    weighDuplicateAbilitiesTogether: false,
    ensureTwoAbilities: false,

    startersMod: "UNCHANGED",
    customStarters: [1, 4, 7],
    randomizeStartersHeldItems: false,
    banBadRandomStarterHeldItems: false,
    allowStarterAltFormes: false,
    startersTypeMod: "NONE",
    startersSingleType: null,
    startersNoLegendaries: false,
    startersNoDualTypes: false,
    startersBSTMinimum: 0,
    startersBSTMaximum: 0,

    movesetsMod: "UNCHANGED",
    startWithGuaranteedMoves: false,
    guaranteedMoveCount: 2,
    reorderDamagingMoves: false,
    movesetsForceGoodDamaging: false,
    movesetsGoodDamagingPercent: 0,
    blockBrokenMovesetMoves: false,
    evolutionMovesForAll: false,
    randomizeMoveNames: false,

    trainersMod: "UNCHANGED",
    trainersEvolutionLevelModifier: 0,
    trainersLevelModified: false,
    trainersLevelModifier: 0,
    eliteFourUniquePokemonNumber: 0,
    additionalBossTrainerPokemon: 0,
    additionalImportantTrainerPokemon: 0,
    additionalRegularTrainerPokemon: 0,
    trainersUsePokemonOfSimilarStrength: false,
    rivalCarriesStarterThroughout: false,
    trainersMatchTypingDistribution: false,
    trainersBlockLegendaries: true,
    trainersBlockEarlyWonderGuard: true,
    swapTrainerMegaEvos: false,
    shinyChance: false,
    trainersAvoidDuplicates: false,
    trainersUseLocalPokemon: false,
    trainersEvolveTheirPokemon: false,
    banPrematureEvos: false,
    diverseTypesForBossTrainers: false,
    diverseTypesForImportantTrainers: false,
    diverseTypesForRegularTrainers: false,
    betterBossTrainerMovesets: false,
    betterImportantTrainerMovesets: false,
    betterRegularTrainerMovesets: false,
    battleStyleModification: "UNCHANGED",
    battleStyleType: "SINGLE_BATTLE",
    allowTrainerAlternateFormes: false,
    randomizeHeldItemsForBossTrainerPokemon: false,
    randomizeHeldItemsForImportantTrainerPokemon: false,
    randomizeHeldItemsForRegularTrainerPokemon: false,
    consumableItemsOnlyForTrainerPokemon: false,
    sensibleItemsOnlyForTrainerPokemon: false,
    highestLevelOnlyGetsItemsForTrainerPokemon: false,

    randomizeWildPokemon: false,
    wildPokemonZoneMod: "GAME",
    splitWildZoneByEncounterTypes: false,
    keepWildEvolutionFamilies: false,
    wildPokemonTypeMod: "NONE",
    keepWildTypeThemes: false,
    wildPokemonEvolutionMod: "NONE",
    similarStrengthEncounters: false,
    catchEmAllEncounters: false,
    useTimeBasedEncounters: false,
    blockWildLegendaries: true,
    useMinimumCatchRate: false,
    minimumCatchRateLevel: 1,
    randomizeWildPokemonHeldItems: false,
    banBadRandomWildPokemonHeldItems: false,
    balanceShakingGrass: false,
    wildLevelsModified: false,
    wildLevelModifier: 0,
    allowWildAltFormes: false,

    staticPokemonMod: "UNCHANGED",
    allowStaticAltFormes: false,
    swapStaticMegaEvos: false,
    staticLevelModified: false,
    staticLevelModifier: 0,
    correctStaticMusic: false,
    limitMainGameLegendaries: false,
    limit600: false,

    tmsMod: "UNCHANGED",
    tmsHmsCompatibilityMod: "UNCHANGED",
    tmLevelUpMoveSanity: false,
    keepFieldMoveTMs: false,
    fullHMCompat: false,
    tmsForceGoodDamaging: false,
    tmsGoodDamagingPercent: 0,
    blockBrokenTMMoves: false,
    tmsFollowEvolutions: false,

    moveTutorMovesMod: "UNCHANGED",
    moveTutorsCompatibilityMod: "UNCHANGED",
    tutorLevelUpMoveSanity: false,
    keepFieldMoveTutors: false,
    tutorsForceGoodDamaging: false,
    tutorsGoodDamagingPercent: 0,
    blockBrokenTutorMoves: false,
    tutorFollowEvolutions: false,

    inGameTradesMod: "UNCHANGED",
    randomizeInGameTradesItems: false,
    randomizeInGameTradesIVs: false,
    randomizeInGameTradesNicknames: false,
    randomizeInGameTradesOTs: false,

    fieldItemsMod: "UNCHANGED",
    banBadRandomFieldItems: false,

    randomizeMovePowers: false,
    randomizeMoveAccuracies: false,
    randomizeMovePPs: false,
    randomizeMoveTypes: false,
    randomizeMoveCategory: false,
    updateMovesToGeneration: 0,

    evolutionsMod: "UNCHANGED",
    evosSimilarStrength: false,
    evosSameTyping: false,
    evosMaxThreeStages: false,
    evosForceChange: false,
    evosAllowAltFormes: false,
    evosForceGrowth: false,
    evosNoConvergence: false,

    currentRestrictions: 0,
    currentMiscTweaks: 0,

    shopItemsMod: "UNCHANGED",
    banBadRandomShopItems: false,
    banRegularShopItems: false,
    banOPShopItems: false,
    balanceShopPrices: false,
    guaranteeEvolutionItems: false,
    guaranteeXItems: false,
    addCheapRareCandiesToShops: false,

    totemPokemonMod: "UNCHANGED",
    allyPokemonMod: "UNCHANGED",
    auraMod: "UNCHANGED",
    randomizeTotemHeldItems: false,
    totemLevelsModified: false,
    totemLevelModifier: 0,
    allowTotemAltFormes: false,

    pickupItemsMod: "UNCHANGED",
    banBadRandomPickupItems: false,
    banIrregularAltFormes: false,

    pokemonPalettesMod: "UNCHANGED",
    pokemonPalettesFollowTypes: false,
    pokemonPalettesFollowEvolutions: false,
    pokemonPalettesShinyFromNormal: false,

    typeEffectivenessMod: "UNCHANGED",
    inverseTypesRandomImmunities: false,
    updateTypeEffectiveness: false,

    randomizeIntroMon: false,
    raceMode: false,
    limitPokemon: false,

    makeEvolutionsEasierLvl: 40,

    romName: "",
  };
}

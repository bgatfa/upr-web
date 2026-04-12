// TypeScript mirror of com.dabomstew.pkrandom.Settings
// VERSION 322 (UPR-ZX 4.6.1)

export type BaseStatisticsMod = "UNCHANGED" | "SHUFFLE" | "RANDOM";
export type ExpCurveMod = "LEGENDARIES" | "STRONG_LEGENDARIES" | "ALL";
export type AbilitiesMod = "UNCHANGED" | "RANDOMIZE";
export type StartersMod = "UNCHANGED" | "CUSTOM" | "COMPLETELY_RANDOM" | "RANDOM_WITH_TWO_EVOLUTIONS";
export type TypesMod = "UNCHANGED" | "RANDOM_FOLLOW_EVOLUTIONS" | "COMPLETELY_RANDOM";
export type EvolutionsMod = "UNCHANGED" | "RANDOM" | "RANDOM_EVERY_LEVEL";
export type MovesetsMod = "UNCHANGED" | "RANDOM_PREFER_SAME_TYPE" | "COMPLETELY_RANDOM" | "METRONOME_ONLY";
export type TrainersMod = "UNCHANGED" | "RANDOM" | "DISTRIBUTED" | "MAINPLAYTHROUGH" | "TYPE_THEMED" | "TYPE_THEMED_ELITE4_GYMS";
export type WildPokemonMod = "UNCHANGED" | "RANDOM" | "AREA_MAPPING" | "GLOBAL_MAPPING";
export type WildPokemonRestrictionMod = "NONE" | "SIMILAR_STRENGTH" | "CATCH_EM_ALL" | "TYPE_THEME_AREAS";
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

export interface UPRSettings {
  // Byte 0: general options
  changeImpossibleEvolutions: boolean;
  updateMoves: boolean;
  updateMovesLegacy: boolean;
  randomizeTrainerNames: boolean;
  randomizeTrainerClassNames: boolean;
  makeEvolutionsEasier: boolean;
  removeTimeBasedEvolutions: boolean;

  // Byte 1: base stats
  baseStatsFollowEvolutions: boolean;
  baseStatisticsMod: BaseStatisticsMod;
  standardizeEXPCurves: boolean;
  updateBaseStats: boolean;
  baseStatsFollowMegaEvolutions: boolean;
  assignEvoStatsRandomly: boolean;
  updateBaseStatsToGeneration: number; // byte 44
  expCurveMod: ExpCurveMod; // byte 39
  selectedEXPCurve: ExpCurve; // byte 46

  // Byte 2: types + general
  typesMod: TypesMod;
  raceMode: boolean;
  blockBrokenMoves: boolean;
  limitPokemon: boolean;
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
  weighDuplicateAbilitiesTogether: boolean; // byte 40
  ensureTwoAbilities: boolean; // byte 48

  // Byte 4: starters
  startersMod: StartersMod;
  customStarters: [number, number, number];
  randomizeStartersHeldItems: boolean;
  banBadRandomStarterHeldItems: boolean;
  allowStarterAltFormes: boolean;

  // Byte 11-12: movesets
  movesetsMod: MovesetsMod;
  startWithGuaranteedMoves: boolean;
  guaranteedMoveCount: number;
  reorderDamagingMoves: boolean;
  movesetsForceGoodDamaging: boolean;
  movesetsGoodDamagingPercent: number;
  blockBrokenMovesetMoves: boolean; // byte 39
  evolutionMovesForAll: boolean; // byte 41

  // Byte 13-14: trainers
  trainersMod: TrainersMod;
  trainersForceFullyEvolved: boolean;
  trainersForceFullyEvolvedLevel: number;
  trainersLevelModified: boolean;
  trainersLevelModifier: number;
  eliteFourUniquePokemonNumber: number;
  additionalBossTrainerPokemon: number;
  additionalImportantTrainerPokemon: number;
  additionalRegularTrainerPokemon: number;
  doubleBattleMode: boolean;

  // Byte 27: trainer misc
  trainersUsePokemonOfSimilarStrength: boolean;
  rivalCarriesStarterThroughout: boolean;
  trainersMatchTypingDistribution: boolean;
  trainersBlockLegendaries: boolean;
  trainersBlockEarlyWonderGuard: boolean;
  swapTrainerMegaEvos: boolean;
  shinyChance: boolean;
  betterTrainerMovesets: boolean;
  allowTrainerAlternateFormes: boolean; // byte 39

  // Trainer held items (byte 48)
  randomizeHeldItemsForBossTrainerPokemon: boolean;
  randomizeHeldItemsForImportantTrainerPokemon: boolean;
  randomizeHeldItemsForRegularTrainerPokemon: boolean;
  consumableItemsOnlyForTrainerPokemon: boolean;
  sensibleItemsOnlyForTrainerPokemon: boolean;
  highestLevelOnlyGetsItemsForTrainerPokemon: boolean;

  // Byte 15-16: wild pokemon
  wildPokemonMod: WildPokemonMod;
  wildPokemonRestrictionMod: WildPokemonRestrictionMod;
  useTimeBasedEncounters: boolean;
  blockWildLegendaries: boolean;
  useMinimumCatchRate: boolean;
  minimumCatchRateLevel: number;
  randomizeWildPokemonHeldItems: boolean;
  banBadRandomWildPokemonHeldItems: boolean;
  balanceShakingGrass: boolean;
  wildLevelsModified: boolean;
  wildLevelModifier: number;
  allowWildAltFormes: boolean; // byte 39

  // Byte 17: static pokemon
  staticPokemonMod: StaticPokemonMod;
  allowStaticAltFormes: boolean;
  swapStaticMegaEvos: boolean;
  staticLevelModified: boolean;
  staticLevelModifier: number;
  correctStaticMusic: boolean;
  limitMainGameLegendaries: boolean;
  limit600: boolean;

  // Bytes 18-20: TMs
  tmsMod: TMsMod;
  tmsHmsCompatibilityMod: TMsHMsCompatibilityMod;
  tmLevelUpMoveSanity: boolean;
  keepFieldMoveTMs: boolean;
  fullHMCompat: boolean;
  tmsForceGoodDamaging: boolean;
  tmsGoodDamagingPercent: number;
  blockBrokenTMMoves: boolean; // byte 39
  tmsFollowEvolutions: boolean;

  // Bytes 21-22: tutors
  moveTutorMovesMod: MoveTutorMovesMod;
  moveTutorsCompatibilityMod: MoveTutorsCompatibilityMod;
  tutorLevelUpMoveSanity: boolean;
  keepFieldMoveTutors: boolean;
  tutorsForceGoodDamaging: boolean;
  tutorsGoodDamagingPercent: number;
  blockBrokenTutorMoves: boolean; // byte 39
  tutorFollowEvolutions: boolean;

  // Byte 23: in-game trades
  inGameTradesMod: InGameTradesMod;
  randomizeInGameTradesItems: boolean;
  randomizeInGameTradesIVs: boolean;
  randomizeInGameTradesNicknames: boolean;
  randomizeInGameTradesOTs: boolean;

  // Byte 24: field items
  fieldItemsMod: FieldItemsMod;
  banBadRandomFieldItems: boolean;

  // Byte 25: move randomizers
  randomizeMovePowers: boolean;
  randomizeMoveAccuracies: boolean;
  randomizeMovePPs: boolean;
  randomizeMoveTypes: boolean;
  randomizeMoveCategory: boolean;
  updateMovesToGeneration: number; // byte 45

  // Byte 26: evolutions
  evolutionsMod: EvolutionsMod;
  evosSimilarStrength: boolean;
  evosSameTyping: boolean;
  evosMaxThreeStages: boolean;
  evosForceChange: boolean;
  evosAllowAltFormes: boolean;

  // Bytes 28-31: restrictions (0 = none)
  currentRestrictions: number;

  // Bytes 32-35: misc tweaks (bitmask)
  currentMiscTweaks: number;

  // Byte 37: shop items
  shopItemsMod: ShopItemsMod;
  banBadRandomShopItems: boolean;
  banRegularShopItems: boolean;
  banOPShopItems: boolean;
  balanceShopPrices: boolean;
  guaranteeEvolutionItems: boolean;
  guaranteeXItems: boolean; // byte 41

  // Bytes 41-43: totem pokemon (mainly Gen 7)
  totemPokemonMod: TotemPokemonMod;
  allyPokemonMod: AllyPokemonMod;
  auraMod: AuraMod;
  randomizeTotemHeldItems: boolean;
  totemLevelsModified: boolean;
  totemLevelModifier: number;
  allowTotemAltFormes: boolean;

  // Byte 49: pickup items
  pickupItemsMod: PickupItemsMod;
  banBadRandomPickupItems: boolean;
  banIrregularAltFormes: boolean;

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

    baseStatsFollowEvolutions: false,
    baseStatisticsMod: "UNCHANGED",
    standardizeEXPCurves: false,
    updateBaseStats: false,
    baseStatsFollowMegaEvolutions: false,
    assignEvoStatsRandomly: false,
    updateBaseStatsToGeneration: 0,
    expCurveMod: "LEGENDARIES",
    selectedEXPCurve: "MEDIUM_FAST",

    typesMod: "UNCHANGED",
    raceMode: false,
    blockBrokenMoves: false,
    limitPokemon: false,
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

    movesetsMod: "UNCHANGED",
    startWithGuaranteedMoves: false,
    guaranteedMoveCount: 2,
    reorderDamagingMoves: false,
    movesetsForceGoodDamaging: false,
    movesetsGoodDamagingPercent: 0,
    blockBrokenMovesetMoves: false,
    evolutionMovesForAll: false,

    trainersMod: "UNCHANGED",
    trainersForceFullyEvolved: false,
    trainersForceFullyEvolvedLevel: 30,
    trainersLevelModified: false,
    trainersLevelModifier: 0,
    eliteFourUniquePokemonNumber: 0,
    additionalBossTrainerPokemon: 0,
    additionalImportantTrainerPokemon: 0,
    additionalRegularTrainerPokemon: 0,
    doubleBattleMode: false,
    trainersUsePokemonOfSimilarStrength: false,
    rivalCarriesStarterThroughout: false,
    trainersMatchTypingDistribution: false,
    trainersBlockLegendaries: true,
    trainersBlockEarlyWonderGuard: true,
    swapTrainerMegaEvos: false,
    shinyChance: false,
    betterTrainerMovesets: false,
    allowTrainerAlternateFormes: false,
    randomizeHeldItemsForBossTrainerPokemon: false,
    randomizeHeldItemsForImportantTrainerPokemon: false,
    randomizeHeldItemsForRegularTrainerPokemon: false,
    consumableItemsOnlyForTrainerPokemon: false,
    sensibleItemsOnlyForTrainerPokemon: false,
    highestLevelOnlyGetsItemsForTrainerPokemon: false,

    wildPokemonMod: "UNCHANGED",
    wildPokemonRestrictionMod: "NONE",
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

    currentRestrictions: 0,
    currentMiscTweaks: 0,

    shopItemsMod: "UNCHANGED",
    banBadRandomShopItems: false,
    banRegularShopItems: false,
    banOPShopItems: false,
    balanceShopPrices: false,
    guaranteeEvolutionItems: false,
    guaranteeXItems: false,

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

    romName: "",
  };
}

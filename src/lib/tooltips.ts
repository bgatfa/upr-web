// Tooltip descriptions extracted from UPR-ZX Bundle.properties
export const tooltips: Record<string, string> = {
  // ── General ───────────────────────────────────────────────────────────────
  raceMode:
    "Enables features useful for a speedrun race. Log file saving is disabled and a check value is generated — share it with other racers to confirm everyone has the same ROM.",
  limitPokemon:
    "Allows you to restrict which Pokemon are used in randomization. If unchecked, all Pokemon are eligible.",
  noIrregularAltFormes:
    "Bans \"irregular\" alternate formes (Mega Evolutions, in-battle transformations like Darmanitan-Z, Zygarde-C, and Fusion Pokemon) from the Pokemon pool. These formes can still be accessed through their regular in-game means.",

  // ── Base Stats ────────────────────────────────────────────────────────────
  baseStatsMod:
    "Controls how Pokemon base stats are handled.\n• Unchanged: no changes\n• Shuffle: swap stats around (Attack↔Sp.Atk etc.) without changing the total\n• Random: randomize stats within the original base stat total — evolutions are independent unless Follow Evolutions is on",
  standardizeEXPCurves:
    "Changes every Pokemon's EXP curve to the selected curve, except those forced to use Slow. This makes leveling more consistent and enables more evolution options when randomizing evos. Medium Fast and Medium Slow are recommended.",
  updateBaseStats:
    "Updates base stats of Pokemon to their values in the chosen generation. Does not add new Pokemon or split Special Attack/Defense in Gen 1.",
  baseStatsFollowEvolutions:
    "When stats are shuffled or randomized, evolutions inherit from their base form's rolls. Shuffle: same stat reordering. Random: same proportion of stats.",

  // ── Types ─────────────────────────────────────────────────────────────────
  typesMod:
    "Controls Pokemon type randomization.\n• Unchanged: no changes\n• Random (Follow Evos): evolutions mostly copy the base Pokemon's types\n• Completely Random: each evolution is independent — types may change every stage",
  forceDualType:
    "Forces all Pokemon to have two types when types are randomized.",

  // ── Abilities ─────────────────────────────────────────────────────────────
  abilitiesMod:
    "Controls Pokemon ability randomization.\n• Unchanged: no changes\n• Random: each Pokemon gets new random abilities; Pokemon like Shedinja keep Wonder Guard",
  allowWonderGuard:
    "Allows Wonder Guard to be chosen as any Pokemon's ability. This can lead to very overpowered/broken Pokemon. USE WITH CAUTION!",
  abilitiesFollowEvolutions:
    "When abilities are randomized, non-split evolutions inherit the base Pokemon's random abilities.",
  banTrappingAbilities:
    "Bans Arena Trap, Magnet Pull and Shadow Tag from randomized abilities. Pokemon that originally have these abilities will still have them randomized.",
  banNegativeAbilities:
    "Bans purely negative abilities (Defeatist, Slow Start, Truant, Klutz, Stall) from randomization. Pokemon that originally have these abilities will still be randomized.",
  banBadAbilities:
    "Bans weak/situational abilities (Minus, Plus, Anticipation, Frisk, Honey Gather, etc.) from randomization.",
  weighDuplicateAbilities:
    "Treats abilities with identical effects (e.g. Insomnia/Vital Spirit, Huge Power/Pure Power) as the same ability for probability purposes. All variants can still appear.",
  ensureTwoAbilities:
    "Ensures every Pokemon has two distinct abilities when abilities are randomized.",

  // ── Evolutions ────────────────────────────────────────────────────────────
  evolutionsMod:
    "Controls evolution randomization.\n• Unchanged: no changes\n• Random: randomize evolution targets (EXP curves must match)\n• Random (Every Level): forces evolutions at every level; loops are expected",
  evolutionsSimilarStrength:
    "Randomized evolutions prefer Pokemon with a similar BST to the original target. Lower precedence than other modifiers.",
  evolutionsSameType:
    "Randomized evolutions share at least one type with the source Pokemon where possible.",
  evolutionsMaxThreeStages:
    "Prevents evolution chains longer than three stages from being created.",
  evolutionsForceChange:
    "Every evolution is randomized to something different from the original.",
  changeImpossibleEvos:
    "Changes trade evolutions and other evolutions impossible to achieve in the current game (no trading, missing locations/contests/time of day). Takes effect even if evolutions aren't randomized.",
  makeEvolutionsEasier:
    "Pokemon that evolve at very high levels will evolve earlier (final stage by level 40, middle stage by level 30). Friendship evolutions trigger at 160 happiness instead of 220. Takes effect even if evolutions aren't randomized.",
  removeTimeBasedEvos:
    "Time-of-day evolutions now work regardless of in-game time. Split time-based evolutions (Eevee→Espeon/Umbreon, Rockruff→Lycanroc) become stone evolutions.",
  allowAltFormesEvolutions:
    "Allows Pokemon to evolve into alternate formes, including regional variants.",

  // ── Starters ──────────────────────────────────────────────────────────────
  startersMod:
    "Controls starter Pokemon.\n• Unchanged: no changes\n• Custom: pick your own starters\n• Random: 3 random starters\n• Random (2 Evos): starters must have 2 evolution stages like regular starters",
  randomizeStarterHeldItems:
    "Randomizes the items held by starters where possible. In Gen 2, each starter gets an individual item. In Gen 3, all starters share the same item.",
  banBadStarterHeldItems:
    "Removes bad items (berries, mail, etc.) from the possible random starter held items pool.",
  allowStarterAltFormes:
    "Allows alternate formes of Pokemon (Rotom formes, Deoxys formes, etc.) to appear as starter Pokemon.",

  // ── Static Pokemon ────────────────────────────────────────────────────────
  staticPokemonMod:
    "Controls static Pokemon (one-time encounters, gifts, purchases).\n• Unchanged: no changes\n• Random (Match BST): legendary→legendary, non-legendary→non-legendary; Ultra Beasts→Ultra Beasts\n• Completely Random: any Pokemon can replace any other\n• Similar Strength: replace with a Pokemon of similar power",
  limitMainGameLegendaries:
    "Sets an upper BST limit on main-game Legendary Pokemon and widens the 'Similar Strength' window. Applies only to catchable legendaries directly in the player's path.",
  limit600:
    "Enforces pure random on all static Pokemon with 600+ BST.",
  allowStaticAltFormes:
    "Allows alternate formes to appear as Static Pokemon.",
  swapStaticMegaEvos:
    "Swaps Static Pokemon capable of Mega Evolution for another Mega-capable Pokemon (e.g. Lucario in XY, Latios/Latias in ORAS).",
  correctStaticMusic:
    "Fixes music for all Static Pokemon encounters — encounters with special music will still play the correct song even after randomization.",
  staticLevelModified:
    "Enables a percentage-based modifier on Static Pokemon levels.",
  "totemPokemonMod.UNCHANGED":
    "Don't change Totem Pokemon species.",
  "totemPokemonMod.RANDOM":
    "Randomize Totem Pokemon species.",
  "totemPokemonMod.SIMILAR_STRENGTH":
    "Replace every Totem Pokemon with a Pokemon of similar strength.",
  "allyPokemonMod.UNCHANGED":
    "Don't change Ally Pokemon.",
  "allyPokemonMod.RANDOM":
    "Randomize Ally Pokemon completely.",
  "allyPokemonMod.SIMILAR_STRENGTH":
    "Replace Ally Pokemon with Pokemon of similar strength.",
  "auraMod.UNCHANGED":
    "Don't change auras.",
  "auraMod.RANDOM":
    "Auras will be completely randomized. The possible auras are +1/+2/+3 to a single stat or to every stat.",
  "auraMod.SAME_STRENGTH":
    "Auras will be randomized to auras with the same net gain of stages. For example, +2 Speed could become +2 Defense.",
  randomizeTotemHeldItems:
    "Replace Totem Pokemon held items with different consumable items.",
  allowTotemAltFormes:
    "Allows alternate formes of Pokemon to appear as Totem and Ally Pokemon.",
  totemLevelsModified:
    "Enables a percentage-based level modifier for every Totem and Ally Pokemon.",

  // ── In-Game Trades ────────────────────────────────────────────────────────
  inGameTradesMod:
    "Controls in-game trade randomization.\n• Unchanged: no changes\n• Randomize Given: randomize what you receive; the NPC's request stays the same\n• Randomize Given & Requested: randomize both sides of every trade",
  randomizeInGameTradesNicknames:
    "Randomizes the nicknames of Pokemon received from trades (chosen from a predefined list).",
  randomizeInGameTradesOTs:
    "Randomizes the Original Trainer name and ID of traded Pokemon.",
  randomizeInGameTradesIVs:
    "Randomizes the IVs of Pokemon received from in-game trades (most have fixed IVs normally).",
  randomizeInGameTradesItems:
    "Gives each Pokemon received from a trade a random held item, including trades that normally don't give one.",

  // ── Move Data ─────────────────────────────────────────────────────────────
  randomizeMovePowers:
    "Randomizes the power of normal damaging moves to a value generally between 20 and 150. Non-damaging and variable-power moves are unaffected. NOTE: Gen 1 has no in-game display for updated powers.",
  randomizeMoveAccuracies:
    "Randomizes the accuracy of most moves. Restrictions prevent absurd outcomes like 100% accurate OHKOs. Sure-hit moves are not changed. NOTE: Gen 1 has no in-game display for updated accuracies.",
  randomizeMovePPs:
    "Randomizes PP to a multiple of 5 between 5 and 40 inclusive.",
  randomizeMoveTypes:
    "Randomizes the type of most moves. Has little effect on pure status moves; may have odd side-effects in Gen 1.",
  randomizeMoveCategory:
    "Randomizes damaging moves between Physical and Special. Status moves are unaffected. Not available for Gen 1-3 — this does NOT add the Physical/Special split.",
  updateMoves:
    "Updates move stats (power, accuracy, etc.) to their values in the chosen generation. Does not add the Fairy type. Move type changes to Fairy keep their Gen 5 type. Only affects stats, not secondary effects.",

  // ── Movesets ──────────────────────────────────────────────────────────────
  movesetsMod:
    "Controls level-up moveset randomization.\n• Unchanged: no changes\n• Random (Prefer Same Type): prefer moves matching the Pokemon's type; each Pokemon gets at least one accurate damaging move\n• Completely Random: ignore type; each Pokemon gets at least one accurate damaging move\n• Metronome Only: every Pokemon's only move is Metronome (PP boosted to 40)",
  reorderDamagingMoves:
    "Reorders randomized movesets so weaker damaging moves are learned before stronger ones. Non-damaging move positions are unchanged.",
  blockBrokenMovesetMoves:
    "Stops game-breaking moves (Dragon Rage, SonicBoom, OHKO moves in Gen 1; SonicBoom and Dragon Rage in Gen 2+) from appearing in randomized movesets.",
  evolutionMovesForAll:
    "Every Pokemon learns a move upon evolution. Use carefully with Sun/Moon 1.0 — a glitch can cause only the evolution move to be learned if both are triggered on the same level.",
  startWithGuaranteedMoves:
    "Ensures every Pokemon has the specified number of moves at level 1, instead of their normal starting move count. Setting this to 4 means every Pokemon you catch has a full moveset.",
  movesetsForceGoodDamaging:
    "Forces a specified percentage of randomized movesets to include at least one good damaging move. Other moves can still be randomly selected as damaging.",

  // ── TMs / HMs ─────────────────────────────────────────────────────────────
  tmsMod:
    "Controls TM/HM move randomization.\n• Unchanged: no changes\n• Random: randomize what moves TMs/HMs teach",
  tmLevelUpMoveSanity:
    "When TMs are randomized, prevents a TM from teaching a move that a Pokemon could learn by level-up.",
  keepFieldMoveTMs:
    "Keeps HM-equivalent field moves (Surf, Cut, Fly, etc.) on their original TM/HM slots.",
  blockBrokenTMMoves:
    "Prevents game-breaking moves from being assigned to TMs.",
  tmsForceGoodDamaging:
    "Forces a percentage of TMs to be good damaging moves.",
  tmsHmsCompatibilityMod:
    "Controls which Pokemon can learn TMs/HMs.\n• Unchanged: no changes\n• Random (Type): prefer compatibility with the Pokemon's type\n• Completely Random: ignore type\n• Full: every Pokemon can learn every TM/HM",
  fullHMCompat:
    "Makes every Pokemon compatible with all HMs, regardless of TM compatibility settings.",
  tmsFollowEvolutions:
    "When TM compatibility is randomized, evolutions inherit the base Pokemon's TM compatibility. When evolving, each TM has a 90% chance (type-preferring) or 25% chance (random) of becoming learnable.",

  // ── Move Tutors ───────────────────────────────────────────────────────────
  moveTutorMovesMod:
    "Controls Move Tutor move randomization.\n• Unchanged: no changes\n• Random: randomize which moves tutors teach",
  tutorLevelUpMoveSanity:
    "When tutors are randomized, prevents a tutor from teaching a move that a Pokemon could learn by level-up.",
  keepFieldMoveTutors:
    "Keeps field move tutors (Surf, Fly, etc.) on their original slots.",
  blockBrokenTutorMoves:
    "Prevents game-breaking moves from being assigned to tutors.",
  tutorsForceGoodDamaging:
    "Forces a percentage of tutor moves to be good damaging moves.",
  moveTutorsCompatibilityMod:
    "Controls which Pokemon can learn Move Tutor moves.\n• Unchanged: no changes\n• Random (Type): prefer the Pokemon's type\n• Completely Random: ignore type\n• Full: every Pokemon can learn every tutor move",
  tutorFollowEvolutions:
    "When tutor compatibility is randomized, evolutions inherit the base Pokemon's tutor compatibility.",

  // ── Trainers ──────────────────────────────────────────────────────────────
  trainersMod:
    "Controls Trainer Pokemon randomization.\n• Unchanged: no changes\n• Random: completely random\n• Random (Distributed): distribute Pokemon evenly across all trainers\n• Main Playthrough: distribute evenly among main-game trainers only (Gen 5)\n• Type Themed: each trainer uses a single type\n• Type Themed (E4+Gyms): only Elite Four and Gym Leaders are type-themed",
  trainersUsePokemonOfSimilarStrength:
    "Random Pokemon replacing a trainer's Pokemon will be of similar power to the original.",
  rivalCarriesStarterThroughout:
    "The rival/friend's starter tracks their entire team throughout the game.",
  trainersMatchTypingDistribution:
    "Attempts to match the typing distribution of the original trainer's team.",
  trainersBlockLegendaries:
    "Prevents Legendary Pokemon from appearing on Trainer teams.",
  trainersBlockEarlyWonderGuard:
    "Prevents Wonder Guard from being given to early-game Trainer Pokemon.",
  betterTrainerMovesets:
    "Gives Trainer Pokemon better movesets by including TM/tutor/egg/pre-evo moves and picking moves that synergize with the Pokemon's ability, stats, and other moves.",
  swapTrainerMegaEvos:
    "Swaps Trainer Pokemon that hold Mega Stones for another Mega-capable Pokemon (e.g. Diantha's Gardevoir). Has no effect if 'Limit Pokemon' removes all Mega Evolutions.",
  doubleBattleMode:
    "Sets all Trainer battles to double battles (first rival battle excluded). Note: entering with a single Pokemon causes generation-dependent quirks.",
  shinyChance:
    "Gives a 1/256 chance of each Trainer Pokemon being shiny.",
  allowTrainerAlternateFormes:
    "Allows alternate formes to appear on Trainer teams.",
  additionalBossTrainerPokemon:
    "Add extra Pokemon to Boss Trainers (Gym Leaders, Kahunas, Team Leaders, Elite Four, Champions). Trainers will not exceed 6 total Pokemon.",
  additionalImportantTrainerPokemon:
    "Add extra Pokemon to Important Trainers (Rivals, Team Admins, key story battles). Trainers will not exceed 6 total Pokemon.",
  additionalRegularTrainerPokemon:
    "Add extra Pokemon to regular Trainers. Trainers will not exceed 6 total Pokemon.",
  trainersForceFullyEvolved:
    "Forces Trainer Pokemon above a certain level to be fully evolved.",
  trainersLevelModified:
    "Applies a percentage modifier to all Trainer Pokemon levels.",
  randomizeHeldItemsForBossTrainerPokemon:
    "Adds or replaces held items for Boss Trainer Pokemon (Gym Leaders, Elite Four, Champions, etc.).",
  randomizeHeldItemsForImportantTrainerPokemon:
    "Adds or replaces held items for Important Trainer Pokemon (Rivals, Team Admins, key story battles).",
  randomizeHeldItemsForRegularTrainerPokemon:
    "Adds or replaces held items for regular Trainer Pokemon.",
  consumableItemsOnlyForTrainerPokemon:
    "Only consumable items (berries, one-use held items) will be given to Trainer Pokemon.",
  sensibleItemsOnlyForTrainerPokemon:
    "Only items that make sense for the Pokemon's type/stats will be given.",
  highestLevelOnlyGetsItemsForTrainerPokemon:
    "Only the highest-level Pokemon on each Trainer's team receives a held item.",
  eliteFourUniquePokemonNumber:
    "Ensures Elite Four members (and Champion/final boss) each have the specified number of unique Pokemon that appear nowhere else. The highest-level Pokemon on each team are the ones made unique.",

  // ── Wild Pokemon ──────────────────────────────────────────────────────────
  wildPokemonMod:
    "Controls Wild Pokemon randomization.\n• Unchanged: no changes\n• Random: completely random\n• Area Mapping: each species maps 1:1 to another species within the same area\n• Global Mapping: each species maps 1:1 to another species globally",
  wildPokemonRestrictionMod:
    "Additional restriction on Wild Pokemon.\n• None: no restriction\n• Catch 'Em All: ensures every Pokemon is available somewhere in the wild\n• Type Theme Areas: each area has a consistent type theme\n• Similar Strength: replacements have similar BST",
  blockWildLegendaries:
    "Prevents Legendary Pokemon from appearing in the wild.",
  useTimeBasedEncounters:
    "Preserves day/night/time-based encounter slots when randomizing.",
  balanceShakingGrass:
    "Balances the Pokemon found in shaking grass/rippling water/dust clouds.",
  allowWildAltFormes:
    "Allows alternate formes to appear as wild Pokemon.",
  randomizeWildPokemonHeldItems:
    "Randomizes the held items of wild Pokemon.",
  banBadRandomWildPokemonHeldItems:
    "Removes bad held items from the wild Pokemon held item pool.",
  useMinimumCatchRate:
    "Sets a minimum catch rate for all wild Pokemon. Level 1: ~10% chance. Level 5: guaranteed catches.",
  wildLevelsModified:
    "Applies a percentage modifier to wild Pokemon levels.",

  // ── Field Items ───────────────────────────────────────────────────────────
  fieldItemsMod:
    "Controls items found on the ground/in item balls.\n• Unchanged: no changes\n• Shuffle: shuffle existing items among locations\n• Random: random items at each location\n• Random (Even Distribution): random with balanced distribution",
  banBadRandomFieldItems:
    "Removes bad items from the random field item pool.",

  // ── Shop Items ────────────────────────────────────────────────────────────
  shopItemsMod:
    "Controls items sold in Poke Marts.\n• Unchanged: no changes\n• Shuffle: shuffle existing shop items\n• Random: random items in each shop",
  banBadRandomShopItems:
    "Removes bad items from the random shop item pool.",
  banRegularShopItems:
    "Prevents common regular shop items (Potions, Pokeballs, etc.) from appearing in randomized shops.",
  banOPShopItems:
    "Prevents overpowered items (Master Ball, Rare Candy, etc.) from appearing in randomized shops.",
  balanceShopPrices:
    "Adjusts shop prices to be more balanced after randomization.",
  guaranteeEvolutionItems:
    "Guarantees that all evolution items (Thunder Stone, Link Cable, etc.) are available in at least one shop.",
  guaranteeXItems:
    "Guarantees that X Items (X Attack, X Defense, etc.) are available in at least one shop.",

  // ── Pickup Items ──────────────────────────────────────────────────────────
  pickupItemsMod:
    "Controls items found via the Pickup ability.\n• Unchanged: no changes\n• Random: randomize the Pickup item table",
  banBadRandomPickupItems:
    "Removes bad items from the random Pickup item pool.",
};

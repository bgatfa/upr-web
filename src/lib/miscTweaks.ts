export interface MiscTweakOption {
  bit: number;
  key: string;
  label: string;
  tooltip: string;
}

export const miscTweakOptions: MiscTweakOption[] = [
  {
    bit: 1 << 0,
    key: "bw-exp-patch",
    label: "B/W Exp Patch",
    tooltip: "Patch the game to use the Black/White EXP system. Available only for some games.",
  },
  {
    bit: 1 << 1,
    key: "nerf-x-accuracy",
    label: "Nerf X Accuracy",
    tooltip: "Stops X Accuracy from enabling broken sleep, trapping, and OHKO setups in Gen 1.",
  },
  {
    bit: 1 << 2,
    key: "fix-crit-rate",
    label: "\"Fix\" Crit Rate",
    tooltip: "Changes Gen 1 critical hit behavior to work more like later games.",
  },
  {
    bit: 1 << 3,
    key: "fastest-text",
    label: "Fastest Text",
    tooltip: "Makes text display at minimum delay regardless of the in-game text speed option.",
  },
  {
    bit: 1 << 4,
    key: "running-shoes-indoors",
    label: "Running Shoes Indoors",
    tooltip: "Allows Running Shoes indoors.",
  },
  {
    bit: 1 << 5,
    key: "pc-potion",
    label: "Randomize PC Potion",
    tooltip: "Randomizes the starting PC Potion into another useful item.",
  },
  {
    bit: 1 << 6,
    key: "pikachu-evo",
    label: "Allow Pikachu Evolution",
    tooltip: "Lets Pikachu evolve with a Thunder Stone in games where it normally cannot.",
  },
  {
    bit: 1 << 7,
    key: "national-dex",
    label: "Give National Dex at Start",
    tooltip: "Gives the National Dex at the start. This is especially useful in FRLG.",
  },
  {
    bit: 1 << 8,
    key: "fast-egg-hatching",
    label: "Fast Egg Hatching",
    tooltip: "FVX placeholder slot. Currently unused — replaced by the new Type Effectiveness setting on the Pokemon Traits tab.",
  },
  {
    bit: 1 << 9,
    key: "challenge-mode",
    label: "Force Challenge Mode",
    tooltip: "Forces Challenge Mode in games that support it.",
  },
  {
    bit: 1 << 10,
    key: "lower-case-names",
    label: "Lower Case Pokemon Names",
    tooltip: "Converts Pokemon names from all-caps to Camel Case.",
  },
  {
    bit: 1 << 11,
    key: "catching-tutorial",
    label: "Randomize Catching Tutorial",
    tooltip: "Randomizes the Pokemon used during the catching tutorial.",
  },
  {
    bit: 1 << 12,
    key: "ban-lucky-egg",
    label: "Ban Lucky Egg",
    tooltip: "Prevents Lucky Egg from appearing as a randomized item.",
  },
  {
    bit: 1 << 13,
    key: "no-free-lucky-egg",
    label: "No Free Lucky Egg",
    tooltip: "Removes the free Lucky Egg gift in the games that normally give one.",
  },
  {
    bit: 1 << 14,
    key: "ban-big-money-items",
    label: "Ban Big Money Maniac Items",
    tooltip: "Prevents high-value maniac items from appearing as randomized items.",
  },
  {
    bit: 1 << 15,
    key: "sos-battles",
    label: "All Wild Pokemon Can Call Allies",
    tooltip: "Allows every wild Pokemon to call allies in games with SOS battles.",
  },
  {
    bit: 1 << 16,
    key: "balance-static-levels",
    label: "Balance Static Pokemon Levels",
    tooltip: "Balances levels of some static Pokemon. Upstream notes this mainly affects specific games.",
  },
  {
    bit: 1 << 17,
    key: "retain-alt-formes",
    label: "Don't Revert Temporary Alt Formes",
    tooltip: "Keeps certain alternate formes from reverting after reset or battle.",
  },
  {
    bit: 1 << 18,
    key: "run-without-shoes",
    label: "Run Without Running Shoes",
    tooltip: "Lets the player run before obtaining Running Shoes.",
  },
  {
    bit: 1 << 19,
    key: "faster-hp-exp-bars",
    label: "Faster HP and EXP Bars",
    tooltip: "Speeds up battle HP and EXP bar scrolling.",
  },
  {
    bit: 1 << 20,
    key: "fast-distortion-world",
    label: "Fast Distortion World",
    tooltip: "Skips most of the Distortion World sequence in games where it exists.",
  },
  {
    bit: 1 << 21,
    key: "rotom-typing",
    label: "Update Rotom Appliance Typings",
    tooltip: "Updates Rotom appliance formes to their later-generation typings.",
  },
  {
    bit: 1 << 22,
    key: "disable-low-hp-music",
    label: "Disable Low HP Music",
    tooltip: "Prevents low-HP battle music from overriding the current track.",
  },
  {
    bit: 1 << 23,
    key: "reusable-tms",
    label: "Reusable TMs",
    tooltip: "TMs are not consumed when used, matching Gen 5+ behavior. Available in games that originally had single-use TMs.",
  },
  {
    bit: 1 << 24,
    key: "forgettable-hms",
    label: "Forgettable HMs",
    tooltip: "Allows HM moves to be forgotten through normal means, without needing a Move Deleter.",
  },
];

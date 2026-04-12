export interface ParsedGenRestrictions {
  generations: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, boolean>;
  allowEvolutionaryRelatives: boolean;
}

const GEN_BITS: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, number> = {
  1: 1 << 0,
  2: 1 << 1,
  3: 1 << 2,
  4: 1 << 3,
  5: 1 << 4,
  6: 1 << 5,
  7: 1 << 6,
};

const EVOLUTIONARY_RELATIVES_BIT = 1 << 7;

export function parseGenRestrictions(mask: number): ParsedGenRestrictions {
  return {
    generations: {
      1: (mask & GEN_BITS[1]) !== 0,
      2: (mask & GEN_BITS[2]) !== 0,
      3: (mask & GEN_BITS[3]) !== 0,
      4: (mask & GEN_BITS[4]) !== 0,
      5: (mask & GEN_BITS[5]) !== 0,
      6: (mask & GEN_BITS[6]) !== 0,
      7: (mask & GEN_BITS[7]) !== 0,
    },
    allowEvolutionaryRelatives: (mask & EVOLUTIONARY_RELATIVES_BIT) !== 0,
  };
}

export function encodeGenRestrictions(parsed: ParsedGenRestrictions): number {
  let mask = 0;

  for (const generation of [1, 2, 3, 4, 5, 6, 7] as const) {
    if (parsed.generations[generation]) {
      mask |= GEN_BITS[generation];
    }
  }

  if (parsed.allowEvolutionaryRelatives) {
    mask |= EVOLUTIONARY_RELATIVES_BIT;
  }

  return mask;
}

export function generationRestrictionMask(maxGeneration: number | null): number {
  if (maxGeneration === null || maxGeneration >= 7) {
    return 0xff;
  }

  let mask = 0;
  for (const generation of [1, 2, 3, 4, 5, 6, 7] as const) {
    if (generation <= maxGeneration) {
      mask |= GEN_BITS[generation];
    }
  }

  return mask | EVOLUTIONARY_RELATIVES_BIT;
}

export function hasAnyGenerationSelected(mask: number): boolean {
  return (mask & 0x7f) !== 0;
}

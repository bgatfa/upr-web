import type { UPRSettings } from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { encodeGenRestrictions, hasAnyGenerationSelected, parseGenRestrictions } from "@/lib/genRestrictions";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  patch: (patch: Partial<UPRSettings>) => void;
  rom: RomProfile | null;
}

export function GeneralTab({ s, set, patch, rom }: Props) {
  const parsedRestrictions = parseGenRestrictions(s.currentRestrictions);
  const maxGeneration = rom?.generation ?? 7;
  const hasSelectedGenerations = hasAnyGenerationSelected(s.currentRestrictions);

  function updateGenerationRestriction(generation: 1 | 2 | 3 | 4 | 5 | 6 | 7, enabled: boolean) {
    const generations = {
      ...parsedRestrictions.generations,
      [generation]: enabled,
    };
    const nextHasSelectedGenerations = Object.values(generations).some(Boolean);

    patch({
      currentRestrictions: encodeGenRestrictions({
        ...parsedRestrictions,
        generations,
        allowEvolutionaryRelatives: nextHasSelectedGenerations
          ? parsedRestrictions.allowEvolutionaryRelatives
          : false,
      }),
    });
  }

  function updateEvolutionaryRelatives(enabled: boolean) {
    patch({
      currentRestrictions: encodeGenRestrictions({
        ...parsedRestrictions,
        allowEvolutionaryRelatives: enabled && hasSelectedGenerations,
      }),
    });
  }

  return (
    <div className="flex flex-col gap-0">

      <div className="panel">
        <span className="panel-title">General Options</span>
        <div className="field-row">
          <span className="checkbox-label">
            <input type="checkbox" checked={s.changeImpossibleEvolutions} onChange={e => set("changeImpossibleEvolutions", e.target.checked)} />
            Change Impossible Evolutions<Tooltip text={tooltips.changeImpossibleEvos} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.makeEvolutionsEasier} onChange={e => set("makeEvolutionsEasier", e.target.checked)} />
            Make Evolutions Easier<Tooltip text={tooltips.makeEvolutionsEasier} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.removeTimeBasedEvolutions} onChange={e => set("removeTimeBasedEvolutions", e.target.checked)} />
            Remove Time-Based Evolutions<Tooltip text={tooltips.removeTimeBasedEvos} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.raceMode} onChange={e => set("raceMode", e.target.checked)} />
            Race Mode<Tooltip text={tooltips.raceMode} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.blockBrokenMoves} onChange={e => set("blockBrokenMoves", e.target.checked)} />
            Block Broken Moves<Tooltip text={tooltips.blockBrokenMovesetMoves} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.banIrregularAltFormes} onChange={e => set("banIrregularAltFormes", e.target.checked)} />
            No Irregular Alt Formes<Tooltip text={tooltips.noIrregularAltFormes} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.limitPokemon} onChange={e => set("limitPokemon", e.target.checked)} />
            Limit Pokemon to Generation<Tooltip text={tooltips.limitPokemon} />
          </span>
        </div>
        {s.limitPokemon && (
          <div className="sub-row">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((generation) => {
                const gen = generation as 1 | 2 | 3 | 4 | 5 | 6 | 7;
                const available = generation <= maxGeneration;
                return (
                  <label key={generation} className={`checkbox-label ${available ? "" : "text-gray-400"}`}>
                    <input
                      type="checkbox"
                      checked={parsedRestrictions.generations[gen]}
                      disabled={!available}
                      onChange={(e) => updateGenerationRestriction(gen, e.target.checked)}
                    />
                    Gen {generation}
                  </label>
                );
              })}
              <label className={`checkbox-label col-span-2 ${hasSelectedGenerations ? "" : "text-gray-400"}`}>
                <input
                  type="checkbox"
                  checked={parsedRestrictions.allowEvolutionaryRelatives}
                  disabled={!hasSelectedGenerations}
                  onChange={(e) => updateEvolutionaryRelatives(e.target.checked)}
                />
                Include evolutionary relatives
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Select at least one generation.{rom?.generation ? ` This ROM supports up to Gen ${rom.generation}.` : ""}
            </p>
          </div>
        )}
      </div>

      <div className="panel">
        <span className="panel-title">Move & Stat Updates</span>
        <div className="field-row">
          <span className="checkbox-label">
            <input type="checkbox" checked={s.updateMoves} onChange={e => set("updateMoves", e.target.checked)} />
            Update Moves to Generation<Tooltip text={tooltips.updateMoves} />
          </span>
          {s.updateMoves && (
            <div className="flex items-center gap-1.5">
              <select className="select-field" value={s.updateMovesToGeneration}
                onChange={e => set("updateMovesToGeneration", Number(e.target.value))}>
                {[0, 5, 6, 7, 8].map(g => <option key={g} value={g}>{g === 0 ? "Latest" : `Gen ${g}`}</option>)}
              </select>
            </div>
          )}
          <span className="checkbox-label">
            <input type="checkbox" checked={s.updateMovesLegacy} onChange={e => set("updateMovesLegacy", e.target.checked)} />
            Update Moves (Legacy)<Tooltip text="Updates moves to Gen 5 stats instead of the latest generation. Intended for players who prefer the old move update behavior." />
          </span>
        </div>

        {/* Base stats update — sub-option when checked */}
        <div className="mt-2">
          <span className="checkbox-label">
            <input type="checkbox" checked={s.updateBaseStats} onChange={e => set("updateBaseStats", e.target.checked)} />
            Update Base Stats to Generation<Tooltip text={tooltips.updateBaseStats} />
          </span>
          {s.updateBaseStats && (
            <div className="sub-row">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-600">Generation:</span>
                <select className="select-field" value={s.updateBaseStatsToGeneration}
                  onChange={e => set("updateBaseStatsToGeneration", Number(e.target.value))}>
                  {[0, 6, 7, 8].map(g => <option key={g} value={g}>{g === 0 ? "Latest" : `Gen ${g}`}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <span className="panel-title">Trainer Names</span>
        <div className="field-row">
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeTrainerNames} onChange={e => set("randomizeTrainerNames", e.target.checked)} />
            Randomize Trainer Names
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeTrainerClassNames} onChange={e => set("randomizeTrainerClassNames", e.target.checked)} />
            Randomize Trainer Class Names
          </span>
        </div>
      </div>

    </div>
  );
}

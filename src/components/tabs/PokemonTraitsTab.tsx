import type {
  UPRSettings, BaseStatisticsMod, AbilitiesMod, SpeciesTypesMod,
  StartersTypeMod, PokemonType, PokemonPalettesMod, TypeEffectivenessMod,
} from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

const POKEMON_TYPES: PokemonType[] = [
  "NORMAL", "FIRE", "WATER", "GRASS", "ELECTRIC", "ICE",
  "FIGHTING", "POISON", "GROUND", "FLYING", "PSYCHIC", "BUG",
  "ROCK", "GHOST", "DRAGON", "DARK", "STEEL", "FAIRY",
];

const STARTERS_TYPE_MODS: { value: StartersTypeMod; label: string }[] = [
  { value: "NONE",             label: "No Constraint" },
  { value: "FIRE_WATER_GRASS", label: "Fire/Water/Grass" },
  { value: "TRIANGLE",         label: "Type Triangle" },
  { value: "UNIQUE",           label: "Unique Types" },
  { value: "SINGLE_TYPE",      label: "Single Type" },
];

export function PokemonTraitsTab({ s, set, rom }: Props) {
  const hasMegaEvolutions = rom?.hasMegaEvolutions ?? true;
  const supportsStarterHeldItems = rom?.supportsStarterHeldItems ?? true;
  const hasStarterAltFormes = rom?.hasStarterAltFormes ?? true;
  return (
    <div className="flex flex-col gap-0">

      {/* Base Stats */}
      <div className="panel">
        <span className="panel-title">Pokemon Base Statistics<Tooltip text={tooltips.baseStatsMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "SHUFFLE", "RANDOM"] as BaseStatisticsMod[]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="baseStats" checked={s.baseStatisticsMod === m}
                onChange={() => set("baseStatisticsMod", m)} />
              {m === "UNCHANGED" ? "Unchanged" : m === "SHUFFLE" ? "Shuffle" : "Random"}
            </span>
          ))}
        </div>

        {s.baseStatisticsMod !== "UNCHANGED" && (
          <div className="sub-options">
            <span className="checkbox-label">
              <input type="checkbox" checked={s.baseStatsFollowEvolutions} onChange={e => set("baseStatsFollowEvolutions", e.target.checked)} />
              Follow Evolutions<Tooltip text={tooltips.baseStatsFollowEvolutions} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.baseStatsFollowMegaEvolutions} disabled={!hasMegaEvolutions} onChange={e => set("baseStatsFollowMegaEvolutions", e.target.checked)} />
              Follow Mega Evolutions<Tooltip text="Mega Evolutions inherit their base form's stat rolls (same ordering for Shuffle, same proportions for Random)." />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.assignEvoStatsRandomly} onChange={e => set("assignEvoStatsRandomly", e.target.checked)} />
              Assign Evo Stats Randomly
            </span>
          </div>
        )}

        {/* EXP Curves — independent toggle */}
        <div className="mt-2">
          <span className="checkbox-label">
            <input type="checkbox" checked={s.standardizeEXPCurves} onChange={e => set("standardizeEXPCurves", e.target.checked)} />
            Standardize EXP Curves<Tooltip text={tooltips.standardizeEXPCurves} />
          </span>
          {s.standardizeEXPCurves && (
            <div className="sub-row">
              <span className="checkbox-label">
                <input type="radio" name="expCurve" checked={s.expCurveMod === "LEGENDARIES"}
                  onChange={() => set("expCurveMod", "LEGENDARIES")} />
                Legendaries Only<Tooltip text="All legendaries get the Slow EXP Curve." />
              </span>
              <span className="checkbox-label">
                <input type="radio" name="expCurve" checked={s.expCurveMod === "STRONG_LEGENDARIES"}
                  onChange={() => set("expCurveMod", "STRONG_LEGENDARIES")} />
                Strong Legendaries<Tooltip text="Strong legendaries (BST > 600) get the Slow EXP Curve." />
              </span>
              <span className="checkbox-label">
                <input type="radio" name="expCurve" checked={s.expCurveMod === "ALL"}
                  onChange={() => set("expCurveMod", "ALL")} />
                All Pokemon<Tooltip text="All Pokemon get the selected EXP Curve." />
              </span>
              <div className="flex items-center gap-1.5 mt-1 w-full">
                <span className="text-xs text-gray-500">EXP Curve:</span>
                <select className="select-field" value={s.selectedEXPCurve}
                  onChange={e => set("selectedEXPCurve", e.target.value as UPRSettings["selectedEXPCurve"])}>
                  {["MEDIUM_FAST", "ERRATIC", "FLUCTUATING", "MEDIUM_SLOW", "FAST", "SLOW"].map(c => (
                    <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Types */}
      <div className="panel">
        <span className="panel-title">Pokemon Types<Tooltip text={tooltips.typesMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "RANDOM_FOLLOW_EVOLUTIONS", "COMPLETELY_RANDOM"] as SpeciesTypesMod[]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="speciesTypesMod" checked={s.speciesTypesMod === m}
                onChange={() => set("speciesTypesMod", m)} />
              {m === "UNCHANGED" ? "Unchanged" : m === "RANDOM_FOLLOW_EVOLUTIONS" ? "Random (Follow Evolutions)" : "Completely Random"}
            </span>
          ))}
        </div>
        {s.speciesTypesMod !== "UNCHANGED" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.typesFollowMegaEvolutions} disabled={!hasMegaEvolutions} onChange={e => set("typesFollowMegaEvolutions", e.target.checked)} />
                Follow Mega Evolutions<Tooltip text="Mega Evolutions inherit their base form's randomized types." />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.dualTypeOnly} onChange={e => set("dualTypeOnly", e.target.checked)} />
                Dual Type Only<Tooltip text={tooltips.forceDualType} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Type Effectiveness (FVX) */}
      <div className="panel">
        <span className="panel-title">Type Effectiveness Chart<Tooltip text={tooltips.typeEffectivenessMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "RANDOM", "RANDOM_BALANCED", "KEEP_IDENTITIES", "INVERSE"] as TypeEffectivenessMod[]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="typeEffectivenessMod" checked={s.typeEffectivenessMod === m}
                onChange={() => set("typeEffectivenessMod", m)} />
              {m === "UNCHANGED" ? "Unchanged"
                : m === "RANDOM" ? "Random"
                : m === "RANDOM_BALANCED" ? "Random (Balanced)"
                : m === "KEEP_IDENTITIES" ? "Keep Identities"
                : "Inverse"}
            </span>
          ))}
        </div>
        {s.typeEffectivenessMod !== "UNCHANGED" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.updateTypeEffectiveness}
                  onChange={e => set("updateTypeEffectiveness", e.target.checked)} />
                Update to Modern Chart First<Tooltip text={tooltips.updateTypeEffectiveness} />
              </span>
              {s.typeEffectivenessMod === "INVERSE" && (
                <span className="checkbox-label">
                  <input type="checkbox" checked={s.inverseTypesRandomImmunities}
                    onChange={e => set("inverseTypesRandomImmunities", e.target.checked)} />
                  Randomize Inverse Immunities<Tooltip text={tooltips.inverseTypesRandomImmunities} />
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Abilities */}
      <div className="panel">
        <span className="panel-title">Pokemon Abilities<Tooltip text={tooltips.abilitiesMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "RANDOMIZE"] as AbilitiesMod[]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="abilitiesMod" checked={s.abilitiesMod === m}
                onChange={() => set("abilitiesMod", m)} />
              {m === "UNCHANGED" ? "Unchanged" : "Randomize"}
            </span>
          ))}
        </div>
        {s.abilitiesMod === "RANDOMIZE" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.allowWonderGuard} onChange={e => set("allowWonderGuard", e.target.checked)} />
                Allow Wonder Guard<Tooltip text={tooltips.allowWonderGuard} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.abilitiesFollowEvolutions} onChange={e => set("abilitiesFollowEvolutions", e.target.checked)} />
                Follow Evolutions<Tooltip text={tooltips.abilitiesFollowEvolutions} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.abilitiesFollowMegaEvolutions} disabled={!hasMegaEvolutions} onChange={e => set("abilitiesFollowMegaEvolutions", e.target.checked)} />
                Follow Mega Evolutions<Tooltip text="Non-split Mega Evolutions inherit the base Pokemon's random abilities." />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banTrappingAbilities} onChange={e => set("banTrappingAbilities", e.target.checked)} />
                Ban Trapping Abilities<Tooltip text={tooltips.banTrappingAbilities} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banNegativeAbilities} onChange={e => set("banNegativeAbilities", e.target.checked)} />
                Ban Negative Abilities<Tooltip text={tooltips.banNegativeAbilities} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banBadAbilities} onChange={e => set("banBadAbilities", e.target.checked)} />
                Ban Bad Abilities<Tooltip text={tooltips.banBadAbilities} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.weighDuplicateAbilitiesTogether} onChange={e => set("weighDuplicateAbilitiesTogether", e.target.checked)} />
                Weigh Duplicate Abilities Together<Tooltip text={tooltips.weighDuplicateAbilities} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.ensureTwoAbilities} onChange={e => set("ensureTwoAbilities", e.target.checked)} />
                Ensure Two Abilities<Tooltip text={tooltips.ensureTwoAbilities} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Evolutions */}
      <div className="panel">
        <span className="panel-title">Evolutions<Tooltip text={tooltips.evolutionsMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "RANDOM", "RANDOM_EVERY_LEVEL"] as UPRSettings["evolutionsMod"][]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="evolutionsMod" checked={s.evolutionsMod === m}
                onChange={() => set("evolutionsMod", m)} />
              {m === "UNCHANGED" ? "Unchanged" : m === "RANDOM" ? "Random" : "Random Every Level"}
            </span>
          ))}
        </div>
        {s.evolutionsMod !== "UNCHANGED" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.evosSimilarStrength} onChange={e => set("evosSimilarStrength", e.target.checked)} />
                Similar Strength<Tooltip text={tooltips.evolutionsSimilarStrength} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.evosSameTyping} onChange={e => set("evosSameTyping", e.target.checked)} />
                Same Typing<Tooltip text={tooltips.evolutionsSameType} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.evosMaxThreeStages} onChange={e => set("evosMaxThreeStages", e.target.checked)} />
                Max Three Stages<Tooltip text={tooltips.evolutionsMaxThreeStages} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.evosForceChange} onChange={e => set("evosForceChange", e.target.checked)} />
                Force Change<Tooltip text={tooltips.evolutionsForceChange} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.evosAllowAltFormes} onChange={e => set("evosAllowAltFormes", e.target.checked)} />
                Allow Alt Formes<Tooltip text={tooltips.allowAltFormesEvolutions} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.evosForceGrowth} onChange={e => set("evosForceGrowth", e.target.checked)} />
                Force BST Growth<Tooltip text={tooltips.evosForceGrowth} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.evosNoConvergence} onChange={e => set("evosNoConvergence", e.target.checked)} />
                No Convergent Evolutions<Tooltip text={tooltips.evosNoConvergence} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Starters */}
      <div className="panel">
        <span className="panel-title">Starter Pokemon<Tooltip text={tooltips.startersMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "COMPLETELY_RANDOM", "RANDOM_WITH_TWO_EVOLUTIONS", "RANDOM_BASIC", "CUSTOM"] as UPRSettings["startersMod"][]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="startersMod" checked={s.startersMod === m}
                onChange={() => set("startersMod", m)} />
              {m === "UNCHANGED" ? "Unchanged"
                : m === "COMPLETELY_RANDOM" ? "Random"
                : m === "RANDOM_WITH_TWO_EVOLUTIONS" ? "Random (2 Evolutions)"
                : m === "RANDOM_BASIC" ? "Random (Basic Only)"
                : "Custom"}
            </span>
          ))}
        </div>

        {s.startersMod === "CUSTOM" && (
          <div className="sub-row">
            <span className="text-xs text-gray-500">Dex numbers:</span>
            {([0, 1, 2] as const).map(i => (
              <input key={i} type="number" min={1} max={898} className="input-field"
                value={s.customStarters[i]}
                onChange={e => {
                  const next: [number, number, number] = [...s.customStarters];
                  next[i] = Number(e.target.value);
                  set("customStarters", next);
                }} />
            ))}
          </div>
        )}

        {s.startersMod !== "UNCHANGED" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeStartersHeldItems} disabled={!supportsStarterHeldItems} onChange={e => set("randomizeStartersHeldItems", e.target.checked)} />
                Randomize Held Items<Tooltip text={tooltips.randomizeStarterHeldItems} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banBadRandomStarterHeldItems} onChange={e => set("banBadRandomStarterHeldItems", e.target.checked)} />
                Ban Bad Held Items<Tooltip text={tooltips.banBadStarterHeldItems} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.allowStarterAltFormes} disabled={!hasStarterAltFormes} onChange={e => set("allowStarterAltFormes", e.target.checked)} />
                Allow Alt Formes<Tooltip text={tooltips.allowStarterAltFormes} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.startersNoLegendaries} onChange={e => set("startersNoLegendaries", e.target.checked)} />
                Ban Legendaries<Tooltip text={tooltips.startersNoLegendaries} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.startersNoDualTypes} onChange={e => set("startersNoDualTypes", e.target.checked)} />
                Ban Dual Types<Tooltip text={tooltips.startersNoDualTypes} />
              </span>
            </div>

            {/* Type constraint (FVX) */}
            <div className="mt-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Type Constraint<Tooltip text={tooltips.startersTypeMod} />
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {STARTERS_TYPE_MODS.map(({ value, label }) => (
                  <span key={value} className="radio-label">
                    <input type="radio" name="startersTypeMod" checked={s.startersTypeMod === value}
                      onChange={() => set("startersTypeMod", value)} />
                    {label}
                  </span>
                ))}
              </div>
              {s.startersTypeMod === "SINGLE_TYPE" && (
                <div className="sub-row items-center">
                  <span className="text-xs text-gray-500">Type:</span>
                  <select className="select-field" value={s.startersSingleType ?? "NORMAL"}
                    onChange={e => set("startersSingleType", e.target.value as PokemonType)}>
                    {POKEMON_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* BST limits (FVX) */}
            <div className="mt-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                BST Range<Tooltip text={tooltips.startersBSTLimits} />
              </span>
              <div className="sub-row items-center">
                <span className="text-xs text-gray-500">Min:</span>
                <input type="number" min={0} max={1500} className="input-field w-24"
                  value={s.startersBSTMinimum}
                  onChange={e => set("startersBSTMinimum", Math.max(0, Math.min(1500, Number(e.target.value))))} />
                <span className="text-xs text-gray-500">Max:</span>
                <input type="number" min={0} max={1500} className="input-field w-24"
                  value={s.startersBSTMaximum}
                  onChange={e => set("startersBSTMaximum", Math.max(0, Math.min(1500, Number(e.target.value))))} />
                <span className="text-xs text-gray-500">(0 disables limit)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Palettes (FVX) */}
      <div className="panel">
        <span className="panel-title">Pokemon Palettes<Tooltip text={tooltips.pokemonPalettesMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "RANDOM"] as PokemonPalettesMod[]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="pokemonPalettesMod" checked={s.pokemonPalettesMod === m}
                onChange={() => set("pokemonPalettesMod", m)} />
              {m === "UNCHANGED" ? "Unchanged" : "Random"}
            </span>
          ))}
        </div>
        {s.pokemonPalettesMod === "RANDOM" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.pokemonPalettesFollowTypes}
                  onChange={e => set("pokemonPalettesFollowTypes", e.target.checked)} />
                Follow Types<Tooltip text={tooltips.pokemonPalettesFollowTypes} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.pokemonPalettesFollowEvolutions}
                  onChange={e => set("pokemonPalettesFollowEvolutions", e.target.checked)} />
                Follow Evolutions<Tooltip text={tooltips.pokemonPalettesFollowEvolutions} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.pokemonPalettesShinyFromNormal}
                  onChange={e => set("pokemonPalettesShinyFromNormal", e.target.checked)} />
                Derive Shiny From Normal<Tooltip text={tooltips.pokemonPalettesShinyFromNormal} />
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

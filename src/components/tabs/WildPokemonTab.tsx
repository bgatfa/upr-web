import type {
  UPRSettings, StaticPokemonMod,
  WildPokemonZoneMod, WildPokemonTypeMod, WildPokemonEvolutionMod,
} from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

const ZONE_MODS: { value: WildPokemonZoneMod; label: string }[] = [
  { value: "NONE",            label: "Per Encounter" },
  { value: "ENCOUNTER_SET",   label: "Encounter Set" },
  { value: "MAP",             label: "Per Map" },
  { value: "NAMED_LOCATION",  label: "Named Location" },
  { value: "GAME",            label: "Whole Game" },
];

const TYPE_MODS: { value: WildPokemonTypeMod; label: string }[] = [
  { value: "NONE",          label: "No Constraint" },
  { value: "KEEP_PRIMARY",  label: "Keep Primary Type" },
  { value: "RANDOM_THEMES", label: "Random Themes" },
];

const EVO_MODS: { value: WildPokemonEvolutionMod; label: string }[] = [
  { value: "NONE",       label: "No Constraint" },
  { value: "BASIC_ONLY", label: "Basic Only" },
  { value: "KEEP_STAGE", label: "Keep Stage" },
];

const STATIC_MODS: { value: StaticPokemonMod; label: string }[] = [
  { value: "UNCHANGED",        label: "Unchanged" },
  { value: "RANDOM_MATCHING",  label: "Random (Match BST)" },
  { value: "COMPLETELY_RANDOM",label: "Completely Random" },
  { value: "SIMILAR_STRENGTH", label: "Similar Strength" },
];

export function WildPokemonTab({ s, set, rom }: Props) {
  const hasTimeBasedEncounters = rom?.hasTimeBasedEncounters ?? true;
  const hasWildAltFormes = rom?.hasWildAltFormes ?? true;
  const canChangeStaticPokemon = rom?.canChangeStaticPokemon ?? true;
  const hasStaticMusicFix = rom?.hasStaticMusicFix ?? true;
  const hasStaticAltFormes = rom?.hasStaticAltFormes ?? true;
  const hasMegaEvolutions = rom?.hasMegaEvolutions ?? true;
  const canBalanceShakingGrass = (rom?.generation ?? 5) === 5;

  return (
    <div className="flex flex-col gap-0">

      <div className="panel">
        <span className="panel-title">Wild Pokemon<Tooltip text={tooltips.randomizeWildPokemon} /></span>
        <span className="checkbox-label">
          <input type="checkbox" checked={s.randomizeWildPokemon}
            onChange={e => set("randomizeWildPokemon", e.target.checked)} />
          Randomize Wild Pokemon
        </span>

        {s.randomizeWildPokemon && (
          <div className="sub-options">
            {/* Zone granularity */}
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Zone<Tooltip text={tooltips.wildPokemonZoneMod} />
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {ZONE_MODS.map(({ value, label }) => (
                  <span key={value} className="radio-label">
                    <input type="radio" name="wildZoneMod" checked={s.wildPokemonZoneMod === value}
                      onChange={() => set("wildPokemonZoneMod", value)} />
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="checkbox-label">
                  <input type="checkbox" checked={s.splitWildZoneByEncounterTypes}
                    onChange={e => set("splitWildZoneByEncounterTypes", e.target.checked)} />
                  Split by Encounter Type<Tooltip text={tooltips.splitWildZoneByEncounterTypes} />
                </span>
                <span className="checkbox-label">
                  <input type="checkbox" checked={s.keepWildEvolutionFamilies}
                    onChange={e => set("keepWildEvolutionFamilies", e.target.checked)} />
                  Keep Evolution Families<Tooltip text={tooltips.keepWildEvolutionFamilies} />
                </span>
              </div>
            </div>

            {/* Type constraint */}
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Type<Tooltip text={tooltips.wildPokemonTypeMod} />
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {TYPE_MODS.map(({ value, label }) => (
                  <span key={value} className="radio-label">
                    <input type="radio" name="wildTypeMod" checked={s.wildPokemonTypeMod === value}
                      onChange={() => set("wildPokemonTypeMod", value)} />
                    {label}
                  </span>
                ))}
              </div>
              <span className="checkbox-label mt-1">
                <input type="checkbox" checked={s.keepWildTypeThemes}
                  onChange={e => set("keepWildTypeThemes", e.target.checked)} />
                Keep Original Type Themes<Tooltip text={tooltips.keepWildTypeThemes} />
              </span>
            </div>

            {/* Evolution stage constraint */}
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Evolution<Tooltip text={tooltips.wildPokemonEvolutionMod} />
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {EVO_MODS.map(({ value, label }) => (
                  <span key={value} className="radio-label">
                    <input type="radio" name="wildEvoMod" checked={s.wildPokemonEvolutionMod === value}
                      onChange={() => set("wildPokemonEvolutionMod", value)} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Strength constraint (legacy similar-strength / catch-em-all) */}
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Restriction</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="checkbox-label">
                  <input type="checkbox" checked={s.similarStrengthEncounters}
                    onChange={e => set("similarStrengthEncounters", e.target.checked)} />
                  Similar Strength
                </span>
                <span className="checkbox-label">
                  <input type="checkbox" checked={s.catchEmAllEncounters}
                    onChange={e => set("catchEmAllEncounters", e.target.checked)} />
                  Catch 'Em All
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.blockWildLegendaries}
                  onChange={e => set("blockWildLegendaries", e.target.checked)} />
                Block Legendaries<Tooltip text={tooltips.blockWildLegendaries} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.useTimeBasedEncounters} disabled={!hasTimeBasedEncounters}
                  onChange={e => set("useTimeBasedEncounters", e.target.checked)} />
                Use Time-Based Encounters<Tooltip text={tooltips.useTimeBasedEncounters} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.balanceShakingGrass} disabled={!canBalanceShakingGrass}
                  onChange={e => set("balanceShakingGrass", e.target.checked)} />
                Balance Shaking Grass<Tooltip text={tooltips.balanceShakingGrass} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.allowWildAltFormes} disabled={!hasWildAltFormes}
                  onChange={e => set("allowWildAltFormes", e.target.checked)} />
                Allow Alt Formes<Tooltip text={tooltips.allowWildAltFormes} />
              </span>
            </div>

            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeWildPokemonHeldItems}
                  onChange={e => set("randomizeWildPokemonHeldItems", e.target.checked)} />
                Randomize Held Items<Tooltip text={tooltips.randomizeWildPokemonHeldItems} />
              </span>
              {s.randomizeWildPokemonHeldItems && (
                <div className="sub-row">
                  <span className="checkbox-label">
                    <input type="checkbox" checked={s.banBadRandomWildPokemonHeldItems}
                      onChange={e => set("banBadRandomWildPokemonHeldItems", e.target.checked)} />
                    Ban Bad Held Items<Tooltip text={tooltips.banBadRandomWildPokemonHeldItems} />
                  </span>
                </div>
              )}
            </div>

            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.useMinimumCatchRate}
                  onChange={e => set("useMinimumCatchRate", e.target.checked)} />
                Set Minimum Catch Rate<Tooltip text={tooltips.useMinimumCatchRate} />
              </span>
              {s.useMinimumCatchRate && (
                <div className="sub-row">
                  <span className="text-xs text-gray-500">Level:</span>
                  <select className="select-field" value={s.minimumCatchRateLevel}
                    onChange={e => set("minimumCatchRateLevel", Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Level Modifier — independent of wild randomization (engine applies it
            whenever wildLevelsModified is set, even with randomization off) */}
        <div className={s.randomizeWildPokemon ? "" : "mt-2"}>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.wildLevelsModified}
              onChange={e => set("wildLevelsModified", e.target.checked)} />
            Modify Wild Levels<Tooltip text={tooltips.wildLevelsModified} />
          </span>
          {s.wildLevelsModified && (
            <div className="sub-row items-center">
              <input type="range" min={-100} max={155} className="w-36"
                value={s.wildLevelModifier}
                onChange={e => set("wildLevelModifier", Number(e.target.value))} />
              <span className="text-sm text-gray-700 w-14 font-mono">
                {s.wildLevelModifier >= 0 ? `+${s.wildLevelModifier}` : s.wildLevelModifier}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Static Pokemon */}
      <div className="panel">
        <span className="panel-title">Static / Legendary Pokemon<Tooltip text={tooltips.staticPokemonMod} /></span>
        {!canChangeStaticPokemon && <p className="text-sm text-gray-500 mb-2">This ROM does not support static Pokemon randomization.</p>}
        <div className="field-row mb-1">
          {STATIC_MODS.map(({ value, label }) => (
            <span key={value} className="radio-label">
              <input type="radio" name="staticMod" disabled={!canChangeStaticPokemon} checked={s.staticPokemonMod === value}
                onChange={() => set("staticPokemonMod", value)} />
              {label}
            </span>
          ))}
        </div>
        {s.staticPokemonMod !== "UNCHANGED" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.limitMainGameLegendaries}
                  onChange={e => set("limitMainGameLegendaries", e.target.checked)} />
                Limit Main-Game Legendaries<Tooltip text={tooltips.limitMainGameLegendaries} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.limit600}
                  onChange={e => set("limit600", e.target.checked)} />
                Limit to 600 BST<Tooltip text={tooltips.limit600} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.allowStaticAltFormes} disabled={!hasStaticAltFormes}
                  onChange={e => set("allowStaticAltFormes", e.target.checked)} />
                Allow Alt Formes<Tooltip text={tooltips.allowStaticAltFormes} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.swapStaticMegaEvos} disabled={!hasMegaEvolutions}
                  onChange={e => set("swapStaticMegaEvos", e.target.checked)} />
                Swap Mega Evolutions<Tooltip text={tooltips.swapStaticMegaEvos} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.correctStaticMusic} disabled={!hasStaticMusicFix}
                  onChange={e => set("correctStaticMusic", e.target.checked)} />
                Correct Static Music<Tooltip text={tooltips.correctStaticMusic} />
              </span>
            </div>

          </div>
        )}

        {/* Level Modifier — independent of static randomization; engine gates only
            on the ROM's canChangeStaticPokemon */}
        <div className="mt-2">
          <span className="checkbox-label">
            <input type="checkbox" checked={s.staticLevelModified} disabled={!canChangeStaticPokemon}
              onChange={e => set("staticLevelModified", e.target.checked)} />
            Modify Static Levels<Tooltip text={tooltips.staticLevelModified} />
          </span>
          {s.staticLevelModified && (
            <div className="sub-row items-center">
              <input type="range" min={-100} max={155} className="w-36"
                value={s.staticLevelModifier}
                onChange={e => set("staticLevelModifier", Number(e.target.value))} />
              <span className="text-sm text-gray-700 w-14 font-mono">
                {s.staticLevelModifier >= 0 ? `+${s.staticLevelModifier}` : s.staticLevelModifier}%
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

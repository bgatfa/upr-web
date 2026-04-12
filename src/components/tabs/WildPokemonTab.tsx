import type { UPRSettings, WildPokemonMod, WildPokemonRestrictionMod, StaticPokemonMod } from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

const WILD_MODS: { value: WildPokemonMod; label: string }[] = [
  { value: "UNCHANGED",     label: "Unchanged" },
  { value: "RANDOM",        label: "Random" },
  { value: "AREA_MAPPING",  label: "Area Mapping" },
  { value: "GLOBAL_MAPPING",label: "Global Mapping" },
];

const RESTRICTION_MODS: { value: WildPokemonRestrictionMod; label: string }[] = [
  { value: "NONE",            label: "None" },
  { value: "CATCH_EM_ALL",    label: "Catch 'Em All" },
  { value: "TYPE_THEME_AREAS",label: "Type Theme Areas" },
  { value: "SIMILAR_STRENGTH",label: "Similar Strength" },
];

const STATIC_MODS: { value: StaticPokemonMod; label: string }[] = [
  { value: "UNCHANGED",        label: "Unchanged" },
  { value: "RANDOM_MATCHING",  label: "Random (Match BST)" },
  { value: "COMPLETELY_RANDOM",label: "Completely Random" },
  { value: "SIMILAR_STRENGTH", label: "Similar Strength" },
];

export function WildPokemonTab({ s, set, rom }: Props) {
  const randomizing = s.wildPokemonMod !== "UNCHANGED";
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
        <span className="panel-title">Wild Pokemon<Tooltip text={tooltips.wildPokemonMod} /></span>
        <div className="field-row mb-1">
          {WILD_MODS.map(({ value, label }) => (
            <span key={value} className="radio-label">
              <input type="radio" name="wildMod" checked={s.wildPokemonMod === value}
                onChange={() => set("wildPokemonMod", value)} />
              {label}
            </span>
          ))}
        </div>

        {randomizing && (
          <div className="sub-options">
            {/* Restriction — nested radio group */}
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Restriction<Tooltip text={tooltips.wildPokemonRestrictionMod} /></span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {RESTRICTION_MODS.map(({ value, label }) => (
                  <span key={value} className="radio-label">
                    <input type="radio" name="wildRestrict" checked={s.wildPokemonRestrictionMod === value}
                      onChange={() => set("wildPokemonRestrictionMod", value)} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
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

            {/* Held items — sub-toggle */}
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

            {/* Catch rate — sub-toggle */}
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

            {/* Level modifier — sub-toggle */}
            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.wildLevelsModified}
                  onChange={e => set("wildLevelsModified", e.target.checked)} />
                Modify Wild Levels<Tooltip text={tooltips.wildLevelsModified} />
              </span>
              {s.wildLevelsModified && (
                <div className="sub-row items-center">
                  <input type="range" min={-50} max={50} className="w-36"
                    value={s.wildLevelModifier}
                    onChange={e => set("wildLevelModifier", Number(e.target.value))} />
                  <span className="text-sm text-gray-700 w-12 font-mono">
                    {s.wildLevelModifier >= 0 ? `+${s.wildLevelModifier}` : s.wildLevelModifier}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
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

            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.staticLevelModified}
                  onChange={e => set("staticLevelModified", e.target.checked)} />
                Modify Static Levels<Tooltip text={tooltips.staticLevelModified} />
              </span>
              {s.staticLevelModified && (
                <div className="sub-row items-center">
                  <input type="range" min={-50} max={50} className="w-36"
                    value={s.staticLevelModifier}
                    onChange={e => set("staticLevelModifier", Number(e.target.value))} />
                  <span className="text-sm text-gray-700 w-12 font-mono">
                    {s.staticLevelModifier >= 0 ? `+${s.staticLevelModifier}` : s.staticLevelModifier}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

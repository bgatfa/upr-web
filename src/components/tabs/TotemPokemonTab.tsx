import type { UPRSettings, TotemPokemonMod, AllyPokemonMod, AuraMod } from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

const TOTEM_MODS: { value: TotemPokemonMod; label: string }[] = [
  { value: "UNCHANGED", label: "Unchanged" },
  { value: "RANDOM", label: "Random" },
  { value: "SIMILAR_STRENGTH", label: "Random (Similar Strength)" },
];

const ALLY_MODS: { value: AllyPokemonMod; label: string }[] = [
  { value: "UNCHANGED", label: "Unchanged" },
  { value: "RANDOM", label: "Random" },
  { value: "SIMILAR_STRENGTH", label: "Random (Similar Strength)" },
];

const AURA_MODS: { value: AuraMod; label: string }[] = [
  { value: "UNCHANGED", label: "Unchanged" },
  { value: "RANDOM", label: "Random" },
  { value: "SAME_STRENGTH", label: "Random (Same Strength)" },
];

export function TotemPokemonTab({ s, set, rom }: Props) {
  const hasTotemPokemon = rom?.hasTotemPokemon ?? true;
  const randomizingTotems = s.totemPokemonMod !== "UNCHANGED" || s.allyPokemonMod !== "UNCHANGED";

  return (
    <div className="flex flex-col gap-0">
      <div className="panel">
        <span className="panel-title">Totem Pokemon</span>
        {!hasTotemPokemon && <p className="text-sm text-gray-500 mb-2">This ROM does not support Totem Pokemon randomization.</p>}
        <div className="field-row mb-1">
          {TOTEM_MODS.map(({ value, label }) => (
            <span key={value} className="radio-label">
              <input
                type="radio"
                name="totemPokemonMod"
                disabled={!hasTotemPokemon}
                checked={s.totemPokemonMod === value}
                onChange={() => set("totemPokemonMod", value)}
              />
              {label}
              <Tooltip text={tooltips[`totemPokemonMod.${value}`]} />
            </span>
          ))}
        </div>
      </div>

      <div className="panel">
        <span className="panel-title">Ally Pokemon</span>
        <div className="field-row mb-1">
          {ALLY_MODS.map(({ value, label }) => (
            <span key={value} className="radio-label">
              <input
                type="radio"
                name="allyPokemonMod"
                disabled={!hasTotemPokemon}
                checked={s.allyPokemonMod === value}
                onChange={() => set("allyPokemonMod", value)}
              />
              {label}
              <Tooltip text={tooltips[`allyPokemonMod.${value}`]} />
            </span>
          ))}
        </div>
      </div>

      <div className="panel">
        <span className="panel-title">Auras</span>
        <div className="field-row mb-1">
          {AURA_MODS.map(({ value, label }) => (
            <span key={value} className="radio-label">
              <input
                type="radio"
                name="auraMod"
                disabled={!hasTotemPokemon}
                checked={s.auraMod === value}
                onChange={() => set("auraMod", value)}
              />
              {label}
              <Tooltip text={tooltips[`auraMod.${value}`]} />
            </span>
          ))}
        </div>
      </div>

      <div className="panel">
        <span className="panel-title">Totem Options</span>
        <div className="field-row">
          <span className="checkbox-label">
            <input
              type="checkbox"
              disabled={!hasTotemPokemon}
              checked={s.randomizeTotemHeldItems}
              onChange={(e) => set("randomizeTotemHeldItems", e.target.checked)}
            />
            Randomize Held Items<Tooltip text={tooltips.randomizeTotemHeldItems} />
          </span>
          <span className="checkbox-label">
            <input
              type="checkbox"
              disabled={!hasTotemPokemon}
              checked={s.allowTotemAltFormes}
              onChange={(e) => set("allowTotemAltFormes", e.target.checked)}
            />
            Allow Alternate Formes<Tooltip text={tooltips.allowTotemAltFormes} />
          </span>
        </div>

        <div className="mt-2">
          <span className="checkbox-label">
            <input
              type="checkbox"
              disabled={!hasTotemPokemon || !randomizingTotems}
              checked={s.totemLevelsModified}
              onChange={(e) => set("totemLevelsModified", e.target.checked)}
            />
            Percentage Level Modifier<Tooltip text={tooltips.totemLevelsModified} />
          </span>
          {s.totemLevelsModified && (
            <div className="sub-row items-center">
              <input
                type="range"
                min={-50}
                max={50}
                className="w-36"
                value={s.totemLevelModifier}
                onChange={(e) => set("totemLevelModifier", Number(e.target.value))}
              />
              <span className="text-sm text-gray-700 w-12 font-mono">
                {s.totemLevelModifier >= 0 ? `+${s.totemLevelModifier}` : s.totemLevelModifier}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

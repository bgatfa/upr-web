import type { UPRSettings, TrainersMod } from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

const TRAINER_MODS: { value: TrainersMod; label: string }[] = [
  { value: "UNCHANGED",              label: "Unchanged" },
  { value: "RANDOM",                 label: "Random" },
  { value: "DISTRIBUTED",            label: "Random (Distributed)" },
  { value: "MAINPLAYTHROUGH",        label: "Main Playthrough" },
  { value: "TYPE_THEMED",            label: "Type Themed" },
  { value: "TYPE_THEMED_ELITE4_GYMS",label: "Type Themed (Elite 4 + Gyms)" },
];

export function TrainersTab({ s, set, rom }: Props) {
  const randomizing = s.trainersMod !== "UNCHANGED";
  const hasMegaEvolutions = rom?.hasMegaEvolutions ?? true;
  const hasFunctionalFormes = rom?.hasFunctionalFormes ?? true;
  const supportsDoubleBattles = (rom?.generation ?? 3) >= 3;

  return (
    <div className="flex flex-col gap-0">

      <div className="panel">
        <span className="panel-title">Trainer Pokemon<Tooltip text={tooltips.trainersMod} /></span>
        <div className="field-row mb-1">
          {TRAINER_MODS.map(({ value, label }) => (
            <span key={value} className="radio-label">
              <input type="radio" name="trainersMod" checked={s.trainersMod === value}
                onChange={() => set("trainersMod", value)} />
              {label}
            </span>
          ))}
        </div>

        {randomizing && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.trainersUsePokemonOfSimilarStrength}
                  onChange={e => set("trainersUsePokemonOfSimilarStrength", e.target.checked)} />
                Similar Strength<Tooltip text={tooltips.trainersUsePokemonOfSimilarStrength} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.rivalCarriesStarterThroughout}
                  onChange={e => set("rivalCarriesStarterThroughout", e.target.checked)} />
                Rival Carries Starter<Tooltip text={tooltips.rivalCarriesStarterThroughout} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.trainersMatchTypingDistribution}
                  onChange={e => set("trainersMatchTypingDistribution", e.target.checked)} />
                Match Typing Distribution<Tooltip text={tooltips.trainersMatchTypingDistribution} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.trainersBlockLegendaries}
                  onChange={e => set("trainersBlockLegendaries", e.target.checked)} />
                Block Legendaries<Tooltip text={tooltips.trainersBlockLegendaries} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.trainersBlockEarlyWonderGuard}
                  onChange={e => set("trainersBlockEarlyWonderGuard", e.target.checked)} />
                Block Early Wonder Guard<Tooltip text={tooltips.trainersBlockEarlyWonderGuard} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.betterTrainerMovesets}
                  onChange={e => set("betterTrainerMovesets", e.target.checked)} />
                Better Movesets<Tooltip text={tooltips.betterTrainerMovesets} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.swapTrainerMegaEvos} disabled={!hasMegaEvolutions}
                  onChange={e => set("swapTrainerMegaEvos", e.target.checked)} />
                Swap Mega Evolutions<Tooltip text={tooltips.swapTrainerMegaEvos} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.doubleBattleMode} disabled={!supportsDoubleBattles}
                  onChange={e => set("doubleBattleMode", e.target.checked)} />
                Double Battle Mode<Tooltip text={tooltips.doubleBattleMode} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.shinyChance}
                  onChange={e => set("shinyChance", e.target.checked)} />
                Shiny Chance<Tooltip text={tooltips.shinyChance} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.allowTrainerAlternateFormes} disabled={!hasFunctionalFormes}
                  onChange={e => set("allowTrainerAlternateFormes", e.target.checked)} />
                Allow Alt Formes<Tooltip text={tooltips.allowTrainerAlternateFormes} />
              </span>
            </div>
          </div>
        )}
      </div>

      {randomizing && (
        <>
          <div className="panel">
            <span className="panel-title">Additional Pokemon per Trainer</span>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Boss (Rival / E4 / Champion)", key: "additionalBossTrainerPokemon", tip: tooltips.additionalBossTrainerPokemon },
                { label: "Important Trainer", key: "additionalImportantTrainerPokemon", tip: tooltips.additionalImportantTrainerPokemon },
                { label: "Regular Trainer", key: "additionalRegularTrainerPokemon", tip: tooltips.additionalRegularTrainerPokemon },
              ].map(({ label, key, tip }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-700">{label}:<Tooltip text={tip} /></span>
                  <select className="select-field" value={(s as never)[key]}
                    onChange={e => set(key as keyof UPRSettings, Number(e.target.value) as never)}>
                    {[0, 1, 2, 3].map(n => <option key={n} value={n}>+{n}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <span className="panel-title">Force Fully Evolved</span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.trainersForceFullyEvolved}
                onChange={e => set("trainersForceFullyEvolved", e.target.checked)} />
              Force Fully Evolved at Level<Tooltip text={tooltips.trainersForceFullyEvolved} />
            </span>
            {s.trainersForceFullyEvolved && (
              <div className="sub-row">
                <span className="text-xs text-gray-500">Level:</span>
                <input type="number" min={1} max={100} className="input-field"
                  value={s.trainersForceFullyEvolvedLevel}
                  onChange={e => set("trainersForceFullyEvolvedLevel", Number(e.target.value))} />
              </div>
            )}
          </div>

          <div className="panel">
            <span className="panel-title">Level Modifier</span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.trainersLevelModified}
                onChange={e => set("trainersLevelModified", e.target.checked)} />
              Modify Trainer Levels<Tooltip text={tooltips.trainersLevelModified} />
            </span>
            {s.trainersLevelModified && (
              <div className="sub-row items-center">
                <input type="range" min={-50} max={50} className="w-36"
                  value={s.trainersLevelModifier}
                  onChange={e => set("trainersLevelModifier", Number(e.target.value))} />
                <span className="text-sm text-gray-700 w-12 font-mono">
                  {s.trainersLevelModifier >= 0 ? `+${s.trainersLevelModifier}` : s.trainersLevelModifier}%
                </span>
              </div>
            )}
          </div>

          <div className="panel">
            <span className="panel-title">Held Items</span>
            <div className="field-row mb-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeHeldItemsForBossTrainerPokemon}
                  onChange={e => set("randomizeHeldItemsForBossTrainerPokemon", e.target.checked)} />
                Boss Trainers<Tooltip text={tooltips.randomizeHeldItemsForBossTrainerPokemon} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeHeldItemsForImportantTrainerPokemon}
                  onChange={e => set("randomizeHeldItemsForImportantTrainerPokemon", e.target.checked)} />
                Important Trainers<Tooltip text={tooltips.randomizeHeldItemsForImportantTrainerPokemon} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeHeldItemsForRegularTrainerPokemon}
                  onChange={e => set("randomizeHeldItemsForRegularTrainerPokemon", e.target.checked)} />
                Regular Trainers<Tooltip text={tooltips.randomizeHeldItemsForRegularTrainerPokemon} />
              </span>
            </div>

            {(s.randomizeHeldItemsForBossTrainerPokemon ||
              s.randomizeHeldItemsForImportantTrainerPokemon ||
              s.randomizeHeldItemsForRegularTrainerPokemon) && (
              <div className="sub-options">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="checkbox-label">
                    <input type="checkbox" checked={s.consumableItemsOnlyForTrainerPokemon}
                      onChange={e => set("consumableItemsOnlyForTrainerPokemon", e.target.checked)} />
                    Consumable Items Only<Tooltip text={tooltips.consumableItemsOnlyForTrainerPokemon} />
                  </span>
                  <span className="checkbox-label">
                    <input type="checkbox" checked={s.sensibleItemsOnlyForTrainerPokemon}
                      onChange={e => set("sensibleItemsOnlyForTrainerPokemon", e.target.checked)} />
                    Sensible Items Only<Tooltip text={tooltips.sensibleItemsOnlyForTrainerPokemon} />
                  </span>
                  <span className="checkbox-label">
                    <input type="checkbox" checked={s.highestLevelOnlyGetsItemsForTrainerPokemon}
                      onChange={e => set("highestLevelOnlyGetsItemsForTrainerPokemon", e.target.checked)} />
                    Highest Level Only Gets Items<Tooltip text={tooltips.highestLevelOnlyGetsItemsForTrainerPokemon} />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="panel">
            <span className="panel-title">Elite Four</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Unique Pokemon per member:<Tooltip text={tooltips.eliteFourUniquePokemonNumber} /></span>
              <select className="select-field" value={s.eliteFourUniquePokemonNumber}
                onChange={e => set("eliteFourUniquePokemonNumber", Number(e.target.value))}>
                {[0, 1, 2].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

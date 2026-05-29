import type {
  UPRSettings, TrainersMod, BattleStyleModification, BattleStyleType,
} from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

const TRAINER_MODS: { value: TrainersMod; label: string; tip?: string }[] = [
  { value: "UNCHANGED",               label: "Unchanged" },
  { value: "RANDOM",                  label: "Random" },
  { value: "DISTRIBUTED",             label: "Random (Distributed)" },
  { value: "MAINPLAYTHROUGH",         label: "Main Playthrough" },
  { value: "TYPE_THEMED",             label: "Type Themed" },
  { value: "TYPE_THEMED_ELITE4_GYMS", label: "Type Themed (E4 + Gyms)" },
  { value: "KEEP_THEMED",             label: "Keep Themed", tip: tooltips.trainersKeepThemed },
  { value: "KEEP_THEME_OR_PRIMARY",   label: "Keep Theme / Primary", tip: tooltips.trainersKeepThemeOrPrimary },
];

const BATTLE_STYLE_MODS: { value: BattleStyleModification; label: string }[] = [
  { value: "UNCHANGED",     label: "Unchanged" },
  { value: "RANDOM",        label: "Random" },
  { value: "SINGLE_STYLE",  label: "Single Style" },
];

const BATTLE_STYLE_TYPES: { value: BattleStyleType; label: string }[] = [
  { value: "SINGLE_BATTLE",   label: "Single" },
  { value: "DOUBLE_BATTLE",   label: "Double" },
  { value: "TRIPLE_BATTLE",   label: "Triple" },
  { value: "ROTATION_BATTLE", label: "Rotation" },
];

export function TrainersTab({ s, set, rom }: Props) {
  const randomizing = s.trainersMod !== "UNCHANGED";
  const hasMegaEvolutions = rom?.hasMegaEvolutions ?? true;
  const hasFunctionalFormes = rom?.hasFunctionalFormes ?? true;

  return (
    <div className="flex flex-col gap-0">

      <div className="panel">
        <span className="panel-title">Trainer Pokemon<Tooltip text={tooltips.trainersMod} /></span>
        <div className="field-row mb-1">
          {TRAINER_MODS.map(({ value, label, tip }) => (
            <span key={value} className="radio-label">
              <input type="radio" name="trainersMod" checked={s.trainersMod === value}
                onChange={() => set("trainersMod", value)} />
              {label}{tip && <Tooltip text={tip} />}
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
                <input type="checkbox" checked={s.swapTrainerMegaEvos} disabled={!hasMegaEvolutions}
                  onChange={e => set("swapTrainerMegaEvos", e.target.checked)} />
                Swap Mega Evolutions<Tooltip text={tooltips.swapTrainerMegaEvos} />
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
              <span className="checkbox-label">
                <input type="checkbox" checked={s.trainersAvoidDuplicates}
                  onChange={e => set("trainersAvoidDuplicates", e.target.checked)} />
                Avoid Duplicates<Tooltip text={tooltips.trainersAvoidDuplicates} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.trainersUseLocalPokemon}
                  onChange={e => set("trainersUseLocalPokemon", e.target.checked)} />
                Use Local Pokemon<Tooltip text={tooltips.trainersUseLocalPokemon} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Level Modifier — independent of trainer randomization (engine applies it
          whenever trainersLevelModified is set, even when trainers are Unchanged) */}
      <div className="panel">
        <span className="panel-title">Level Modifier</span>
        <span className="checkbox-label">
          <input type="checkbox" checked={s.trainersLevelModified}
            onChange={e => set("trainersLevelModified", e.target.checked)} />
          Modify Trainer Levels<Tooltip text={tooltips.trainersLevelModified} />
        </span>
        {s.trainersLevelModified && (
          <div className="sub-row items-center">
            <input type="range" min={-100} max={155} className="w-36"
              value={s.trainersLevelModifier}
              onChange={e => set("trainersLevelModifier", Number(e.target.value))} />
            <span className="text-sm text-gray-700 w-14 font-mono">
              {s.trainersLevelModifier >= 0 ? `+${s.trainersLevelModifier}` : s.trainersLevelModifier}%
            </span>
          </div>
        )}
      </div>

      {randomizing && (
        <>
          {/* Type Diversity per trainer tier (FVX) */}
          <div className="panel">
            <span className="panel-title">Type Diversity by Tier<Tooltip text={tooltips.diverseTypesForTrainers} /></span>
            <div className="field-row">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.diverseTypesForBossTrainers}
                  onChange={e => set("diverseTypesForBossTrainers", e.target.checked)} />
                Boss Trainers
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.diverseTypesForImportantTrainers}
                  onChange={e => set("diverseTypesForImportantTrainers", e.target.checked)} />
                Important Trainers
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.diverseTypesForRegularTrainers}
                  onChange={e => set("diverseTypesForRegularTrainers", e.target.checked)} />
                Regular Trainers
              </span>
            </div>
          </div>

          {/* Better movesets per trainer tier (FVX) */}
          <div className="panel">
            <span className="panel-title">Better Movesets by Tier<Tooltip text={tooltips.betterTrainerMovesetsTier} /></span>
            <div className="field-row">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.betterBossTrainerMovesets}
                  onChange={e => set("betterBossTrainerMovesets", e.target.checked)} />
                Boss Trainers
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.betterImportantTrainerMovesets}
                  onChange={e => set("betterImportantTrainerMovesets", e.target.checked)} />
                Important Trainers
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.betterRegularTrainerMovesets}
                  onChange={e => set("betterRegularTrainerMovesets", e.target.checked)} />
                Regular Trainers
              </span>
            </div>
          </div>

          {/* Battle Style (FVX replacement for Double Battle Mode) */}
          <div className="panel">
            <span className="panel-title">Battle Style<Tooltip text={tooltips.battleStyleMod} /></span>
            <div className="field-row mb-1">
              {BATTLE_STYLE_MODS.map(({ value, label }) => (
                <span key={value} className="radio-label">
                  <input type="radio" name="battleStyleMod" checked={s.battleStyleModification === value}
                    onChange={() => set("battleStyleModification", value)} />
                  {label}
                </span>
              ))}
            </div>
            {s.battleStyleModification === "SINGLE_STYLE" && (
              <div className="sub-row">
                <span className="text-xs text-gray-500">Style:<Tooltip text={tooltips.battleStyleType} /></span>
                {BATTLE_STYLE_TYPES.map(({ value, label }) => (
                  <span key={value} className="radio-label">
                    <input type="radio" name="battleStyleType" checked={s.battleStyleType === value}
                      onChange={() => set("battleStyleType", value)} />
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

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
            <span className="panel-title">Evolution Behavior</span>
            <div className="field-row">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.trainersEvolveTheirPokemon}
                  onChange={e => set("trainersEvolveTheirPokemon", e.target.checked)} />
                Evolve Trainer Pokemon by Expected Level<Tooltip text={tooltips.trainersEvolveTheirPokemon} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banPrematureEvos}
                  onChange={e => set("banPrematureEvos", e.target.checked)} />
                Ban Premature Evolutions<Tooltip text={tooltips.banPrematureEvos} />
              </span>
            </div>
            {s.trainersEvolveTheirPokemon && (
              <div className="sub-row items-center">
                <span className="text-xs text-gray-500">Evolution level modifier:<Tooltip text={tooltips.trainersEvolutionLevelModifier} /></span>
                <input type="range" min={-100} max={155} className="w-36"
                  value={s.trainersEvolutionLevelModifier}
                  onChange={e => set("trainersEvolutionLevelModifier", Number(e.target.value))} />
                <span className="text-sm text-gray-700 w-14 font-mono">
                  {s.trainersEvolutionLevelModifier >= 0 ? `+${s.trainersEvolutionLevelModifier}` : s.trainersEvolutionLevelModifier}%
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

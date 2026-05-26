import type { UPRSettings, MovesetsMod } from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

export function MovesetsTab({ s, set, rom }: Props) {
  const hasMoveTutors = rom?.hasMoveTutors ?? true;
  const hasPhysicalSpecialSplit = rom?.hasPhysicalSpecialSplit ?? true;
  return (
    <div className="flex flex-col gap-0">

      {/* Level-Up Movesets */}
      <div className="panel">
        <span className="panel-title">Level-Up Movesets<Tooltip text={tooltips.movesetsMod} /></span>
        <div className="field-row mb-1">
          {(["UNCHANGED", "RANDOM_PREFER_SAME_TYPE", "COMPLETELY_RANDOM", "METRONOME_ONLY"] as MovesetsMod[]).map(m => (
            <span key={m} className="radio-label">
              <input type="radio" name="movesetsMod" checked={s.movesetsMod === m}
                onChange={() => set("movesetsMod", m)} />
              {m === "UNCHANGED" ? "Unchanged"
                : m === "RANDOM_PREFER_SAME_TYPE" ? "Random (Prefer Same Type)"
                : m === "COMPLETELY_RANDOM" ? "Completely Random"
                : "Metronome Only"}
            </span>
          ))}
        </div>
        {s.movesetsMod !== "UNCHANGED" && (
          <div className="sub-options">
            <span className="checkbox-label">
              <input type="checkbox" checked={s.reorderDamagingMoves} onChange={e => set("reorderDamagingMoves", e.target.checked)} />
              Reorder Damaging Moves First<Tooltip text={tooltips.reorderDamagingMoves} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.blockBrokenMovesetMoves} onChange={e => set("blockBrokenMovesetMoves", e.target.checked)} />
              Block Broken Moves<Tooltip text={tooltips.blockBrokenMovesetMoves} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.evolutionMovesForAll} onChange={e => set("evolutionMovesForAll", e.target.checked)} />
              Evolution Moves for All<Tooltip text={tooltips.evolutionMovesForAll} />
            </span>

            {/* Guaranteed moves — nested toggle with its own sub-sub-option */}
            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.startWithGuaranteedMoves}
                  onChange={e => set("startWithGuaranteedMoves", e.target.checked)} />
                Start With Guaranteed Moves<Tooltip text={tooltips.startWithGuaranteedMoves} />
              </span>
              {s.startWithGuaranteedMoves && (
                <div className="sub-row">
                  <span className="text-xs text-gray-500">Count:</span>
                  <select className="select-field" value={s.guaranteedMoveCount}
                    onChange={e => set("guaranteedMoveCount", Number(e.target.value))}>
                    {[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Force good damaging — nested toggle with % sub-option */}
            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.movesetsForceGoodDamaging}
                  onChange={e => set("movesetsForceGoodDamaging", e.target.checked)} />
                Force Good Damaging Move<Tooltip text={tooltips.movesetsForceGoodDamaging} />
              </span>
              {s.movesetsForceGoodDamaging && (
                <div className="sub-row">
                  <span className="text-xs text-gray-500">At least:</span>
                  <input type="number" min={0} max={100} className="input-field"
                    value={s.movesetsGoodDamagingPercent}
                    onChange={e => set("movesetsGoodDamagingPercent", Number(e.target.value))} />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Move Data */}
      <div className="panel">
        <span className="panel-title">Move Data</span>
        <div className="field-row">
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeMovePowers} onChange={e => set("randomizeMovePowers", e.target.checked)} />
            Randomize Powers<Tooltip text={tooltips.randomizeMovePowers} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeMoveAccuracies} onChange={e => set("randomizeMoveAccuracies", e.target.checked)} />
            Randomize Accuracies<Tooltip text={tooltips.randomizeMoveAccuracies} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeMovePPs} onChange={e => set("randomizeMovePPs", e.target.checked)} />
            Randomize PPs<Tooltip text={tooltips.randomizeMovePPs} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeMoveTypes} onChange={e => set("randomizeMoveTypes", e.target.checked)} />
            Randomize Types<Tooltip text={tooltips.randomizeMoveTypes} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeMoveCategory} disabled={!hasPhysicalSpecialSplit} onChange={e => set("randomizeMoveCategory", e.target.checked)} />
            Randomize Category (Phys/Spec)<Tooltip text={tooltips.randomizeMoveCategory} />
          </span>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.randomizeMoveNames} onChange={e => set("randomizeMoveNames", e.target.checked)} />
            Randomize Move Names<Tooltip text={tooltips.randomizeMoveNames} />
          </span>
        </div>
      </div>

      {/* TM Moves */}
      <div className="panel">
        <span className="panel-title">TM / HM Moves<Tooltip text={tooltips.tmsMod} /></span>
        <div className="field-row mb-1">
          <span className="radio-label">
            <input type="radio" name="tmsMod" checked={s.tmsMod === "UNCHANGED"}
              onChange={() => set("tmsMod", "UNCHANGED")} />
            Unchanged
          </span>
          <span className="radio-label">
            <input type="radio" name="tmsMod" checked={s.tmsMod === "RANDOM"}
              onChange={() => set("tmsMod", "RANDOM")} />
            Random
          </span>
        </div>
        {s.tmsMod === "RANDOM" && (
          <div className="sub-options">
            <span className="checkbox-label">
              <input type="checkbox" checked={s.tmLevelUpMoveSanity} onChange={e => set("tmLevelUpMoveSanity", e.target.checked)} />
              Level-Up Move Sanity<Tooltip text={tooltips.tmLevelUpMoveSanity} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.keepFieldMoveTMs} onChange={e => set("keepFieldMoveTMs", e.target.checked)} />
              Keep Field Move TMs<Tooltip text={tooltips.keepFieldMoveTMs} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.blockBrokenTMMoves} onChange={e => set("blockBrokenTMMoves", e.target.checked)} />
              Block Broken Moves<Tooltip text={tooltips.blockBrokenTMMoves} />
            </span>
            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.tmsForceGoodDamaging}
                  onChange={e => set("tmsForceGoodDamaging", e.target.checked)} />
                Force Good Damaging Move<Tooltip text={tooltips.tmsForceGoodDamaging} />
              </span>
              {s.tmsForceGoodDamaging && (
                <div className="sub-row">
                  <span className="text-xs text-gray-500">At least:</span>
                  <input type="number" min={0} max={100} className="input-field"
                    value={s.tmsGoodDamagingPercent}
                    onChange={e => set("tmsGoodDamagingPercent", Number(e.target.value))} />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 border-t border-gray-200 pt-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">TM/HM Compatibility<Tooltip text={tooltips.tmsHmsCompatibilityMod} /></span>
          <div className="field-row mt-1 mb-1">
            {(["UNCHANGED", "RANDOM_PREFER_TYPE", "COMPLETELY_RANDOM", "FULL"] as UPRSettings["tmsHmsCompatibilityMod"][]).map(m => (
              <span key={m} className="radio-label">
                <input type="radio" name="tmsCompat" checked={s.tmsHmsCompatibilityMod === m}
                  onChange={() => set("tmsHmsCompatibilityMod", m)} />
                {m === "UNCHANGED" ? "Unchanged" : m === "RANDOM_PREFER_TYPE" ? "Random (Type)" : m === "COMPLETELY_RANDOM" ? "Completely Random" : "Full"}
              </span>
            ))}
          </div>
          <div className="field-row">
            <span className="checkbox-label">
              <input type="checkbox" checked={s.fullHMCompat} onChange={e => set("fullHMCompat", e.target.checked)} />
              Full HM Compatibility<Tooltip text={tooltips.fullHMCompat} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.tmsFollowEvolutions} onChange={e => set("tmsFollowEvolutions", e.target.checked)} />
              Follow Evolutions<Tooltip text={tooltips.tmsFollowEvolutions} />
            </span>
          </div>
        </div>
      </div>

      {/* Move Tutors */}
      <div className="panel">
        <span className="panel-title">Move Tutors<Tooltip text={tooltips.moveTutorMovesMod} /></span>
        {!hasMoveTutors && <p className="text-sm text-gray-500 mb-2">This ROM does not support move tutor randomization.</p>}
        <div className="field-row mb-1">
          <span className="radio-label">
            <input type="radio" name="tutorMod" disabled={!hasMoveTutors} checked={s.moveTutorMovesMod === "UNCHANGED"}
              onChange={() => set("moveTutorMovesMod", "UNCHANGED")} />
            Unchanged
          </span>
          <span className="radio-label">
            <input type="radio" name="tutorMod" disabled={!hasMoveTutors} checked={s.moveTutorMovesMod === "RANDOM"}
              onChange={() => set("moveTutorMovesMod", "RANDOM")} />
            Random
          </span>
        </div>
        {s.moveTutorMovesMod === "RANDOM" && (
          <div className="sub-options">
            <span className="checkbox-label">
              <input type="checkbox" checked={s.tutorLevelUpMoveSanity} onChange={e => set("tutorLevelUpMoveSanity", e.target.checked)} />
              Level-Up Move Sanity<Tooltip text={tooltips.tutorLevelUpMoveSanity} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.keepFieldMoveTutors} onChange={e => set("keepFieldMoveTutors", e.target.checked)} />
              Keep Field Move Tutors<Tooltip text={tooltips.keepFieldMoveTutors} />
            </span>
            <span className="checkbox-label">
              <input type="checkbox" checked={s.blockBrokenTutorMoves} onChange={e => set("blockBrokenTutorMoves", e.target.checked)} />
              Block Broken Moves<Tooltip text={tooltips.blockBrokenTutorMoves} />
            </span>
            <div>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.tutorsForceGoodDamaging}
                  onChange={e => set("tutorsForceGoodDamaging", e.target.checked)} />
                Force Good Damaging Move<Tooltip text={tooltips.tutorsForceGoodDamaging} />
              </span>
              {s.tutorsForceGoodDamaging && (
                <div className="sub-row">
                  <span className="text-xs text-gray-500">At least:</span>
                  <input type="number" min={0} max={100} className="input-field"
                    value={s.tutorsGoodDamagingPercent}
                    onChange={e => set("tutorsGoodDamagingPercent", Number(e.target.value))} />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 border-t border-gray-200 pt-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tutor Compatibility<Tooltip text={tooltips.moveTutorsCompatibilityMod} /></span>
          <div className="field-row mt-1 mb-1">
            {(["UNCHANGED", "RANDOM_PREFER_TYPE", "COMPLETELY_RANDOM", "FULL"] as UPRSettings["moveTutorsCompatibilityMod"][]).map(m => (
              <span key={m} className="radio-label">
                <input type="radio" name="tutorCompat" checked={s.moveTutorsCompatibilityMod === m}
                  onChange={() => set("moveTutorsCompatibilityMod", m)} />
                {m === "UNCHANGED" ? "Unchanged" : m === "RANDOM_PREFER_TYPE" ? "Random (Type)" : m === "COMPLETELY_RANDOM" ? "Completely Random" : "Full"}
              </span>
            ))}
          </div>
          <span className="checkbox-label">
            <input type="checkbox" checked={s.tutorFollowEvolutions} onChange={e => set("tutorFollowEvolutions", e.target.checked)} />
            Follow Evolutions<Tooltip text={tooltips.tutorFollowEvolutions} />
          </span>
        </div>
      </div>

    </div>
  );
}

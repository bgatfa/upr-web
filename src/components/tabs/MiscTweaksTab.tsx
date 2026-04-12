import type { UPRSettings } from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { miscTweakOptions } from "@/lib/miscTweaks";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

export function MiscTweaksTab({ s, set, rom }: Props) {
  function toggleTweak(bit: number, enabled: boolean) {
    const next = enabled
      ? (s.currentMiscTweaks | bit)
      : (s.currentMiscTweaks & ~bit);
    set("currentMiscTweaks", next);
  }

  const availableMask = rom?.miscTweakMask ?? 0;
  const visibleTweaks = rom
    ? miscTweakOptions.filter((option) => (availableMask & option.bit) !== 0)
    : miscTweakOptions;
  const enabledCount = visibleTweaks.filter((option) => (s.currentMiscTweaks & option.bit) !== 0).length;

  return (
    <div className="flex flex-col gap-0">
      <div className="panel">
        <span className="panel-title">Misc Tweaks</span>
        <p className="text-sm text-gray-600 mb-3">
          These are upstream code tweaks stored in the settings bitmask. Some only apply to certain games; unsupported tweaks may be ignored.
        </p>

        <div className="field-row">
          {visibleTweaks.map((option) => {
            const checked = (s.currentMiscTweaks & option.bit) !== 0;
            return (
              <span key={option.key} className="checkbox-label w-full sm:w-[calc(50%-0.5rem)]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggleTweak(option.bit, e.target.checked)}
                />
                {option.label}
                <Tooltip text={option.tooltip} />
              </span>
            );
          })}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
          {enabledCount} tweak{enabledCount === 1 ? "" : "s"} enabled
        </div>
      </div>
    </div>
  );
}

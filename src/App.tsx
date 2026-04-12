import { useState } from "react";
import { Dices, Download } from "lucide-react";
import type { UPRSettings } from "@/types/settings";
import { defaultSettings } from "@/types/settings";
import { encodeSettings } from "@/lib/settingsEncoder";
import type { RomProfile } from "@/lib/romDetection";
import { detectRomProfile, sanitizeSettingsForRom } from "@/lib/romDetection";
import { RomUpload } from "@/components/RomUpload";
import { LogViewer } from "@/components/LogViewer";
import { GeneralTab } from "@/components/tabs/GeneralTab";
import { PokemonTraitsTab } from "@/components/tabs/PokemonTraitsTab";
import { MovesetsTab } from "@/components/tabs/MovesetsTab";
import { TrainersTab } from "@/components/tabs/TrainersTab";
import { WildPokemonTab } from "@/components/tabs/WildPokemonTab";
import { ItemsTab } from "@/components/tabs/ItemsTab";
import { ImportExportTab } from "@/components/tabs/ImportExportTab";
import { MiscTweaksTab } from "@/components/tabs/MiscTweaksTab";

type TabId = "general" | "traits" | "movesets" | "trainers" | "wild" | "items" | "misc" | "import-export";

const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "traits", label: "Pokemon Traits" },
  { id: "movesets", label: "Moves & Movesets" },
  { id: "trainers", label: "Trainer Pokemon" },
  { id: "wild", label: "Wild Pokemon" },
  { id: "items", label: "Items & Trades" },
  { id: "misc", label: "Misc Tweaks" },
  { id: "import-export", label: "Import / Export" },
];

type Status = "idle" | "randomizing" | "done" | "error";

export default function App() {
  const [rom, setRom] = useState<File | null>(null);
  const [romProfile, setRomProfile] = useState<RomProfile | null>(null);
  const [settings, setSettings] = useState<UPRSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [log, setLog] = useState("");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("randomized.gba");

  function set<K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  function applyPatch(patch: Partial<UPRSettings>) {
    setSettings(prev => ({ ...prev, ...patch }));
  }

  async function handleRomFile(file: File) {
    setRom(file);
    try {
      const profile = await detectRomProfile(file);
      setRomProfile(profile);
      setSettings(prev => sanitizeSettingsForRom(prev, profile));
    } catch {
      setRomProfile(null);
    }
  }

  const basePath = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;
  const JAR_PATH = import.meta.env.VITE_JAR_PATH ?? `/app${basePath}/randomizer.jar`;

  async function handleRandomize() {
    if (!rom) return;
    setStatus("randomizing");
    setError("");
    setLog("");
    setOutputUrl(null);

    try {
      const effectiveSettings = sanitizeSettingsForRom(settings, romProfile);
      const rnqs = encodeSettings(effectiveSettings);
      const { cheerpjRandomize } = await import("@/lib/cheerpjRandomize");
      const { romBlob, filename, log } = await cheerpjRandomize(rom, rnqs, JAR_PATH);

      if (log) setLog(log);
      setOutputUrl(URL.createObjectURL(romBlob));
      setOutputName(filename);
      setStatus("done");
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#e0e0e0]">
      {/* Header bar */}
      <header className="bg-[#c8c8c8] border-b border-gray-400 px-4 py-2 flex items-center gap-3 shadow-sm">
        <Dices className="text-green-700" size={20} />
        <span className="font-bold text-gray-800">Universal Pokemon Randomizer ZX</span>
        <span className="text-xs text-gray-500 ml-1">v4.6.1 — Web Edition</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* ROM row + Randomize button */}
        <div className="panel">
          <span className="panel-title">ROM File</span>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <RomUpload file={rom} onFile={handleRomFile} />
            </div>
            <div className="flex flex-col gap-2 pt-1 min-w-[140px]">
              <button
                className="btn-primary flex items-center justify-center gap-2"
                disabled={!rom || status === "randomizing"}
                onClick={handleRandomize}
              >
                <Dices size={15} />
                {status === "randomizing" ? "Randomizing…" : "Randomize!"}
              </button>
              {status === "done" && outputUrl && (
                <a href={outputUrl} download={outputName}
                  className="btn-secondary flex items-center justify-center gap-1 text-center">
                  <Download size={13} /> Download ROM
                </a>
              )}
            </div>
          </div>

          {status === "error" && (
            <div className="mt-2 px-2 py-1.5 bg-red-50 border border-red-300 rounded text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
          {status === "done" && (
            <div className="mt-2 px-2 py-1.5 bg-green-50 border border-green-300 rounded text-sm text-green-700">
              Done — <strong>{outputName}</strong>
            </div>
          )}
        </div>

        {romProfile && (
          <div className="panel">
            <span className="panel-title">Detected ROM</span>
            <div className="field-row">
              <span className="text-sm text-gray-700"><strong>Family:</strong> {romProfile.family.toUpperCase()}</span>
              {romProfile.generation && <span className="text-sm text-gray-700"><strong>Generation:</strong> {romProfile.generation}</span>}
              {romProfile.gameCode && <span className="text-sm text-gray-700"><strong>Code:</strong> {romProfile.gameCode}</span>}
              {romProfile.gameTitle && <span className="text-sm text-gray-700"><strong>Title:</strong> {romProfile.gameTitle}</span>}
            </div>
          </div>
        )}

        {/* Settings Tabs */}
        <div className="mt-2">
          {/* Tab strip */}
          <div className="flex flex-wrap gap-0.5 items-end ml-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "tab-btn-active" : "tab-btn-inactive"}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content panel */}
          <div className="bg-white border border-gray-400 rounded-b rounded-tr p-4 shadow-sm">
            {activeTab === "general"       && <GeneralTab s={settings} set={set} patch={applyPatch} rom={romProfile} />}
            {activeTab === "traits"        && <PokemonTraitsTab s={settings} set={set} rom={romProfile} />}
            {activeTab === "movesets"      && <MovesetsTab s={settings} set={set} rom={romProfile} />}
            {activeTab === "trainers"      && <TrainersTab s={settings} set={set} rom={romProfile} />}
            {activeTab === "wild"          && <WildPokemonTab s={settings} set={set} rom={romProfile} />}
            {activeTab === "items"         && <ItemsTab s={settings} set={set} rom={romProfile} />}
            {activeTab === "misc"          && <MiscTweaksTab s={settings} set={set} rom={romProfile} />}
            {activeTab === "import-export" && <ImportExportTab s={settings} onChange={applyPatch} />}
          </div>
        </div>

        <LogViewer log={log} />
      </div>
    </div>
  );
}

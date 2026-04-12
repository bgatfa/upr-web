import { useRef, useState } from "react";
import type { UPRSettings } from "@/types/settings";
import { settingsToString, decodeSettingsString, parseRnqsFile, encodeSettings } from "@/lib/settingsEncoder";
import { defaultSettings } from "@/types/settings";
import { Copy, Download, Upload } from "lucide-react";

interface Props {
  s: UPRSettings;
  onChange: (patch: Partial<UPRSettings>) => void;
}

export function ImportExportTab({ s, onChange }: Props) {
  const [exported, setExported] = useState("");
  const [importText, setImportText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    try {
      setExported(settingsToString(s));
      setError("");
    } catch (e) { setError(String(e)); }
  }

  function handleImport() {
    setError("");
    try {
      const base64 = importText.trim();
      if (!base64) return;
      onChange({ ...defaultSettings(), ...decodeSettingsString(base64) });
    } catch (e) { setError("Failed to import: " + String(e)); }
  }

  function handleCopy() {
    navigator.clipboard.writeText(exported).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    try {
      const bytes = encodeSettings(s);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "settings.rnqs"; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(String(e)); }
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const str = parseRnqsFile(ev.target?.result as ArrayBuffer);
        setImportText(str);
        onChange({ ...defaultSettings(), ...decodeSettingsString(str) });
        setError("");
      } catch (err) { setError("Failed to read .rnqs: " + String(err)); }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="flex flex-col gap-0">

      <div className="panel">
        <span className="panel-title">Export Settings</span>
        <div className="flex gap-2 mb-2">
          <button className="btn-secondary" onClick={handleExport}>Generate Settings String</button>
          <button className="btn-secondary flex items-center gap-1" onClick={handleDownload}>
            <Download size={13} /> Download .rnqs
          </button>
        </div>
        {exported && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500">Settings string:</span>
              <button className="btn-secondary py-0.5 px-2 text-xs flex items-center gap-1" onClick={handleCopy}>
                <Copy size={11} /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea readOnly
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-700 font-mono h-20 resize-none"
              value={exported} />
          </div>
        )}
      </div>

      <div className="panel">
        <span className="panel-title">Import Settings</span>
        <div className="flex gap-2 mb-3">
          <button className="btn-secondary flex items-center gap-1" onClick={() => fileRef.current?.click()}>
            <Upload size={13} /> Load .rnqs File
          </button>
          <input ref={fileRef} type="file" accept=".rnqs" className="hidden" onChange={handleFileImport} />
        </div>
        <p className="text-xs text-gray-500 mb-1">Or paste a settings string:</p>
        <textarea
          className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-700 font-mono h-20 resize-none mb-2
                     focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Paste UPR settings string here…"
          value={importText}
          onChange={e => setImportText(e.target.value)}
        />
        <button className="btn-primary" onClick={handleImport} disabled={!importText.trim()}>
          Apply Settings
        </button>
      </div>

      {error && (
        <div className="panel border-red-300 bg-red-50">
          <span className="panel-title" style={{ backgroundColor: "rgb(254 242 242)" }}>Error</span>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

    </div>
  );
}

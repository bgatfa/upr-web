import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface Props {
  onFile: (file: File) => void | Promise<void>;
  file: File | null;
}

export function RomUpload({ onFile, file }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }

  return (
    <div
      className={`border-2 border-dashed rounded px-4 py-3 text-center cursor-pointer transition-colors
        ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-400 hover:border-gray-500 bg-gray-50"}`}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
    >
      <input ref={inputRef} type="file" accept=".gba,.nds,.gb,.gbc,.3ds,.cxi"
        className="hidden" onChange={handleChange} />
      <Upload className="mx-auto mb-1 text-gray-400" size={22} />
      {file ? (
        <div>
          <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600">Drop ROM here or click to browse</p>
          <p className="text-xs text-gray-400">.gba · .nds · .gb · .gbc · .3ds</p>
        </div>
      )}
    </div>
  );
}

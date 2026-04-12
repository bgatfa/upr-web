interface Props {
  log: string;
}

export function LogViewer({ log }: Props) {
  if (!log) return null;
  return (
    <div className="panel mt-4">
      <span className="panel-title">Randomization Log</span>
      <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-56 overflow-y-auto
                      bg-gray-50 border border-gray-300 rounded p-2 font-mono leading-5">
        {log}
      </pre>
    </div>
  );
}

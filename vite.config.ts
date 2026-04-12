import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function normalizeBuildBase(basePath: string | undefined): string {
  if (!basePath || basePath === "." || basePath === "/") return "/";
  const trimmed = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  return trimmed ? `${trimmed}/` : "/";
}

export default defineConfig(({ mode }) => {
  const buildBase = mode === "development"
    ? "/"
    : normalizeBuildBase(process.env.APP_BASE_PATH ?? "/upr-web/");

  return {
    base: buildBase,
    plugins: [react()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: {
      host: "::",
      port: 5173,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});

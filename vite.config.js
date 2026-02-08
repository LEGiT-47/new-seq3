import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Load environment variables
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const config = {
    disableHotReload: env.DISABLE_HOT_RELOAD === "true",
    enableVisualEdits: env.REACT_APP_ENABLE_VISUAL_EDITS === "true",
    enableHealthCheck: env.ENABLE_HEALTH_CHECK === "true",
  };

  const plugins = [
    react({
      // ✅ Treat both .js and .jsx files as JSX
      jsxInclude: "**/*.{js,jsx}",
    }),
  ];

  // Placeholder for visual edits plugin
  if (config.enableVisualEdits) {
    console.log("🧩 Visual edits mode enabled (custom plugin placeholder)");
    // Example: plugins.push(visualEditsPlugin())
  }

  if (config.enableHealthCheck) {
    console.log("💚 Health check endpoints enabled");
  }

  return {
    plugins,

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      // Disable HMR if requested
      hmr: config.disableHotReload ? false : { overlay: true },

      // Add health check route if enabled
      ...(config.enableHealthCheck && {
        middlewareMode: false,
        setup: (server) => {
          server.middlewares.use("/health", (_, res) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok" }));
          });
        },
      }),
    },

    build: {
      outDir: "dist",
      rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
    },
  };
});

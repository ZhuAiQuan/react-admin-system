import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        _c: path.resolve(__dirname, "src/components"),
        api: path.resolve(__dirname, "src/api"),
        utils: path.resolve(__dirname, "src/utils"),
        views: path.resolve(__dirname, "src/views"),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    server: {
      open: false,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: "http://192.168.18.13:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          // 配置less全局的变量
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve(
              __dirname,
              "src/styles/variables.less"
            )}";`,
            "primary-color": "#2CB2C2",
            "font-size-base": "14px",
            "border-color-base": "#E8E8E8",
            "text-color": "#231815",
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      minify: process.env.VITE_NODE_ENV === "production" ? "esbuild" : false,
      outDir: env.VITE_APP_DIR,
    },
  });
};

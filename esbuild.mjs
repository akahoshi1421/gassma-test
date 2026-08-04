import esbuild from "esbuild";
import { gasEsbuildPlugin } from "@gassma/gas-esbuild-plugin";

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: false,
    outfile: "./dist/index.js",
    plugins: [gasEsbuildPlugin()],
  })
  .catch((error) => {
    console.error("Build failed.");
    console.error(error);
    process.exit(1);
  });

import alias from "esbuild-plugin-alias";
import { build } from "esbuild";
import fs from "fs/promises";
import path from "path";

const tsconfig = JSON.parse(await fs.readFile("./tsconfig.json"));
const aliases = Object.fromEntries(Object.entries(tsconfig.compilerOptions.paths).map(([alias, [target]]) => [alias, path.resolve(target)]));

try {
    await build({
        entryPoints: ["./src/index.ts"],
        outfile: "./dist/vendetta.js",
        minify: true,
        bundle: true,
        format: "iife",
        external: ["react", "react-native"],
        target: "esnext",
        plugins: [alias(aliases)],
        legalComments: "external",
    });

    await fs.appendFile("./dist/vendetta.js", "//# sourceURL=Vendetta");
    console.log("Build successful!");
} catch (e) {
    console.error("Build failed...", e);
    process.exit(1);
}
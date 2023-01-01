import { build } from "esbuild";
import alias from "esbuild-plugin-alias";
import esg from "esbuild-plugin-external-global";
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
        target: "esnext",
        plugins: [
            alias(aliases),
            esg.externalGlobalPlugin({
                "react": "window.React",
            })
        ],
        legalComments: "external",
    });

    await fs.appendFile("./dist/vendetta.js", "//# sourceURL=Vendetta");
    console.log("Build successful!");
} catch (e) {
    console.error("Build failed...", e);
    process.exit(1);
}
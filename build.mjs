import { build } from "esbuild";
import { promisify } from "util";
import { exec as _exec } from "child_process";
import { replace } from "esbuild-plugin-replace";
import alias from "esbuild-plugin-alias";
import esg from "esbuild-plugin-external-global";
import fs from "fs/promises";
import path from "path";
const exec = promisify(_exec);

const tsconfig = JSON.parse(await fs.readFile("./tsconfig.json"));
const aliases = Object.fromEntries(Object.entries(tsconfig.compilerOptions.paths).map(([alias, [target]]) => [alias, path.resolve(target)]));
const commit = (await exec("git rev-parse HEAD")).stdout.trim().substring(0, 7) || "custom";

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
            }),
            replace({
                "__vendettaVersion": commit,
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
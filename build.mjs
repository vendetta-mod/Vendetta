import { promisify } from "util";
import { exec as _exec } from "child_process";
import fs from "fs/promises";

import { rollup } from "rollup";
import { swc } from "rollup-plugin-swc3";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import esbuild from "rollup-plugin-esbuild";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";

const exec = promisify(_exec);
const commit = (await exec("git rev-parse HEAD")).stdout.trim().substring(0, 7) || "custom";

try {
    const bundle = await rollup({
        input: "src/index.ts",
        onwarn: () => {},
        plugins: [
            replace({
                __vendettaVersion: commit,
                preventAssignment: true,
            }),
            typescriptPaths(),
            nodeResolve({ extensions: [".tsx", ".ts", ".jsx", ".js", ".json"] }),
            swc({
                env: {
                    targets: "defaults",
                    include: [
                        "transform-classes",
                        "transform-arrow-functions",
                    ],
                },
            }),
            esbuild({ minify: true }),
        ],
    });

    await bundle.write({
        format: "iife",
        file: "dist/vendetta.js",
        compact: true,
    });
    await bundle.close();

    await fs.appendFile("./dist/vendetta.js", "//# sourceURL=Vendetta");
    console.log("Build successful!");
} catch (e) {
    console.error("Build failed...", e);
    process.exit(1);
}

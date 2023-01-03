import { Indexable, PluginManifest, Plugin } from "@types";

export const plugins: Indexable<Plugin> = {};

export async function fetchPlugin(url: string) {
    if (!url.endsWith("/")) url += "/";

    if (plugins[url]) throw new Error(`That plugin is already installed!`);

    let pluginManifest: PluginManifest;

    try {
        pluginManifest = await (await fetch(new URL("manifest.json", url), { cache: "no-store" })).json();
    } catch {
        throw new Error(`Failed to fetch manifest for ${url}`);
    }

    plugins[url] = {
        id: url.split("://")[1],
        manifest: pluginManifest,
        enabled: true,
        js: "",
    };
}
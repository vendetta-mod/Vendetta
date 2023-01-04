import { Indexable, PluginManifest, Plugin } from "@types";
import logger from "./logger";

type EvaledPlugin = {
    onLoad?(): void;
    onUnload(): void;
};

export const plugins: Indexable<Plugin> = {};
const loadedPlugins: Indexable<EvaledPlugin> = {};

export async function fetchPlugin(url: string) {
    if (!url.endsWith("/")) url += "/";

    const id = url.split("://")[1];
    if (typeof url !== "string" || url in plugins) throw new Error("Plugin ID invalid or taken");

    let pluginManifest: PluginManifest;

    try {
        pluginManifest = await (await fetch(new URL("manifest.json", url), { cache: "no-store" })).json();
    } catch {
        throw new Error(`Failed to fetch manifest for ${url}`);
    }

    let pluginJs: string;

    // TODO: Remove duplicate error if possible
    try {
        // by polymanifest spec, plugins should always specify their main file, but just in case
        pluginJs = await (await fetch(new URL(pluginManifest.main || "index.js", url), { cache: "no-store" })).text();
    } catch {
        throw new Error(`Failed to fetch JS for ${url}`);
    }

    if (pluginJs.length === 0) throw new Error(`Failed to fetch JS for ${url}`);

    plugins[id] = {
        id: id,
        manifest: pluginManifest,
        enabled: false,
        js: pluginJs,
    };
}

export function evalPlugin(plugin: Plugin) {
    // TODO: Refactor to not depend on own window object
    const vendettaForPlugins = Object.assign({}, window.vendetta);
    const pluginString = `vendetta=>{return ${plugin.js}}\n//# sourceURL=${plugin.id}`;

    const raw = (0, eval)(pluginString)(vendettaForPlugins);
    const ret = typeof raw == "function" ? raw() : raw;
    return ret.default || ret;
}

export function startPlugin(id: string) {
    const plugin = plugins[id];
    if (!plugin) throw new Error("Attempted to start non-existent plugin");

    try {
        const pluginRet: EvaledPlugin = evalPlugin(plugin);
        loadedPlugins[id] = pluginRet;
        pluginRet.onLoad?.();
        plugin.enabled = true;
    } catch(e) {
        logger.error(`Plugin ${plugin.id} errored whilst loading, and will be unloaded`, e);

        try {
            loadedPlugins[plugin.id]?.onUnload?.();
        } catch(e2) {
            logger.error(`Plugin ${plugin.id} errored whilst unloading`, e2);
        }

        delete loadedPlugins[id];
        plugin.enabled = false;
    }
}

export function stopPlugin(id: string) {
    const plugin = plugins[id];
    const pluginRet = loadedPlugins[id];
    if (!plugin) throw new Error("Attempted to stop non-existent plugin");
    if (!pluginRet) throw new Error("Attempted to stop a non-started plugin");

    try {
        loadedPlugins[plugin.id]?.onUnload?.();
    } catch(e) {
        logger.error(`Plugin ${plugin.id} errored whilst unloading`, e);
    }

    delete loadedPlugins[id];
    plugin.enabled = false;
}

// TODO: When startAllPlugins exists, return this so cleanup in index.ts is easier
const stopAllPlugins = () => Object.keys(loadedPlugins).forEach(stopPlugin);
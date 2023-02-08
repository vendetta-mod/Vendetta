import { Indexable, PluginManifest, Plugin } from "@types";
import { awaitSyncWrapper, createMMKVBackend, createStorage, wrapSync } from "@lib/storage";
import safeFetch from "@utils/safeFetch";
import logger from "@lib/logger";

// TODO: Properly implement hash-based updating

type EvaledPlugin = {
    onLoad?(): void;
    onUnload(): void;
    settings: JSX.Element;
};

export const plugins = wrapSync(createStorage<Indexable<Plugin>>(createMMKVBackend("VENDETTA_PLUGINS")));
const loadedPlugins: Indexable<EvaledPlugin> = {};

export async function fetchPlugin(id: string) {
    if (!id.endsWith("/")) id += "/";
    const existingPlugin = plugins[id];

    let pluginManifest: PluginManifest;

    try {
        pluginManifest = await (await safeFetch(id + "manifest.json", { cache: "no-store" })).json();
    } catch {
        throw new Error(`Failed to fetch manifest for ${id}`);
    }

    let pluginJs: string | undefined;

    if (existingPlugin?.manifest.hash !== pluginManifest.hash) {
        try {
            // by polymanifest spec, plugins should always specify their main file, but just in case
            pluginJs = await (await safeFetch(id + (pluginManifest.main || "index.js"), { cache: "no-store" })).text();
        } catch {
            throw new Error(`Failed to fetch JS for ${id}`);
        }

        if (pluginJs.length === 0) throw new Error(`Failed to fetch JS for ${id}`);
    }

    plugins[id] = {
        id: id,
        manifest: pluginManifest,
        enabled: existingPlugin?.enabled ?? false,
        update: existingPlugin?.update ?? true,
        js: pluginJs ?? existingPlugin.js,
    };
}

export async function installPlugin(id: string, enabled = true) {
    if (!id.endsWith("/")) id += "/";
    if (typeof id !== "string" || id in plugins) throw new Error("Plugin already installed");
    await fetchPlugin(id);
    if (enabled) await startPlugin(id);
}

export async function evalPlugin(plugin: Plugin) {
    const vendettaForPlugins = {
        ...window.vendetta,
        plugin: {
            manifest: plugin.manifest,
            // Wrapping this with wrapSync is NOT an option.
            storage: await createStorage<Indexable<any>>(createMMKVBackend(plugin.id)),
        }
    };
    const pluginString = `vendetta=>{return ${plugin.js}}\n//# sourceURL=${plugin.id}`;

    const raw = (0, eval)(pluginString)(vendettaForPlugins);
    const ret = typeof raw == "function" ? raw() : raw;
    return ret.default || ret;
}

export async function startPlugin(id: string) {
    if (!id.endsWith("/")) id += "/";
    const plugin = plugins[id];
    if (!plugin) throw new Error("Attempted to start non-existent plugin");

    try {
        const pluginRet: EvaledPlugin = await evalPlugin(plugin);
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

export function stopPlugin(id: string, disable = true) {
    if (!id.endsWith("/")) id += "/";
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
    disable && (plugin.enabled = false);
}

export function removePlugin(id: string) {
    if (!id.endsWith("/")) id += "/";
    const plugin = plugins[id];
    if (plugin.enabled) stopPlugin(id);
    delete plugins[id];
}

export async function initPlugins() {
    await awaitSyncWrapper(plugins);
    
    const allIds = Object.keys(plugins);
    await Promise.allSettled(allIds.filter(pl => plugins[pl].enabled && plugins[pl].update).map((pl) => fetchPlugin(pl)));
    await Promise.allSettled(allIds.filter(pl => plugins[pl].enabled).map((pl) => startPlugin(pl)));

    return stopAllPlugins;
}

const stopAllPlugins = () => Object.keys(loadedPlugins).forEach(p => stopPlugin(p, false));

export const getSettings = (id: string) => loadedPlugins[id]?.settings;

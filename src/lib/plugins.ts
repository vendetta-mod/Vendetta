import { Indexable, PluginManifest, Plugin } from "@types";
import { AsyncStorage } from "@metro/common";
import logger from "@lib/logger";

type EvaledPlugin = {
    onLoad?(): void;
    onUnload(): void;
    settings: JSX.Element;
};

const proxyValidator = {
    get(target: object, key: string | symbol): any {
        const orig = Reflect.get(target, key);

        if (typeof orig === "object" && orig !== null) {
            return new Proxy(orig, proxyValidator);
        } else {
            return orig;
        }
    },

    set(target: object, key: string | symbol, value: any) {
        Reflect.set(target, key, value);
        AsyncStorage.setItem("VENDETTA_PLUGINS", JSON.stringify(plugins));
        return true;
    },

    deleteProperty(target: object, key: string | symbol) {
        Reflect.deleteProperty(target, key);
        AsyncStorage.setItem("VENDETTA_PLUGINS", JSON.stringify(plugins));
        return true;
    }
}

export const plugins: Indexable<Plugin> = new Proxy({}, proxyValidator);
const loadedPlugins: Indexable<EvaledPlugin> = {};

export async function fetchPlugin(id: string) {
    if (!id.endsWith("/")) id += "/";
    if (typeof id !== "string" || id in plugins) throw new Error("Plugin ID invalid or taken");

    let pluginManifest: PluginManifest;

    try {
        pluginManifest = await (await fetch(new URL("manifest.json", id), { cache: "no-store" })).json();
    } catch {
        throw new Error(`Failed to fetch manifest for ${id}`);
    }

    let pluginJs: string;

    // TODO: Remove duplicate error if possible
    try {
        // by polymanifest spec, plugins should always specify their main file, but just in case
        pluginJs = await (await fetch(new URL(pluginManifest.main || "index.js", id), { cache: "no-store" })).text();
    } catch {
        throw new Error(`Failed to fetch JS for ${id}`);
    }

    if (pluginJs.length === 0) throw new Error(`Failed to fetch JS for ${id}`);

    plugins[id] = {
        id: id,
        manifest: pluginManifest,
        enabled: false,
        update: true,
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

export function removePlugin(id: string) {
    stopPlugin(id);
    delete plugins[id];
}

export const getSettings = (id: string) => loadedPlugins[id]?.settings;

export const initPlugins = () => AsyncStorage.getItem("VENDETTA_PLUGINS").then(async function (v) {
    if (!v) return;
    const parsedPlugins: Indexable<Plugin> = JSON.parse(v);

    for (let p of Object.keys(parsedPlugins)) {
        const plugin = parsedPlugins[p]

        if (parsedPlugins[p].update) {
            await fetchPlugin(plugin.id);
        } else {
            plugins[p] = parsedPlugins[p];
        }

        if (parsedPlugins[p].enabled && plugins[p]) startPlugin(p);
    }
})

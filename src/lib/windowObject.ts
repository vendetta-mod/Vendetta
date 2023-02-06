import { VendettaObject } from "@types";
import patcher from "@lib/patcher";
import logger from "@lib/logger";
import settings, { loaderConfig } from "@lib/settings";
import * as constants from "@lib/constants";
import * as debug from "@lib/debug";
import * as plugins from "@lib/plugins";
import * as commands from "@lib/commands";
import * as storage from "@lib/storage";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import * as components from "@ui/components";
import * as toasts from "@ui/toasts";
import * as assets from "@ui/assets";
import * as utils from "@utils";

function without<T extends Record<string, any>>(object: T, ...keys: string[]) {
    const cloned = { ...object };
    keys.forEach((k) => delete cloned[k]);
    return cloned;
}

// I wish Hermes let me do async arrow functions
export default async function windowObject(unloads: any[]): Promise<VendettaObject> {
    return {
        patcher: without(patcher, "unpatchAll"),
        metro: { ...metro, common: { ...common } },
        constants,
        utils,
        debug: without(debug, "versionHash", "patchLogHook"),
        ui: {
            components,
            toasts,
            assets,
        },
        plugins: without(plugins, "initPlugins"),
        commands: without(commands, "patchCommands"),
        storage,
        settings,
        loader: {
            identity: window.__vendetta_loader,
            config: loaderConfig,
        },
        logger,
        version: debug.versionHash,
        unload: () => {
            unloads.filter(i => typeof i === "function").forEach(p => p());
            // @ts-expect-error explode
            delete window.vendetta;
        }
    }   
}

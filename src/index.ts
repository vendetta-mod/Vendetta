import patcher from "@lib/patcher";
import logger from "@lib/logger";
import copyText from "@utils/copyText";
import findInReactTree from "@utils/findInReactTree";
import findInTree from "@utils/findInTree";
import * as constants from "@lib/constants";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import * as components from "@ui/components";
import * as toasts from "@ui/toasts";
import { patchAssets, all, find, getAssetByID, getAssetByName, getAssetIDByName } from "@ui/assets";
import initSettings from "@ui/settings";
import { fixTheme } from "@ui/fixTheme";
import { connectToDebugger, patchLogHook, versionHash } from "@lib/debug";
import { plugins, fetchPlugin, evalPlugin, stopPlugin, removePlugin, getSettings } from "@lib/plugins";
import settings from "@lib/settings";
import { registerCommand } from "./lib/commands";

console.log("Hello from Vendetta!");

async function init() {
    let erroredOnLoad = false;

    try {
        window.vendetta = {
            patcher: patcher,
            metro: { ...metro, common: { ...common } },
            constants: { ...constants },
            utils: {
                copyText: copyText,
                findInReactTree: findInReactTree,
                findInTree: findInTree,
            },
            debug: {
                connectToDebugger: connectToDebugger,
            },
            ui: {
                components: { ...components },
                toasts: { ...toasts },
                assets: {
                    all: all,
                    find: find,
                    getAssetByID: getAssetByID,
                    getAssetByName: getAssetByName,
                    getAssetIDByName: getAssetIDByName,
                },
            },
            plugins: {
                plugins: plugins,
                fetchPlugin: fetchPlugin,
                evalPlugin: evalPlugin,
                stopPlugin: stopPlugin,
                removePlugin: removePlugin,
                getSettings: getSettings
            },
            commands: {
                registerCommand: registerCommand
            },
            settings: settings,
            logger: logger,
            version: versionHash,
        };

        patchLogHook();
        patchAssets();
        fixTheme();
        initSettings();
    } catch (e: Error | any) {
        erroredOnLoad = true;
        alert(`Vendetta failed to initialize... ${e.stack || e.toString()}`);
    }

    if (!erroredOnLoad) logger.log("Vendetta is ready!");
};

init();
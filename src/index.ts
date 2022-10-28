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
import { all, find, getAssetByID, getAssetByName, getAssetIDByName } from "@ui/assets";
import patchAssets from "@ui/assets";
import initSettings from "@ui/settings";
import { connectToDebugger, patchLogHook } from "@lib/debug";

console.log("Hello from Vendetta!");

async function init() {
    let erroredOnLoad = false;

    try {
        initSettings();
        patchAssets();
        patchLogHook();
    
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
            logger: logger,
        };
    } catch (e: Error | any) {
        erroredOnLoad = true;
        alert(`Vendetta failed to initialize...\n${e.stack || e.toString()}`);
    }
    
    if (!erroredOnLoad) logger.log("Vendetta is ready!");
};

init();
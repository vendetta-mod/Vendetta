import patcher from "@lib/patcher";
import logger from "@lib/logger";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import { all, find, getAssetByID, getAssetByName, getAssetIDByName } from "@ui/assets";
import patchAssets from "@ui/assets";
import initSettings from "@ui/settings";
import { patchLogHook } from "@lib/debug";

console.log("Hello from Vendetta!");
let erroredOnLoad = false;

try {
    initSettings();
    patchAssets();
    patchLogHook();

    window.vendetta = {
        patcher: patcher,
        metro: { ...metro, common: common },
        logger: logger,
        ui: {
            assets: {
                all: all,
                find: find,
                getAssetByID: getAssetByID,
                getAssetByName: getAssetByName,
                getAssetIDByName: getAssetIDByName,
            },
        },
    };
} catch (e: Error | any) {
    erroredOnLoad = true;
    alert(`Vendetta failed to initialize...\n${e.stack || e.toString()}`);
}

if (!erroredOnLoad) logger.log("Vendetta is ready!");
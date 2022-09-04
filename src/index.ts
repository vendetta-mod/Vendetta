import patcher from "@lib/patcher";
import logger from "@lib/logger";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import copyText from "@utils/copyText";
import findInReactTree from "@utils/findInReactTree";
import findInTree from "@utils/findInTree";
import initSettings from "@ui/settings";

let erroredOnLoad = false;

try {
    initSettings();

    window.vendetta = {
        patcher: { ...patcher },
        metro: { ...metro, common: common },
        utils: {
            copyText: copyText,
            findInReactTree: findInReactTree,
            findInTree: findInTree,
        },
        logger: logger,
    };
} catch(e: Error | any) {
    erroredOnLoad = true;
    alert(`Vendetta failed to initialize...\n${e.stack || e.toString()}`);
}

if (!erroredOnLoad) {
    logger.log("Loaded sucessfully!");
}
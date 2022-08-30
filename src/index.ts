import patcher from "@lib/patcher";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import logger from "./lib/logger";

let erroredOnLoad = false;

try {
    window.vendetta = {
        patcher: { ...patcher },
        metro: { ...metro, common: common },
        logger: logger,
    };
} catch(e: Error | any) {
    erroredOnLoad = true;
    alert(`Vendetta failed to initialize...\n${e.stack || e.toString()}`);
}

if (!erroredOnLoad) {
    logger.log("Loaded sucessfully!");
}
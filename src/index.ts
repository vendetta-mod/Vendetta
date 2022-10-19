import patcher from "@lib/patcher";
import logger from "@lib/logger";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import initSettings from "./ui/settings";

console.log("Hello from Vendetta!");
let erroredOnLoad = false;

try {
    initSettings();

    window.vendetta = {
        patcher: patcher,
        metro: { ...metro, common: common },
        logger: logger,
    };
} catch (e: Error | any) {
    erroredOnLoad = true;
    alert(`Vendetta failed to initialize...\n${e.stack || e.toString()}`);
}

if (!erroredOnLoad) logger.log("Vendetta is ready!");
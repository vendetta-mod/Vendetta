import patcher from "@lib/patcher";
import logger from "@lib/logger";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import initSettings from "./ui/settings";

console.log("Hello from Vendetta!");

try {
    initSettings();

    window.vendetta = {
        patcher: patcher,
        metro: { ...metro, common: common },
        logger: logger,
    };

    logger.log("Vendetta is ready!");
} catch (e: Error | any) {
    alert(`Vendetta failed to initialize...\n${e.stack || e.toString()}`);
}
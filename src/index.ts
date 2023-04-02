import { patchLogHook } from "@lib/debug";
import { patchCommands } from "@lib/commands";
import { initPlugins } from "@lib/plugins";
import { patchAssets } from "@ui/assets";
import initQuickInstall from "@ui/quickInstall";
import initSettings from "@ui/settings";
import initFixes from "@lib/fixes";
import logger from "@lib/logger";
import windowObject from "@lib/windowObject";

export default async () => {
    // Load everything in parallel
    const unloads = await Promise.all([
        patchLogHook(),
        patchAssets(),
        patchCommands(),
        initFixes(),
        initSettings(),
        initQuickInstall(),
    ]);

    // Assign window object
    window.vendetta = await windowObject(unloads);

    // Once done, load plugins
    unloads.push(await initPlugins());

    // We good :)
    logger.log("Vendetta is ready!");
}

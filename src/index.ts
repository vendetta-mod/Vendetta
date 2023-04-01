import { patchLogHook } from "@lib/debug";
import { patchCommands } from "@lib/commands";
import { initPlugins } from "@lib/plugins";
import { patchAssets } from "@ui/assets";
import { awaitSyncWrapper } from "@lib/storage";
import initSettings from "@ui/settings";
import initFixes from "@lib/fixes";
import logger from "@lib/logger";
import windowObject from "@lib/windowObject";
import settings from "@lib/settings";

export default async () => {
    // Load everything in parallel
    const unloads = await Promise.all([
        patchLogHook(),
        patchAssets(),
        patchCommands(),
        initFixes(),
        initSettings(),
    ]);

    // Assign window object
    window.vendetta = await windowObject(unloads);

    // Once done, load plugins
    unloads.push(await initPlugins());

    // :trolley:
    await awaitSyncWrapper(settings)
    settings.flip ??= true;

    // We good :)
    logger.log("Vendetta is ready!");
}

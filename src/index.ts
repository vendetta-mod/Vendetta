import { patchLogHook } from "@lib/debug";
import { patchCommands } from "@lib/commands";
import { initPlugins } from "@lib/plugins";
import { patchAssets } from "@ui/assets";
import initSettings from "@ui/settings";
import initFixes from "@lib/fixes";
import logger from "@lib/logger";
import windowObject from "@lib/windowObject";

// This logs in the native logging implementation, e.g. logcat
console.log("Hello from Vendetta!");

(async () => {
    try {
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

        // We good :)
        logger.log("Vendetta is ready!");
    } catch (e: any) {
        alert(`Vendetta failed to initialize... ${e.stack || e.toString()}`);
    }
})();
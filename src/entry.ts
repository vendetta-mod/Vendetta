import { ClientInfoManager } from "@lib/native";
import { after } from "@lib/patcher";

// This logs in the native logging implementation, e.g. logcat
console.log("Hello from Vendetta!");

async function initBundle() {
    try {
        await import(".").then(i => i.default());
    } catch (e: any) {
        console.error(e?.stack ?? e?.toString());
        alert([
            "Failed to load Vendetta!\n",
            `Build Number: ${ClientInfoManager.Build}`,
            // @ts-expect-error, replaced in build script
            `Vendetta: ${__vendettaVersion}`,
            e?.stack ?? e?.toString(),
        ].join("\n"));
    }
}

// Discord iOS 178.0 (43557) introduced some changes that caused our bundle to load too early, resulting in the app crashing.
// As a workaround, we hook into the factory function of the first module that loads after the bundle to init the bundle.
// This delays our bundle initialization to a certain point where window.modules is ready.
after("factory", Object.values(window.modules).find(m => m.factory), initBundle, true);

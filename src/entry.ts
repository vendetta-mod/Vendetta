import { ClientInfoManager } from "@lib/native";

// This logs in the native logging implementation, e.g. logcat
console.log("Hello from Vendetta!");

(async () => (await import(".")).default().catch(e => {
    console.log(e?.stack ?? e.toString());
    alert([
        "Failed to load Vendetta!\n",
        `Build Number: ${ClientInfoManager.Build}`,
        // @ts-expect-error, replaced in build script
        `Vendetta: ${__vendettaVersion}`,
        e?.stack || e.toString(),
    ].join("\n"));
}))();

// This logs in the native logging implementation, e.g. logcat
console.log("Hello from Vendetta!");

(async () => {
    try {
        await (await import("./src/index.ts")).default();
    } catch (ex) {
        console.log(ex?.stack ?? ex.toString());
        const dialog = [
            "Failed to load Vendetta!\n",
            `Build Number: ${(nativeModuleProxy.InfoDictionaryManager ?? nativeModuleProxy.RTNClientInfoManager).Build}`,
            `Vendetta: ${__vendettaVersion}`,
            ex?.stack || ex.toString(),
        ].join("\n");
        alert(dialog);
    }
})();

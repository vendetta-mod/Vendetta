import { RNConstants } from "@types";
import { ReactNative as RN } from "@metro/common";
import { after } from "@lib/patcher";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import logger from "@lib/logger";
export let socket: WebSocket;

export function connectToDebugger(url: string) {
    if (socket !== undefined && socket.readyState !== WebSocket.CLOSED) socket.close();

    if (!url) {
        showToast("Invalid debugger URL!", getAssetIDByName("Small"));
        return;
    }

    socket = new WebSocket(`ws://${url}`);
    
    socket.addEventListener("open", () => showToast("Connected to debugger.", getAssetIDByName("Check")));
    socket.addEventListener("message", (message: any) => {
        try {
            (0, eval)(message.data);
        } catch (e) {
            console.error(e);
        }
    });

    socket.addEventListener("error", (err: any) => {
        console.log(`Debugger error: ${err.message}`);
        showToast("An error occurred with the debugger connection!", getAssetIDByName("Small"));
    });
}

export function patchLogHook() { 
    const unpatch = after("nativeLoggingHook", globalThis, (args) => {
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ message: args[0], level: args[1] }));
        logger.log(args[0]);
    });

    return () => {
        socket && socket.close();
        unpatch();
    }
}

// @ts-expect-error
export const versionHash: string = __vendettaVersion;

export function getDebugInfo() {
    // Discord
    //! 173.13 renamed this to RTNClientInfoManager.
    const InfoDictionaryManager = RN.NativeModules.InfoDictionaryManager ?? RN.NativeModules.RTNClientInfoManager;
    //! 173.14 renamed this to RTNDeviceManager.
    const DCDDeviceManager = RN.NativeModules.DCDDeviceManager ?? RN.NativeModules.RTNDeviceManager;

    // Hermes
    const hermesProps = window.HermesInternal.getRuntimeProperties();
    const hermesVer = hermesProps["OSS Release Version"];
    const padding = "for RN ";

    // RN
    const PlatformConstants = RN.Platform.constants as RNConstants;
    const rnVer = PlatformConstants.reactNativeVersion;

    return {
        vendetta: {
            version: versionHash,
            loader: window.__vendetta_loader?.name ?? "Unknown",
        },
        discord: {
            version: InfoDictionaryManager.Version,
            build: InfoDictionaryManager.Build,
        },
        react: {
            version: React.version,
            nativeVersion: hermesVer.startsWith(padding) ? hermesVer.substring(padding.length) : `${rnVer.major}.${rnVer.minor}.${rnVer.patch}`,
        },
        hermes: {
            version: hermesVer,
            buildType: hermesProps["Build"],
            bytecodeVersion: hermesProps["Bytecode Version"],
        },
        ...RN.Platform.select(
            {
                android: {
                    os: {
                        name: "Android",
                        version: PlatformConstants.Release,
                        sdk: PlatformConstants.Version
                    },
                },
                ios: {
                    os: {
                        name: PlatformConstants.systemName,
                        version: PlatformConstants.osVersion
                    },
                }
            }
        )!,
        ...RN.Platform.select(
            {
                android: {
                    device: {
                        manufacturer: PlatformConstants.Manufacturer,
                        brand: PlatformConstants.Brand,
                        model: PlatformConstants.Model,
                        codename: DCDDeviceManager.device
                    }
                },
                ios: {
                    device: {
                        manufacturer: DCDDeviceManager.deviceManufacturer,
                        brand: DCDDeviceManager.deviceBrand,
                        model: DCDDeviceManager.deviceModel,
                        codename: DCDDeviceManager.device
                    }
                }
            }
        )!
    }
}

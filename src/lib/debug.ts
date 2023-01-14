import { RNConstants } from "@types";
import { ReactNative as RN } from "@metro/common";
import { after } from "@lib/patcher";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import logger from "@lib/logger";
export let socket: WebSocket;

export function connectToDebugger(url: string) {
    if (socket !== undefined && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
    }

    if (url === "") {
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
    after("nativeLoggingHook", globalThis, (args, ret) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ message: args[0], level: args[1] }));
        }

        logger.log(args[0]);
    });
}

export const versionHash = "__vendettaVersion";

export function getDebugInfo() {
    const InfoDictionaryManager = RN.NativeModules.InfoDictionaryManager;
    const hermesProps = window.HermesInternal.getRuntimeProperties();
    const PlatformConstants = RN.Platform.constants as RNConstants;
    const rnVer = PlatformConstants.reactNativeVersion;
    const DCDDeviceManager = RN.NativeModules.DCDDeviceManager;

    return {
        vendetta: {
            version: versionHash,
        },
        discord: {
            version: InfoDictionaryManager.Version,
            build: InfoDictionaryManager.Build,
        },
        react: {
            version: React.version,
            nativeVersion: `${rnVer.major || 0}.${rnVer.minor || 0}.${rnVer.patch || 0}`,
        },
        hermes: {
            version: hermesProps["OSS Release Version"],
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
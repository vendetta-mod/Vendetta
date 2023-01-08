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

import { after } from "spitroast";
import logger from "@lib/logger";
export let socket: WebSocket;

let iLoveBundlers = eval;

export function connectToDebugWS(url: string) {
    if (socket !== undefined && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
    }

    socket = new WebSocket(`ws://${url}`);

    socket.addEventListener("message", (message: any) => {
        try {
            console.log(iLoveBundlers(message.data));
        } catch (e) {
            console.error(e);
        }
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

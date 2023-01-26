import { Emitter, EmitterEvent, EmitterListener, EmitterListenerData, EmitterListeners } from "@types";

export const Events = Object.freeze({
  GET: "GET",
  SET: "SET",
  DEL: "DEL"
});

export default function createEmitter(): Emitter {
  return {
    listeners: Object.values(Events).reduce<EmitterListeners>((acc, val: string) => ((acc[val] = new Set<EmitterListener>()), acc), {}) as EmitterListeners,

    on(event: EmitterEvent, listener: EmitterListener) {
      if (!this.listeners[event].has(listener))
        this.listeners[event].add(listener);
    },

    off(event: EmitterEvent, listener: EmitterListener) {
      this.listeners[event].delete(listener);
    },

    once(event: EmitterEvent, listener: EmitterListener) {
      const once = (event: EmitterEvent, data: EmitterListenerData) => {
        this.off(event, once);
        listener(event, data);
      }
      this.on(event, once);
    },

    emit(event: EmitterEvent, data: EmitterListenerData) {
      for (const listener of this.listeners[event])
        listener(event, data);
    },
  };
}

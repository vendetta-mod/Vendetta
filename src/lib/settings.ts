import { createMMKVBackend, createStorage, wrapSync } from "@lib/storage";
import { Settings } from "@types";

export default wrapSync(createStorage<Settings>(createMMKVBackend("VENDETTA_SETTINGS")));

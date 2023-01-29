import { createStorage, wrapSync } from "@lib/storage";
import { Settings } from "@types";

export default wrapSync(createStorage<Settings>("VENDETTA_SETTINGS"));

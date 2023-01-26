import { createStorage } from "@lib/storage";
import { Settings } from "@types";

let settings;
createStorage<Settings>("VENDETTA_SETTINGS").then((s) => (settings = s));
export default settings;

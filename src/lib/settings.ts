import createStorage from "@lib/storage";
import { Settings } from "@types";

// TODO: Switch to using 'any' as type?
export default createStorage<Settings>("VENDETTA_SETTINGS");
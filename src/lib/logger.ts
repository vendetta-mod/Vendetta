import { Logger } from "@/def";
import { findByProps } from "./metro/filters";

const logModule = findByProps("setLogFn").default;
const logger: Logger = new logModule("Vendetta");

export default logger;
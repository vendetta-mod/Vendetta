import patcher from "@lib/patcher";
import * as metro from "@metro/filters";

window.vendetta = {
    patcher: { ...patcher },
    metro: { ...metro },
};
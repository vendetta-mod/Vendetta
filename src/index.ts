import patcher from "@lib/patcher";
import * as metro from "@metro/filters";
import * as common from "@metro/common";

window.vendetta = {
    patcher: { ...patcher },
    metro: { ...metro, common: common },
};
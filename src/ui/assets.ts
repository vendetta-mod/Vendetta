import { Asset, Assets } from "@types";
import { after } from "@lib/patcher";
import { findByProps } from "@metro/filters";

const assetsModule = findByProps("registerAsset");

export const all: Assets = {};

export default function patchAssets() {
    try {
        after("registerAsset", assetsModule, (args: Asset[], id: number) => {
            const asset = args[0];
            all[asset.name] = { ...asset, id: id };
        });

        for (let id = 1; ; id++) {
            const asset = assetsModule.getAssetByID(id);
            if (!asset) break;
            if (all[asset.name]) continue;
        };
    } catch {};
}

export const find = (filter: (a: any) => void): Asset | null | undefined => Object.values(all).find(filter);
export const getAssetByName = (name: string): Asset => all[name];
export const getAssetByID = (name: string): Asset => assetsModule.getAssetByID(name);
export const getAssetIDByName = (name: string) => all[name]?.id;
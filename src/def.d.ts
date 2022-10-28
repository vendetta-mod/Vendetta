import * as _spitroast from "spitroast";
import _React from "react";
import _RN from "react-native";
import _AsyncStorage from "@react-native-async-storage/async-storage";

type MetroModules = { [id: number]: any };

// Helper types for API functions
type PropIntellisense<P extends string | symbol> = Record<P, any> & Record<PropertyKey, any>;
type PropsFinder = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>;
type PropsFinderAll = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>[];

type LoggerFunction = (...messages: any[]) => void;
interface Logger {
    log: LoggerFunction;
    info: LoggerFunction;
    warn: LoggerFunction;
    error: LoggerFunction;
    time: LoggerFunction;
    trace: LoggerFunction;
    verbose: LoggerFunction;
}

type SearchFilter = (tree: any) => boolean;
interface FindInTreeOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

interface Asset {
    name: string;
    id: number;
}

interface Assets {
    [id: string]: Asset;
}

interface VendettaObject {
    patcher: {
        after: typeof _spitroast.after;
        before: typeof _spitroast.before;
        instead: typeof _spitroast.instead;
        unpatchAll: typeof _spitroast.unpatchAll;
    };
    metro: {
        findByProps: PropsFinder;
        findByPropsAll: PropsFinderAll;
        findByDisplayName: (name: string, defaultExp: boolean) => any;
        findByDisplayNameAll: (name: string, defaultExp: boolean) => any[];
        common: {
            constants: PropIntellisense<"API_HOST">;
            channels: PropIntellisense<"getVoiceChannelId">;
            i18n: PropIntellisense<"Messages">;
            url: PropIntellisense<"openURL">;
            toasts: PropIntellisense<"open" | "close">;
            React: typeof _React;
            ReactNative: typeof _RN;
            AsyncStorage: typeof _AsyncStorage;
        };
    };
    constants: {
        DISCORD_SERVER: string;
        GITHUB: string;
    };
    utils: {
        copyText: (content: string) => void;
        findInReactTree: (tree: { [key: string]: any }, filter: SearchFilter) => void;
        findInTree: (tree: { [key: string]: any }, filter: SearchFilter, options: FindInTreeOptions) => any;
    };
    debug: {
        connectToDebugger: (url: string) => void;
    }
    ui: {
        components: {
            Forms: PropIntellisense<"FormSection">;
        }
        toasts: {
            showToast: (content: string, asset: number) => void;
        };
        assets: {
            all: Assets;
            find: (filter: (a: any) => void) => Asset | null | undefined;
            getAssetByName: (name: string) => Asset;
            getAssetByID: (id: number) => Asset;
            getAssetIDByName: (name: string) => number;
        };
    };
    logger: Logger;
}

declare global {
    interface Window {
        [key: PropertyKey]: any;
        modules: MetroModules;
        vendetta: VendettaObject;
    }
}

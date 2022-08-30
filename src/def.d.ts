import * as _spitroast from "spitroast";

type MetroModules = { [id: number]: any }

// Helper types for API functions
type PropIntellisense<P extends string | symbol> = Record<P, any> & Record<PropertyKey, any>;
type PropsFinder = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>;
type PropsFinderAll = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>[];
interface FindInTreeOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

// API object
interface VendettaObject {
    patcher: {
        after: typeof _spitroast.after;
        before: typeof _spitroast.before;
        instead: typeof _spitroast.instead;
        unpatchAll: typeof _spitroast.unpatchAll;
    },
    metro: {
        findByProps: PropsFinder;
        findByPropsAll: PropsFinderAll;
        findByDisplayName: (name: string, defaultExp: boolean) => any;
        findByDisplayNameAll: (name: string, defaultExp: boolean) => any[];
    }
}

declare global {
    interface Window {
        [key: PropertyKey]: any;
        vendetta: VendettaObject;
        modules: MetroModules;
    }
}
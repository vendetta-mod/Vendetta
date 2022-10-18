import * as _spitroast from "spitroast";

type MetroModules = { [id: number]: any };

// Helper types for API functions
type PropIntellisense<P extends string | symbol> = Record<P, any> & Record<PropertyKey, any>;
type PropsFinder = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>;
type PropsFinderAll = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>[];

type LoggerFunction = (...messages: any[]) => void;
interface Logger {
    log: LoggerFunction,
    info: LoggerFunction,
    warn: LoggerFunction,
    error: LoggerFunction,
    time: LoggerFunction,
    trace: LoggerFunction,
    verbose: LoggerFunction,
}

type SearchFilter = (tree: any) => boolean;
interface FindInTreeOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

interface VendettaObject {
    patcher: {
        after: typeof _spitroast.after;
        before: typeof _spitroast.before;
        instead: typeof _spitroast.instead;
        unpatchAll: typeof _spitroast.unpatchAll;
    }
    metro: {
        findByProps: PropsFinder;
        findByPropsAll: PropsFinderAll;
        findByDisplayName: (name: string, defaultExp: boolean) => any;
        findByDisplayNameAll: (name: string, defaultExp: boolean) => any[];
        // TODO: Proper typing for common modules
        common: Object;
    }
    logger: Logger;
}

declare global {
    interface Window {
        [key: PropertyKey]: any;
        modules: MetroModules;
        vendetta: VendettaObject;
    }
}
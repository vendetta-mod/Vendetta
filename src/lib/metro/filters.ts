import { MetroModules, PropsFinder, PropsFinderAll } from "@types";

// Metro require
declare const __r: (moduleId: number) => any;
let moment: any;

// Function to blacklist a module, preventing it from being searched again
function blacklist(id: number) {
    Object.defineProperty(window.modules, id, {
        value: window.modules[id],
        enumerable: false,
        configurable: true,
        writable: true
    })
}

// Blacklist any "bad-actor" modules
for (const key in window.modules) {
    const id = Number(key);
    const module = window.modules[id].publicModule.exports;

    if (!moment && module && module.isMoment) moment = module;

    if (!module || module === window || module["proxygone"] === null) {
        blacklist(id);
        continue;
    }
}

// Function to filter through modules
export const filterModules = (modules: MetroModules, single = false) => (filter: (m: any) => boolean) => {
    const found = [];

    // Get the previous moment locale
    const previousLocale = moment?.locale();

    for (const key in modules) {
        const id = Number(key);
        const module = modules[id].publicModule.exports;

        if (!modules[id].isInitialized) try {
            __r(id);
            // Set moment locale, sort of crappy fix but works I guess
            if (previousLocale && previousLocale !== moment.locale()) moment.locale(previousLocale);
        } catch {};

        if (!module) {
            blacklist(id);
            continue;
        };

        try {
            if (module.default && module.__esModule && filter(module.default)) {
                if (single) return module.default;
                found.push(module.default);
            }

            if(filter(module)) {
                if (single) return module;
                else found.push(module);
            }
        } catch (e: Error | any) {
            console.error(`Failed to getModule... ${e.stack || e.toString()}`);
        }
    }

    if (!single) return found;
}

export const modules = window.modules;
export const find = filterModules(modules, true);
export const findAll = filterModules(modules);

const propsFilter = (props: (string | symbol)[]) => (m: any) => props.every((p) => m[p] !== undefined);
const dNameFilter = (name: string, defaultExp: boolean) => (defaultExp ? (m: any) => m.name === name : (m: any) => m?.default?.name === name);

export const findByProps: PropsFinder = (...props) => find(propsFilter(props));
export const findByPropsAll: PropsFinderAll = (...props) => findAll(propsFilter(props));
export const findByDisplayName = (name: string, defaultExp = true) => find(dNameFilter(name, defaultExp));
export const findByDisplayNameAll = (name: string, defaultExp = true) => findAll(dNameFilter(name, defaultExp));
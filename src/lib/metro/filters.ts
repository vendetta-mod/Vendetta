import { MetroModules, PropsFinder, PropsFinderAll } from "@/def";

declare const __r: (moduleId: number) => any;
const moduleBlacklist: string[] = [];

let moment: any;
let locale: any;

const filterModules =
    (modules: MetroModules, single = false) =>
    (filter: (m: any) => boolean) => {
        let foundModules = [];

        for (const mod in modules) {
            if (moduleBlacklist.includes(mod)) continue;

            const module = modules[mod].publicModule.exports;

            if (module && module["isMoment"]) moment = module;

            // if (module && module.__proto__ && module.__proto__.updateMessagesForExperiment) locale = module;

            if (!modules[mod].isInitialized) try {
                __r(mod as any as number);
            } catch {
                moduleBlacklist.push(mod);
                continue;
            }

            if (!module || module === window || module["no more null proxy"] === null) {
                moduleBlacklist.push(mod);
                continue;
            }

            if (module.default && module.__esModule && filter(module.default)) {
                if (single) return module.default;
                foundModules.push(module.default);
            }

            if(filter(module)) {
                if (single) return module;
                else foundModules.push(module);
            }
        }

        if (moment) moment.locale("en-gb");
        
        if (!single) return foundModules;
    };

export const modules = window.modules;

export const find = filterModules(modules, true);
export const findAll = filterModules(modules);

const propsFilter = (props: (string | symbol)[]) => (m: any) => props.every((p) => m[p] !== undefined);
const dNameFilter = (name: string, defaultExp: boolean) => (defaultExp ? (m: any) => m.name === name : (m: any) => m?.default?.name === name);

export const findByProps: PropsFinder = (...props) => find(propsFilter(props));
export const findByPropsAll: PropsFinderAll = (...props) => findAll(propsFilter(props));
export const findByDisplayName = (name: string, defaultExp = true) => find(dNameFilter(name, defaultExp));
export const findByDisplayNameAll = (name: string, defaultExp = true) => findAll(dNameFilter(name, defaultExp));
/*
  Disclaimer: https://github.com/Cordwood/Cordwood/blob/91c0b971bbf05e112927df75415df99fa105e1e7/src/lib/utils/findInTree.ts
 */

import { FindInTreeOptions, SearchFilter } from "@/def";

export default function findInTree(tree: { [key: string]: any }, filter: SearchFilter, { walkable = [], ignore = [], maxDepth = 100 }: FindInTreeOptions = {}): any {
    let iteration = 0;

    function doSearch(tree: { [key: string]: any }, filter: SearchFilter, { walkable = [], ignore = [] }: FindInTreeOptions = {}): any {
        iteration += 1;
        if (iteration > maxDepth) return;

        if (typeof filter === "string") {
            if (tree.hasOwnProperty(filter)) return tree[filter];
        } else if (filter(tree)) return tree;

        if (!tree) return;

        if (Array.isArray(tree)) {
            for (const item of tree) {
                const found = doSearch(item, filter, { walkable, ignore });
                if (found) return found;
            }
        } else if (typeof tree === "object") {
            for (const key of Object.keys(tree)) {
                if (walkable != null && walkable.includes(key)) continue;

                if (ignore.includes(key)) continue;

                try {
                    const found = doSearch(tree[key], filter, { walkable, ignore });
                    if (found) return found;
                } catch {}
            }
        }
    }

    return doSearch(tree, filter, { walkable, ignore });
}
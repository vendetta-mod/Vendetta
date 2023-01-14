import { SearchFilter } from "@types";
import findInTree from "@utils/findInTree";

export default (tree: { [key: string]: any }, filter: SearchFilter): any => findInTree(tree, filter, {
    walkable: ["props", "children", "child", "sibling"],
});
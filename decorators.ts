import { DataContext } from "./data-context";

export function entities(entitiesPath: string) {
    return function (constructor: typeof DataContext) {
        constructor.entitiesPath = entitiesPath;
    }
}
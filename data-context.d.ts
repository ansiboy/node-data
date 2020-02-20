import { EntityManager } from "typeorm";
export declare class DataContext {
    protected manager: EntityManager;
    constructor(manager: EntityManager);
}
export interface DataContextClass<T extends DataContext> {
    new (manager: EntityManager): T;
}

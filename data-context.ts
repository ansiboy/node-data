import { EntityManager } from "typeorm";
export class DataContext {
    protected manager: EntityManager;
    constructor(manager: EntityManager) {
        this.manager = manager;
    }
}

export interface DataContextClass<T extends DataContext> {
    new(manager: EntityManager): T
}
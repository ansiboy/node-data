import { EntityManager, getConnection, createConnection as sourceCreateConnection, ConnectionOptions, getConnectionManager } from "typeorm";
import { SqliteDriver } from "typeorm/driver/sqlite/SqliteDriver";


import path = require("path");
import fs = require("fs");

export class DataContext {
    protected manager: EntityManager;
    static entitiesPath: string;
    constructor(manager: EntityManager) {
        this.manager = manager;

    }
}

export interface DataContextClass<T extends DataContext> {
    new(manager: EntityManager): T
    entitiesPath: string;
}


import { EntityManager, getConnection, createConnection, ConnectionOptions, getConnectionManager } from "typeorm";
import { ConnectionConfig } from "mysql";
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


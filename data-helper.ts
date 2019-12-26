import { Repository, getConnectionManager, ConnectionOptions, createConnection, getConnection } from "typeorm";
import { ConnectionConfig } from "mysql";
import fs = require("fs");
import { DataContext, DataContextClass } from "./data-context";

export interface SelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}

export interface SelectResult<T> {
    dataItems: T[];
    totalRowCount: number;
}

export class DataHelper {
    static async list<T>(repository: Repository<T>, options: {
        selectArguments?: SelectArguments, relations?: string[],
        fields?: Extract<keyof T, string>[]
    }): Promise<SelectResult<T>> {

        let { selectArguments, relations, fields } = options;
        selectArguments = selectArguments || {};

        let order: { [P in keyof T]?: "ASC" | "DESC" | 1 | -1 };
        if (!selectArguments.sortExpression) {
            let createDateTimeColumn = repository.metadata.columns.filter(o => o.propertyName == "create_date_time" || o.propertyName == "createDateTime")[0];
            if (createDateTimeColumn) {
                selectArguments.sortExpression = `${createDateTimeColumn.propertyName} desc`;
            }
        }

        let arr = selectArguments.sortExpression.split(/\s+/).filter(o => o);
        console.assert(arr.length > 0)
        order = {};
        order[arr[0]] = arr[1].toUpperCase() as any;

        let [items, count] = await repository.findAndCount({
            where: selectArguments.filter, relations,
            skip: selectArguments.startRowIndex,
            take: selectArguments.maximumRows,
            order: order,
            select: fields,

        });

        return { dataItems: items, totalRowCount: count } as SelectResult<T>
    }

    static async createDataContext<T extends DataContext>(connConfig: ConnectionConfig, type: DataContextClass<T>, entitiesPath: string): Promise<T> {
        // let logger = getLogger(`data-helper:${DataHelper.createDataContext.name}`);
        let connectionManager = getConnectionManager();
        if (connectionManager.has(connConfig.database) == false) {
            if (!fs.existsSync(entitiesPath)) {
                // logger.error(`Entities path is not exists, path is ${entitiesPath}.`);
            }

            let entities: string[] = [entitiesPath];
            let dbOptions: ConnectionOptions = {
                type: "mysql",
                host: connConfig.host,
                port: connConfig.port,
                username: connConfig.user,
                password: connConfig.password,
                database: connConfig.database,
                synchronize: true,
                logging: false,
                connectTimeout: 3000,
                entities,
                name: connConfig.database
            }

            await createConnection(dbOptions);
        }

        let connection = getConnection(connConfig.database);
        let dc = new type(connection.manager);
        return dc;
    }

}
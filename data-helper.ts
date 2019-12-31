import { Repository, getConnectionManager, ConnectionOptions, createConnection, getConnection } from "typeorm";
import { ConnectionConfig, MysqlError, createConnection as createDBConnection } from "mysql";
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

        options = options || {};
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

    static async createDataContext<T extends DataContext>(type: DataContextClass<T>, connConfig: ConnectionConfig, entitiesPath: string): Promise<T> {
        let connectionManager = getConnectionManager();
        if (connectionManager.has(connConfig.database) == false) {
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

export function createDatabaseIfNotExists(connConfig: ConnectionConfig, initDatabase?: (conn: ConnectionConfig) => void): Promise<boolean> {
    let dbName = connConfig.database;
    connConfig = Object.assign({}, connConfig);
    connConfig.database = "mysql";

    // let logger = getLogger(`${constants.projectName} ${createDatabaseIfNotExists.name}`, g.settings.logLevel);

    let conn = createDBConnection(connConfig);
    let cmd = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`;
    return new Promise<boolean>(function (resolve, reject) {
        conn.query(cmd, function (err?: MysqlError, result?: Array<any>) {
            if (err) {
                reject(err);
                console.log("err")
                return;
            }

            if (result.length > 0) {
                resolve(false);
                return;
            }

            let sql = `CREATE DATABASE ${dbName}`;
            if (connConfig.charset) {
                sql = sql + ` CHARACTER SET ${connConfig.charset}`;
            }
            conn.query(sql, function (err?: MysqlError) {
                if (err) {
                    reject(err);
                    return;
                }

                // info(`Create databasae ${dbName}.`)

                if (initDatabase) {
                    // info(`Initdatabase function is not null and executed to init the database.`);
                    connConfig.database = dbName;
                    initDatabase(connConfig);
                }

                resolve(true);
            });

        });
    })
}
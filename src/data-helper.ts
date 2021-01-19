import { Repository, getConnectionManager, ConnectionOptions, getConnection, createConnection, Connection } from "typeorm";
import { ConnectionConfig, MysqlError, createConnection as createDBConnection } from "mysql";
import fs = require("fs");
import { DataContext, DataContextClass } from "./data-context";
import { errors } from "./errors";
import { DataSourceSelectArguments, DataSourceSelectResult } from "maishu-toolkit";
import { SqliteDriver } from "typeorm/driver/sqlite/SqliteDriver";

export type SelectArguments = DataSourceSelectArguments;
export type SelectResult<T> = DataSourceSelectResult<T>;

export class DataHelper {
    static async list<T>(repository: Repository<T>, options?: {
        selectArguments?: SelectArguments, relations?: string[],
        fields?: Extract<keyof T, string>[]
    }): Promise<SelectResult<T>> {

        options = options || {};
        let { selectArguments, relations, fields } = options;
        selectArguments = selectArguments || {};

        let order: { [P in keyof T]?: "ASC" | "DESC" | 1 | -1 } | undefined;
        if (!selectArguments.sortExpression) {
            let createDateTimeColumn = repository.metadata.columns.filter(o => o.propertyName == "create_date_time" || o.propertyName == "createDateTime")[0];
            if (createDateTimeColumn) {
                selectArguments.sortExpression = `${createDateTimeColumn.propertyName} desc`;
            }
        }

        if (selectArguments.sortExpression) {
            let arr = selectArguments.sortExpression.split(/\s+/).filter(o => o);
            console.assert(arr.length > 0)
            order = {};
            order[arr[0] as keyof T] = arr[1].toUpperCase() as any;
        }


        let [items, count] = await repository.findAndCount({
            where: selectArguments.filter, relations,
            skip: selectArguments.startRowIndex,
            take: selectArguments.maximumRows,
            order: order,
            select: fields,

        });

        return { dataItems: items, totalRowCount: count } as SelectResult<T>
    }

    static async createDataContext<T extends DataContext>(type: DataContextClass<T>, connConfig: ConnectionOptions): Promise<T> {

        // if (!type.entitiesPath)
        //     throw errors.entityPathIsNull(type.name);

        if (type.entitiesPath != null && fs.existsSync(type.entitiesPath) == false)
            throw errors.entityPathNotExists(type.entitiesPath);

        var database = "";
        if (connConfig.database)
            database = typeof connConfig.database == "string" ? connConfig.database : connConfig.database.toString();

        let connectionManager = getConnectionManager();
        const NAME = "$_create";
        if (!(connectionManager as any)[NAME]) {
            (connectionManager as any)[NAME] = connectionManager.create;
            connectionManager.create = function (options: ConnectionOptions) {
                let r = (this as any)[NAME](options) as Connection;
                if (r.driver instanceof SqliteDriver) {
                    if (r.driver.supportedDataTypes.indexOf("json") < 0)
                        r.driver.supportedDataTypes.push("json");
                }
                return r;
            }
        }

        if (connectionManager.has(database) == false) {
            let dbOptions: ConnectionOptions = Object.assign({
                // type: "mysql",
                // host: connConfig.host,
                // port: connConfig.port,
                // username: connConfig.user,
                // password: connConfig.password,
                database: connConfig.database,
                synchronize: true,
                logging: false,
                connectTimeout: 3000,
                entities: type.entitiesPath != null ? [type.entitiesPath] : [],
                name: database
            }, connConfig);

            await createConnection(dbOptions);
        }

        let connection = getConnection(database);
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
    let cmd = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "${dbName}"`;
    return new Promise<boolean>(function (resolve, reject) {
        conn.query(cmd, function (err?: MysqlError, result?: Array<any>) {
            if (err || result == null) {
                reject(err);
                console.log("err")
                return;
            }

            if (result.length > 0) {
                resolve(false);
                return;
            }

            let sql = `CREATE DATABASE \`${dbName}\``;
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
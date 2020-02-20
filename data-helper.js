"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const mysql_1 = require("mysql");
const fs = require("fs");
const errors_1 = require("./errors");
class DataHelper {
    static async list(repository, options) {
        options = options || {};
        let { selectArguments, relations, fields } = options;
        selectArguments = selectArguments || {};
        let order;
        if (!selectArguments.sortExpression) {
            let createDateTimeColumn = repository.metadata.columns.filter(o => o.propertyName == "create_date_time" || o.propertyName == "createDateTime")[0];
            if (createDateTimeColumn) {
                selectArguments.sortExpression = `${createDateTimeColumn.propertyName} desc`;
            }
        }
        let arr = selectArguments.sortExpression.split(/\s+/).filter(o => o);
        console.assert(arr.length > 0);
        order = {};
        order[arr[0]] = arr[1].toUpperCase();
        let [items, count] = await repository.findAndCount({
            where: selectArguments.filter, relations,
            skip: selectArguments.startRowIndex,
            take: selectArguments.maximumRows,
            order: order,
            select: fields,
        });
        return { dataItems: items, totalRowCount: count };
    }
    static async createDataContext(type, connConfig, entitiesPath) {
        let connectionManager = typeorm_1.getConnectionManager();
        if (connectionManager.has(connConfig.database) == false) {
            let entities = [];
            if (entitiesPath != null) {
                if (fs.existsSync(entitiesPath) == false)
                    throw errors_1.errors.entityPathNotExists(entitiesPath);
                entities.push(entitiesPath);
            }
            let dbOptions = {
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
            };
            await typeorm_1.createConnection(dbOptions);
        }
        let connection = typeorm_1.getConnection(connConfig.database);
        let dc = new type(connection.manager);
        return dc;
    }
}
exports.DataHelper = DataHelper;
function createDatabaseIfNotExists(connConfig, initDatabase) {
    let dbName = connConfig.database;
    connConfig = Object.assign({}, connConfig);
    connConfig.database = "mysql";
    // let logger = getLogger(`${constants.projectName} ${createDatabaseIfNotExists.name}`, g.settings.logLevel);
    let conn = mysql_1.createConnection(connConfig);
    let cmd = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`;
    return new Promise(function (resolve, reject) {
        conn.query(cmd, function (err, result) {
            if (err) {
                reject(err);
                console.log("err");
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
            conn.query(sql, function (err) {
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
    });
}
exports.createDatabaseIfNotExists = createDatabaseIfNotExists;

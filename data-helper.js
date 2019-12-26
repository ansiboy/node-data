"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const fs = require("fs");
class DataHelper {
    static async list(repository, options) {
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
    static async createDataContext(connConfig, type, entitiesPath) {
        // let logger = getLogger(`data-helper:${DataHelper.createDataContext.name}`);
        let connectionManager = typeorm_1.getConnectionManager();
        if (connectionManager.has(connConfig.database) == false) {
            if (!fs.existsSync(entitiesPath)) {
                // logger.error(`Entities path is not exists, path is ${entitiesPath}.`);
            }
            let entities = [entitiesPath];
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

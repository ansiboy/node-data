

export {
    Connection, ConnectionOptions, createConnection,
    Entity, EntityManager, EndCallback, EntityMetadata, EntityOptions, EntityRepository, EntitySchema, EntitySchemaColumnOptions, EntitySchemaIndexOptions,
    EntitySchemaRelationOptions, EntitySubscriberInterface, Equal, EventSubscriber, Exclusion, ExecuteDbAdminCommandOptions,
    FindOneOptions,
    getConnectionManager, getConnection, getManager,
    Repository,
    In, Index, IndexInformationOptions, IndexOptions, InsertEvent, InsertOneWriteOpResult, InsertQueryBuilder, InsertResult, InsertWriteOpResult, IsNull,
    JoinColumn,
    Like,
    ManyToMany, ManyToOne,
    Not,
    OneToMany, OneToOne,
    PrimaryColumn,
    ValueTransformer,
} from "typeorm";
export { DataContext } from "./data-context";
export { createDatabaseIfNotExists, DataHelper, SelectArguments, SelectResult } from "./data-helper";
export { Column } from "./column";
export { entities } from "./decorators";
export { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
export { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

import { ColumnType } from "typeorm";
//==================================================================================================
import { AbstractSqliteDriver } from "typeorm/driver/sqlite-abstract/AbstractSqliteDriver";

// AbstractSqliteDriver.prototype.supportedDataTypes = {
//     get() {

//     }
// }

Object.assign(AbstractSqliteDriver, {
    get supportedDataTypes() {
        return [
            "int",
            "integer",
            "tinyint",
            "smallint",
            "mediumint",
            "bigint",
            "unsigned big int",
            "int2",
            "int8",
            "integer",
            "character",
            "varchar",
            "varying character",
            "nchar",
            "native character",
            "nvarchar",
            "text",
            "clob",
            "text",
            "blob",
            "real",
            "double",
            "double precision",
            "float",
            "real",
            "numeric",
            "decimal",
            "boolean",
            "date",
            "time",
            "datetime",
            "json"
        ];
    }
})
if (AbstractSqliteDriver.prototype.supportedDataTypes != null && AbstractSqliteDriver.prototype.supportedDataTypes.indexOf("json") < 0) {
    AbstractSqliteDriver.prototype.supportedDataTypes.push("json");
}
//==================================================================================================

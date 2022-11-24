

export {
    Connection, ConnectionOptions, createConnection,
    Entity, EntityManager, EndCallback, EntityMetadata, EntityOptions, EntityRepository, EntitySchema, EntitySchemaColumnOptions, EntitySchemaIndexOptions,
    EntitySchemaRelationOptions, EntitySubscriberInterface, Equal, EventSubscriber, Exclusion, ExecuteDbAdminCommandOptions,
    EntityTarget,
    FindOneOptions,
    getConnectionManager, getConnection, getManager,
    Repository,
    In, Index, IndexInformationOptions, IndexOptions, InsertEvent, InsertOneWriteOpResult, InsertQueryBuilder, InsertResult, InsertWriteOpResult, IsNull,
    JoinColumn, JoinTable,
    Like, LessThan, LessThanOrEqual,
    ManyToMany, ManyToOne, MoreThan, MoreThanOrEqual,
    Not,
    OneToMany, OneToOne,
    PrimaryColumn,
    Raw,
    ValueTransformer,


} from "typeorm";
export { DataContext } from "./data-context";
export { createDatabaseIfNotExists, DataHelper, SelectArguments, SelectResult } from "./data-helper";
export { Column } from "./column";
export { entities } from "./decorators";
export { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
export { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
export { BitBooleanTransformer } from "./transformers/bit-boolean-transformer";

import { ColumnType } from "typeorm";
//==================================================================================================
import { AbstractSqliteDriver } from "typeorm/driver/sqlite-abstract/AbstractSqliteDriver";

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

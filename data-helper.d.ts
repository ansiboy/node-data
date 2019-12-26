import { Repository } from "typeorm";
import { ConnectionConfig } from "mysql";
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
export declare class DataHelper {
    static list<T>(repository: Repository<T>, options: {
        selectArguments?: SelectArguments;
        relations?: string[];
        fields?: Extract<keyof T, string>[];
    }): Promise<SelectResult<T>>;
    static createDataContext<T extends DataContext>(connConfig: ConnectionConfig, type: DataContextClass<T>, entitiesPath: string): Promise<T>;
}

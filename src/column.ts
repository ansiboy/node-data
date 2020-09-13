import { Column as BaseColunm, ColumnOptions } from "typeorm";

export let Column = function (options: ColumnOptions) {
    if (options.type == "bit" && options.transformer == null) {
        options.transformer = {
            from(value: Buffer) {
                return value[0] == 1;
            },
            to(value) {
                let d = value ? 1 : 0
                let b = Buffer.from([d]);
                return b;
            }
        }
    }
    return BaseColunm(options);
}
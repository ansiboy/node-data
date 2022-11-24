import { JSONTransformer } from "./transformers/json-transformer";
import { Column as BaseColunm, ColumnOptions } from "typeorm";
import { BitBooleanTransformer } from "./transformers/bit-boolean-transformer";
import { DecimalTransformer } from "transformers/decimal-transformer";

export let Column = function (options?: ColumnOptions) {
    options = options || {};
    if (options.type == "bit" && options.transformer == null) {
        options.transformer = new BitBooleanTransformer()
    }
    else if (options.type == "json" && options.transformer == null) {
        options.transformer = new JSONTransformer()
    }
    else if (options.type == "decimal" && options.transformer == null) {
        options.transformer = new DecimalTransformer()
    }
    return BaseColunm(options);
}
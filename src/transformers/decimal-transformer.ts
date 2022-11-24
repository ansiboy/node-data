import { ValueTransformer } from "typeorm";
export class DecimalTransformer implements ValueTransformer {
    // To db from typeorm
    to(value: number | null): number | null {
        if (value === null) {
            return null;
        }

        return value
    }
    // From db to typeorm
    from(value: number | string | null): number | null {
        if (typeof value === "string") {
            return parseFloat(value);
        }
        return value;
    }
}

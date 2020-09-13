import { errors as baseErrors } from "maishu-toolkit";

export let errors = Object.assign(baseErrors, {
    entityPathNotExists(path: string) {
        let msg = `Entity path '${path}' is not exists.`;
        return new Error(msg);
    },
    entityPathIsNull(dataContextName: string) {
        let msg = `Entity path of ${dataContextName} is null.`;
        return new Error(msg);
    }
});
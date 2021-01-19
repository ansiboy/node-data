import { ValueTransformer } from 'typeorm';
export class JSONTransformer implements ValueTransformer {
    // To db from typeorm
    to(value: object): string | null {
        let res = JSON.stringify(value);
        return res;
    }
    // From db to typeorm
    from(value: string): Object | null {
       let obj = JSON.parse(value);
       return obj;
    }
}

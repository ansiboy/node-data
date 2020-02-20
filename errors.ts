export let errors = {
    entityPathNotExists(path: string) {
        let msg = `Entity path '${path}' is not exists.`;
        return new Error(msg);
    }
}
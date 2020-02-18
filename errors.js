"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = {
    entityPathNotExists(path) {
        let msg = `Entity path '${path}' is not exists.`;
        return new Error(msg);
    }
};

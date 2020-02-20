"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
exports.Column = function (options) {
    if (options.type == "bit" && options.transformer == null) {
        options.transformer = {
            from(value) {
                return value[0];
            },
            to(value) {
                let d = value ? 1 : 0;
                let b = Buffer.from([d]);
                return b;
            }
        };
    }
    return typeorm_1.Column(options);
};

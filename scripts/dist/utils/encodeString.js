"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encodeString = (value) => {
    const buffer = Buffer.alloc(32);
    buffer.fill(value);
    buffer.fill(' ', value.length);
    return Array(...buffer);
};
exports.default = encodeString;

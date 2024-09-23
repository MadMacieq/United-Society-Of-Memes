"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeString = exports.encodeString = void 0;
const encodeString = (value) => {
    const buffer = Buffer.alloc(32);
    buffer.fill(value);
    buffer.fill(' ', value.length);
    return Array(...buffer);
};
exports.encodeString = encodeString;
const decodeString = (bytes) => {
    const buffer = Buffer.from(bytes);
    return buffer.toString('utf8').trim();
};
exports.decodeString = decodeString;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = void 0;
const formatNumber = (number, decimals = 6) => {
    return Number(number.toString()) / Math.pow(10, decimals);
};
exports.formatNumber = formatNumber;

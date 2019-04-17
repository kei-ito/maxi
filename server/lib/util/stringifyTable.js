"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyTable = (table) => `[\n${table.map((row) => `  ${JSON.stringify(row)}`).join(',\n')}\n]`;
//# sourceMappingURL=stringifyTable.js.map
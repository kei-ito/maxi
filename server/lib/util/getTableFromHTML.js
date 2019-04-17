"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getMatchedStrings_1 = require("./getMatchedStrings");
exports.parseTableCellHTML = (tableCellHTML) => tableCellHTML.trim();
exports.parseTableRowHTML = (tableRowHTML) => getMatchedStrings_1.getMatchedStrings(tableRowHTML, /<t[dh][^>]*?>([\s\S]*?)<\/t[dh]/gi).map(exports.parseTableCellHTML);
exports.parseTableHTML = (tableHTML) => getMatchedStrings_1.getMatchedStrings(tableHTML, /<tr[^>]*?>([\s\S]*?)<\/tr/gi).map(exports.parseTableRowHTML);
exports.getTableFromHTML = (html) => getMatchedStrings_1.getMatchedStrings(html, /<table[^>]*?>([\s\S]*?)<\/table/gi).map(exports.parseTableHTML);
//# sourceMappingURL=getTableFromHTML.js.map
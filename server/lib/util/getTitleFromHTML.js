"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getMatchedStrings_1 = require("./getMatchedStrings");
exports.getTitleFromHTML = (html) => (getMatchedStrings_1.getMatchedStrings(html, /<title[^>]*?>([\s\S]*?)<\/title/gi)[0] || '').trim();
//# sourceMappingURL=getTitleFromHTML.js.map
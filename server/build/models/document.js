"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModel = void 0;
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    data: { type: Object },
});
exports.DocumentModel = (0, mongoose_1.model)("documents", documentSchema);

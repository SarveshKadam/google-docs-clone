"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const document_1 = require("./models/document");
const app = (0, express_1.default)();
const port = 3002;
app.use((0, cors_1.default)());
dotenv_1.default.config();
const http = new http_1.default.Server(app);
const mongodbUri = process.env.MONGODB_URI || "";
mongoose_1.default.connect(mongodbUri);
const io = new socket_io_1.Server(http, {
    cors: {
        origin: "https://google-docs-ui-phi.vercel.app",
        methods: ["GET", "POST"],
    },
    transports: ["websocket"],
});
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("get-document", (documentId) => __awaiter(void 0, void 0, void 0, function* () {
        const document = yield findOrCreateUser(documentId);
        socket.join(documentId);
        socket.emit("load-document", document === null || document === void 0 ? void 0 : document.data);
        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });
        socket.on("save-document", (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield document_1.DocumentModel.findByIdAndUpdate(documentId, { data });
        }));
    }));
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
const findOrCreateUser = (documentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!documentId)
            return;
        const document = yield document_1.DocumentModel.findById(documentId);
        if (document) {
            return document;
        }
        return document_1.DocumentModel.create({ _id: documentId });
    }
    catch (error) { }
});
http.listen(port, () => {
    console.log("Server is running on " + port);
});

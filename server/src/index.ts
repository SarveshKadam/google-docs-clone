import cors from "cors";
import express from "express";
import httpInstance from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { DocumentModel } from "./models/document";

const app = express();
const port = 3002;
app.use(cors());
dotenv.config();
const http = new httpInstance.Server(app);

const mongodbUri = process.env.MONGODB_URI || "";
mongoose.connect(mongodbUri);

const io = new Server(http, {
  cors: {
    origin: "https://google-docs-ui-phi.vercel.app",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateUser(documentId);
    socket.join(documentId);
    socket.emit("load-document", document?.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
    socket.on("save-document", async (data) => {
      await DocumentModel.findByIdAndUpdate(documentId, { data });
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const findOrCreateUser = async (documentId: string) => {
  try {
    if (!documentId) return;
    const document = await DocumentModel.findById(documentId);
    if (document) {
      return document;
    }
    return DocumentModel.create({ _id: documentId });
  } catch (error) {}
};

http.listen(port, () => {
  console.log("Server is running on " + port);
});

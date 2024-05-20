import express from "express";
import cors from "cors";
import httpInstance from "http";
import { Server } from "socket.io";

const app = express();
const port = 3002;
app.use(cors());

const http = new httpInstance.Server(app);

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send-changes", (delta) => {
    socket.broadcast.emit("receive-changes", delta);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(port, () => {
  console.log("Server is running on " + port);
});

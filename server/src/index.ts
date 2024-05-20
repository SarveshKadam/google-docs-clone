import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = 3002;
const server = http.createServer(app);

const io = new Server(server);

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.listen(port, () => {
  console.log("Server is running on " + port);
});

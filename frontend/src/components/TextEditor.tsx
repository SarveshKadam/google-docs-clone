import { useEffect, useState } from "react";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const Editor = () => {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState<Quill>();
  const { id } = useParams();

  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules,
      formats,
    });
    quillServer.disable();
    quillServer.setText("Loading the document...");
    setQuill(quillServer);
  }, []);

  useEffect(() => {
    const socketServer = io("https://google-docs-clone-nq12.onrender.com", {
      transports: ["websocket", "polling"],
    });
    socketServer.on("connect_error", () => {
      socketServer.io.opts.transports = ["polling", "websocket"];
    });
    setSocket(socketServer);

    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;

      socket?.emit("send-changes", delta);
    };

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta) => {
      quill.updateContents(delta);
    };

    socket && socket.on("receive-changes", handleChange);

    return () => {
      socket && socket.off("receive-changes", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (quill === null || socket === null) return;

    socket &&
      socket.once("load-document", (document) => {
        quill.setContents(document);
        quill.enable();
      });

    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return (
    <div className="container">
      <div id="container"></div>
    </div>
  );
};

export default Editor;

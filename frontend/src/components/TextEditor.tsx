/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { io, Socket } from "socket.io-client";
import Quill from "quill";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

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

const TextEditor = () => {
  const quillRef = useRef<ReactQuill | null>();
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();
  const { id: documentId } = useParams();
  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [quill, socket, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const receiveHandler = (delta: any) => {
      quill?.updateContents(delta);
    };
    socket?.on("receive-changes", receiveHandler);

    return () => {
      socket?.off("receive-changes", receiveHandler);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any, _: any, source: string) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    const s = io("http://localhost:3002");
    setSocket(s);
    const q: Quill | undefined = quillRef.current?.getEditor();
    q.disable();
    q.setText("Loading....");
    setQuill(q);

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        ref={(node) => (quillRef.current = node)}
      />
    </div>
  );
};

export default TextEditor;

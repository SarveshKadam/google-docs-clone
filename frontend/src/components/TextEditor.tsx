import { useEffect } from "react";
import ReactQuill from "react-quill";
import { io } from "socket.io-client";

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
  useEffect(() => {
    const socket = io("https://server-domain.com");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <ReactQuill theme="snow" modules={modules} formats={formats} />
    </div>
  );
};

export default TextEditor;

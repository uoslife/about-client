"use client";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useEffect, useRef, useState } from "react";

export const EditorTest = () => {
  const editorRef = useRef<Editor | null>(null);
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (editorRef.current) {
      console.log(editorRef.current.getInstance().getMarkdown());
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">UOSLIFE</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">Editor</p>
        <Editor
          ref={editorRef}
          width="50vw"
          height="36vh"
          previewStyle="vertical"
          useCommandShortcut={true}
          initialEditType="wysiwyg"
          initialValue="Hello UOSLIFE!"
          onChange={() => {
            setMarkdown(editorRef.current?.getInstance().getMarkdown());
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 w-full h-96">
        <p className="text-xl font-bold">Markdown</p>
        <div className="whitespace-pre-wrap border-2 border-gray-300 rounded-md overflow-y-scroll w-full h-full">
          {markdown}
        </div>
      </div>
    </div>
  );
};

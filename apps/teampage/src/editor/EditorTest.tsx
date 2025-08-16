"use client";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor, EditorProps } from "@toast-ui/react-editor";
import dynamic from "next/dynamic";
import { ForwardedRef, forwardRef, useCallback, useRef, useState } from "react";

const WrappedEditor = dynamic(() => import("./WrappedEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-[800px] h-[400px] border border-gray-300 rounded-md animate-pulse bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Editor is loading...</div>
    </div>
  ),
});

const ForwardedEditor = forwardRef(
  (props: EditorProps, forwardedRef: ForwardedRef<Editor>) => {
    return <WrappedEditor {...props} forwardedRef={forwardedRef} />;
  }
);
ForwardedEditor.displayName = "ForwardedEditor";

interface TuiEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
}

export const EditorTest = ({
  initialValue = "Hello UOSLIFE!",
  onChange,
}: Partial<TuiEditorProps> = {}) => {
  const editorRef = useRef<Editor>(null);
  const [markdown, setMarkdown] = useState("");

  const handleChange = useCallback(() => {
    if (!editorRef.current) return;

    const instance = editorRef.current.getInstance();
    const content = instance.getMarkdown();
    setMarkdown(content);
    onChange?.(content);
  }, [onChange]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">UOSLIFE</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">Editor</p>
        <ForwardedEditor
          ref={editorRef}
          width="800px"
          height="400px"
          previewStyle="vertical"
          useCommandShortcut={true}
          initialEditType="wysiwyg"
          initialValue={initialValue}
          onChange={handleChange}
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

EditorTest.displayName = "EditorTest";

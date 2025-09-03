'use client';
import { Editor, type EditorProps } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import type { ForwardedRef } from 'react';

interface WrappedEditorProps {
  forwardedRef: ForwardedRef<Editor & EditorProps>;
}

const WrappedEditor = (props: WrappedEditorProps) => {
  return <Editor ref={props.forwardedRef} {...props} />;
};

export default WrappedEditor;

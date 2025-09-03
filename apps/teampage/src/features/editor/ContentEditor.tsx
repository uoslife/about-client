'use client';
import '@toast-ui/editor/dist/toastui-editor.css';
import type { Editor, EditorProps } from '@toast-ui/react-editor';
import dynamic from 'next/dynamic';
import {
  type ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useRef,
} from 'react';

const WrappedEditor = dynamic(() => import('./WrappedEditor'), {
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
  },
);
ForwardedEditor.displayName = 'ForwardedEditor';

interface TuiEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
}

export const ContentEditor = memo(
  ({
    initialValue = '내용을 입력해주세요.',
    onChange,
  }: Partial<TuiEditorProps> = {}) => {
    const editorRef = useRef<Editor>(null);

    const handleChange = useCallback(() => {
      if (!editorRef.current) return;

      const instance = editorRef.current.getInstance();
      const content = instance.getMarkdown();
      onChange?.(content);
    }, [onChange]);

    return (
      <ForwardedEditor
        ref={editorRef}
        width="1600px"
        height="600px"
        previewStyle="vertical"
        useCommandShortcut={true}
        initialEditType="wysiwyg"
        initialValue={initialValue}
        onChange={handleChange}
      />
    );
  },
);

ContentEditor.displayName = 'ContentEditor';

export default ContentEditor;

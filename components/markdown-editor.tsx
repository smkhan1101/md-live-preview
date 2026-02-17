'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { lineNumbers } from '@codemirror/view';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onScroll?: () => void;
  isDark: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
};

export function MarkdownEditor({
  value,
  onChange,
  onScroll,
  isDark,
  scrollContainerRef,
  className = '',
}: MarkdownEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const extensions = useMemo(
    () => [lineNumbers(), markdown(), isDark ? githubDark : githubLight],
    [isDark]
  );

  useEffect(() => {
    if (!scrollContainerRef || !wrapperRef.current) return;
    const scroller = wrapperRef.current.querySelector('.cm-scroller');
    if (!scroller) return;
    (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = scroller as HTMLDivElement;
    const handleScroll = () => onScroll?.();
    scroller.addEventListener('scroll', handleScroll);
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = null;
    };
  }, [scrollContainerRef, onScroll]);

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  return (
    <div ref={wrapperRef} className={`h-full overflow-hidden editor-pane ${isDark ? 'editor-pane-dark' : ''} ${className}`}>
      <CodeMirror
        key={isDark ? 'dark' : 'light'}
        value={value}
        height="100%"
        extensions={extensions}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightSelectionMatches: false,
          searchKeymap: false,
          tabSize: 2,
        }}
        style={{ height: '100%' }}
      />
    </div>
  );
}

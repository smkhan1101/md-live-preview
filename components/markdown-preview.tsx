'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

type MarkdownPreviewProps = {
  content: string;
  className?: string;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
};

export function MarkdownPreview({
  content,
  className = '',
  previewRef,
  onScroll,
}: MarkdownPreviewProps) {
  return (
    <div
      id="pdf-preview-source"
      ref={previewRef as React.LegacyRef<HTMLDivElement>}
      onScroll={onScroll}
      className={`markdown-preview markdown-body overflow-y-auto h-full ${className}`}
      role="article"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

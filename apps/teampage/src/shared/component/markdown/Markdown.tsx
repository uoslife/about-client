import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Text } from '../Text';
import Image from 'next/image';

export const Markdown = ({ content }: { content: string }) => {
  const proccessedContent = content.replace(/\\n/g, '\n');
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => {
          const hasImage = React.Children.toArray(children).some(
            (child: any) => child?.type === 'img' || child?.props?.src,
          );
          if (hasImage) {
            return <div className="mb-4 md:mb-6">{children}</div>;
          }
          return (
            <Text
              variant="body-20-m"
              color="grey-800"
              className="mb-4 md:mb-6 leading-relaxed text-sm md:text-lg"
            >
              {children}
            </Text>
          );
        },
        h1: ({ children }) => (
          <Text
            variant="title-48-b"
            color="grey-900"
            className="mb-4 md:mb-6 mt-6 md:mt-12 text-2xl md:text-4xl"
            as="h1"
          >
            {children}
          </Text>
        ),
        h2: ({ children }) => (
          <Text
            variant="title-28-b"
            color="grey-900"
            className="mb-3 md:mb-4 mt-5 md:mt-10 text-xl md:text-3xl"
            as="h2"
          >
            {children}
          </Text>
        ),
        h3: ({ children }) => (
          <Text
            variant="title-24-b"
            color="grey-900"
            className="mb-3 md:mb-4 mt-4 md:mt-8 text-lg md:text-2xl"
            as="h3"
          >
            {children}
          </Text>
        ),
        strong: ({ children }) => (
          <Text
            variant="body-20-b"
            color="grey-900"
            as="span"
            className="text-sm md:text-lg"
          >
            {children}
          </Text>
        ),
        code: ({ inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          
          return !inline && match ? (
            <div className="mb-4 md:mb-6 rounded-2xl overflow-hidden border border-grey-300">
              <div className="bg-grey-800 px-4 py-2 text-grey-300 text-xs md:text-sm font-mono">
                {match[1]}
              </div>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '0.875rem',
                  padding: '1.5rem',
                }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className="px-2 py-1 bg-grey-100 text-primary-ui rounded text-xs md:text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        ul: ({ children }) => (
          <ul className="mb-4 md:mb-6 pl-4 md:pl-6 space-y-1 md:space-y-2 list-disc">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 md:mb-6 pl-4 md:pl-6 space-y-1 md:space-y-2 list-decimal">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li>
            <Text
              variant="body-20-m"
              color="grey-800"
              as="span"
              className="text-sm md:text-lg"
            >
              {children}
            </Text>
          </li>
        ),
        img: ({ src, alt }) => (
          <div className="my-4 md:my-8 w-full">
            <div className="relative w-full">
              <Image
                src={src || ''}
                alt={alt || ''}
                width={0}
                height={0}
                className="w-full h-auto rounded-2xl object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 880px, 880px"
              />
            </div>
            {alt && (
              <Text
                variant="body-16-m"
                color="grey-500"
                className="text-center mt-2 md:mt-3 text-xs md:text-base"
              >
                {alt}
              </Text>
            )}
          </div>
        ),
        table: ({ children }) => (
          <div className="mb-4 md:mb-6 overflow-x-auto border border-grey-300 rounded-lg">
            <table className="min-w-full border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-grey-100">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-grey-300 last:border-b-0">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 md:px-6 py-3 md:py-4 text-left border-r border-grey-300 last:border-r-0">
            <Text
              variant="body-20-b"
              color="grey-900"
              as="span"
              className="text-sm md:text-lg"
            >
              {children}
            </Text>
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 md:px-6 py-3 md:py-4 border-r border-grey-300 last:border-r-0">
            <Text
              variant="body-20-m"
              color="grey-800"
              as="span"
              className="text-sm md:text-lg"
            >
              {children}
            </Text>
          </td>
        ),
      }}
    >
      {proccessedContent}
    </ReactMarkdown>
  );
};

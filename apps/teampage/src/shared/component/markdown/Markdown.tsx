import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Text } from '../Text';
import Image from 'next/image';

export const Markdown = ({ content }: { content: string }) => {
  const proccessedContent = content.replace(/\\n/g, '\n');
  return (
    <ReactMarkdown
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
            variant="title-36-b"
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
        code: ({ children }) => (
          <code className="px-2 py-1 bg-grey-100 text-primary-ui rounded text-xs md:text-sm font-mono">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-grey-50 p-4 md:p-6 rounded-2xl overflow-x-auto mb-4 md:mb-6 border border-grey-200 text-xs md:text-sm">
            {children}
          </pre>
        ),
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
            <div className="relative w-full h-[200px] md:h-[400px]">
              <Image
                src={src || ''}
                alt={alt || ''}
                fill
                className="rounded-2xl object-cover"
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
      }}
    >
      {proccessedContent}
    </ReactMarkdown>
  );
};

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";

interface QuoteBoxProps {
  content: string;
  maxLines?: 3 | 5;
}

const HTML_REGEX = /<[a-z][\s\S]*>/i;

function ReadOnlyContent({ html }: { html: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: {},
        italic: {},
        strike: {},
        orderedList: {},
        blockquote: {},
        bulletList: false,
        codeBlock: false,
        code: false,
        heading: false,
        horizontalRule: false,
      }),
      Link.configure({ openOnClick: true }),
      Mention.configure({
        HTMLAttributes: {
          class: "text-[var(--color-gold-primary)] font-bold",
        },
      }),
    ],
    content: html,
    editable: false,
  });

  return <EditorContent editor={editor} />;
}

export default function QuoteBox({ content, maxLines = 5 }: QuoteBoxProps) {
  const lineClampClass =
    maxLines === 3 ? "line-clamp-3" : "line-clamp-5";

  const isHtml = HTML_REGEX.test(content);

  return (
    <div className="rounded-quote-box border border-gold-primary bg-gold-40 px-6 py-4">
      <div
        className={`font-[family-name:var(--font-montserrat)] text-xl font-bold leading-8 text-text-dark ${lineClampClass}`}
        style={{ textAlign: "justify" }}
      >
        {isHtml ? (
          <ReadOnlyContent html={content} />
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  );
}

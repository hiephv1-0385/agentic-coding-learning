"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import RichTextToolbar from "@/components/kudos/kudo-modal/RichTextToolbar";
import { createMentionSuggestion } from "@/components/kudos/kudo-modal/MentionSuggestion";
import { useLocale } from "@/hooks/useLocale";
import { useEffect } from "react";

interface RichTextEditorProps {
  onChange: (html: string) => void;
  disabled?: boolean;
  error?: string;
}

const CHAR_LIMIT = 3000;

export default function RichTextEditor({
  onChange,
  disabled = false,
  error,
}: RichTextEditorProps) {
  const { t } = useLocale();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: {},
        italic: {},
        strike: {},
        orderedList: {},
        blockquote: {},
        // Disable features we don't need
        bulletList: false,
        codeBlock: false,
        code: false,
        heading: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "text-[var(--color-gold-primary)] font-bold",
        },
        suggestion: createMentionSuggestion(t.modal.noMentionResults),
        renderText({ node }) {
          return `@${node.attrs.label}`;
        },
        renderHTML({ node }) {
          return [
            "span",
            {
              "data-mention": "",
              "data-id": node.attrs.id,
              class: "text-[var(--color-gold-primary)] font-bold",
            },
            `@${node.attrs.label}`,
          ];
        },
      }),
      Placeholder.configure({
        placeholder: t.modal.placeholder,
      }),
      CharacterCount.configure({
        limit: CHAR_LIMIT,
      }),
    ],
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "w-full h-[200px] min-h-[120px] px-6 py-4 bg-white outline-none overflow-y-auto prose prose-sm max-w-none text-base font-bold leading-6 text-[var(--color-text-dark)]",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  const borderClass = error
    ? "border-[var(--color-required)]"
    : "border-[var(--color-border)] focus-within:border-[var(--color-gold-primary)]";

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className={`border rounded-lg overflow-hidden transition-colors duration-150 ${borderClass}`}>
        <RichTextToolbar editor={editor} />
        <div className="border-t border-[var(--color-border)]">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-base font-bold leading-6 tracking-[0.5px] text-[var(--color-text-dark)]">
          {t.modal.mentionHint}
        </p>
        {editor && (
          <span className="text-sm text-[var(--color-text-gray)]">
            {editor.storage.characterCount.characters()}/{CHAR_LIMIT}
          </span>
        )}
      </div>
    </div>
  );
}

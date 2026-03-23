"use client";

import type { Editor } from "@tiptap/react";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";

interface ToolbarAction {
  icon: IconName;
  labelKey: "bold" | "italic" | "strikethrough" | "numberedList" | "link" | "quote";
  command: (editor: Editor, enterUrlLabel: string) => void;
  isActive: (editor: Editor) => boolean;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    icon: "format-bold",
    labelKey: "bold",
    command: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
  },
  {
    icon: "format-italic",
    labelKey: "italic",
    command: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
  },
  {
    icon: "format-strikethrough",
    labelKey: "strikethrough",
    command: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
  },
  {
    icon: "format-list-numbered",
    labelKey: "numberedList",
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    icon: "format-link",
    labelKey: "link",
    command: (editor, enterUrlLabel) => {
      if (editor.isActive("link")) {
        editor.chain().focus().unsetLink().run();
        return;
      }
      const url = window.prompt(enterUrlLabel);
      if (url) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
          .run();
      }
    },
    isActive: (editor) => editor.isActive("link"),
  },
  {
    icon: "format-quote",
    labelKey: "quote",
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
];

interface RichTextToolbarProps {
  editor: Editor | null;
}

export default function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const { t } = useLocale();

  if (!editor) return null;

  return (
    <div className="flex h-10 w-full">
      {TOOLBAR_ACTIONS.map((action, index) => {
        const active = action.isActive(editor);
        return (
          <button
            key={action.icon}
            type="button"
            onClick={() => action.command(editor, t.modal.enterUrl)}
            aria-label={t.modal[action.labelKey]}
            aria-pressed={active}
            className={`h-10 px-4 py-2.5 border border-[var(--color-border)] transition-colors duration-100 ${
              index === 0 ? "rounded-tl-lg" : "-ml-px"
            } ${
              active
                ? "bg-[rgba(255,234,158,0.2)]"
                : "bg-transparent hover:bg-[rgba(0,0,0,0.05)]"
            }`}
          >
            <Icon name={action.icon} size={24} className="text-[var(--color-text-dark)]" />
          </button>
        );
      })}

      {/* Community Standards link */}
      <div className="flex-1 flex items-center justify-end border border-[var(--color-border)] -ml-px rounded-tr-lg px-4">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-bold leading-6 tracking-[0.15px] text-[var(--color-link-red)] hover:underline"
        >
          {t.modal.communityStandards}
        </a>
      </div>
    </div>
  );
}

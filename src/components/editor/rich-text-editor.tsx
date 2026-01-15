"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content?: any;
  onChange?: (content: any) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Write something...",
  editable = true,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] px-3 py-2",
          "[&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base",
          "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded",
          "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md"
        ),
      },
    },
  });

  // Update editor content when prop changes
  React.useEffect(() => {
    if (editor && content && editor.getJSON() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className={cn("relative", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}

// Toolbar component for the editor (optional)
export function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 border-b p-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-1.5 rounded hover:bg-accent",
          editor.isActive("bold") && "bg-accent"
        )}
      >
        <span className="font-bold text-sm">B</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-1.5 rounded hover:bg-accent",
          editor.isActive("italic") && "bg-accent"
        )}
      >
        <span className="italic text-sm">I</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(
          "p-1.5 rounded hover:bg-accent",
          editor.isActive("code") && "bg-accent"
        )}
      >
        <span className="font-mono text-sm">&lt;/&gt;</span>
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-1.5 rounded hover:bg-accent",
          editor.isActive("bulletList") && "bg-accent"
        )}
      >
        <span className="text-sm">• List</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-1.5 rounded hover:bg-accent",
          editor.isActive("orderedList") && "bg-accent"
        )}
      >
        <span className="text-sm">1. List</span>
      </button>
    </div>
  );
}

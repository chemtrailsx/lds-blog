import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import api from '../api';
import toast from 'react-hot-toast';

const ToolbarBtn = ({ onClick, active, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`px-2 py-1 text-sm rounded transition-colors ${active ? 'bg-amber text-ink' : 'text-parchment/60 hover:text-parchment hover:bg-bark'}`}
  >
    {children}
  </button>
);

export default function PostEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false })],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] text-parchment' }
    }
  });

  const uploadInlineImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    try {
      const { data } = await api.post('/api/v1/images/upload', form);
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch {
      toast.error('Image upload failed');
    }
    e.target.value = '';
  };

  if (!editor) return null;

  return (
    <div className="border border-amber/30 rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-charcoal border-b border-amber/20">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">B</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><em>I</em></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading">H2</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading">H3</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">• List</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">1. List</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">" Quote</ToolbarBtn>
        <label className="px-2 py-1 text-sm rounded text-parchment/60 hover:text-parchment hover:bg-bark cursor-pointer transition-colors" title="Insert image">
          🖼 Image
          <input type="file" accept="image/*" className="hidden" onChange={uploadInlineImage} />
        </label>
      </div>
      <div className="p-4 bg-bark/50 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Post } from "../types";

interface Props {
  initial?: Partial<Post>;
  onSubmit: (data: { title: string; author: string; content: string }) => void;
}

export default function PostForm({ initial = {}, onSubmit }: Props) {
  const [title, setTitle] = useState(initial.title || "");
  const [author, setAuthor] = useState(initial.author || "");
  const [content, setContent] = useState(initial.content || "");

  useEffect(() => {
    setTitle(initial.title ?? "");
    setAuthor(initial.author ?? "");
    setContent(initial.content ?? "");
  }, [initial]);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, author, content });
  };

  return (
    <form onSubmit={handle}>
      {/* ...same as before with TypeScript types... */}
      <div className="mb-4">
        <input
          type="text" value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Title" required
        />
      </div>
      <div className="mb-4">
        <input
          type="text" value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Author" required
        />
      </div>
      <div className="mb-4">
        <textarea
          rows={8} value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Content" required
        />
      </div>
      <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
        Submit
      </button>
    </form>
  );
}

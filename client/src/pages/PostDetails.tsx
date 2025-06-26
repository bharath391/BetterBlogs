import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost } from "../api/posts";
import dayjs from "dayjs";
import { Post } from "../types";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) getPost(id).then(setPost);
  }, [id]);

  if (!post) return <p>Loading…</p>;

  return (
    <article className="bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">
        By {post.author} on {dayjs(post.createdAt).format("MMM D, YYYY")}
      </p>
      <div className="prose whitespace-pre-wrap">{post.content}</div>
      <div className="mt-4">
        <Link to={`/post/${post._id}/edit`} className="text-indigo-600">Edit Post</Link>
      </div>
    </article>
  );
}

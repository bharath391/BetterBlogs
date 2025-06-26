import { useEffect, useState } from "react";
import { getPosts, deletePost } from "../api/posts";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Post } from "../types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const nav = useNavigate();

  const load = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      {posts.map(p => (
        <div key={p._id} className="bg-white p-4 rounded shadow mb-4">
          <Link to={`/post/${p._id}`} className="text-xl font-semibold">{p.title}</Link>
          <p className="text-gray-500 text-sm">
            By {p.author} on {dayjs(p.createdAt).format("MMM D, YYYY")}
          </p>
          <p className="mt-2">{p.content.slice(0, 150)}...</p>
          <div className="mt-4 space-x-2">
            <button onClick={() => nav(`/post/${p._id}/edit`)} className="text-indigo-600">Edit</button>
            <button onClick={async () => { await deletePost(p._id); load(); }} className="text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

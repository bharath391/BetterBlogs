import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { getPost, createPost, updatePost } from "../api/posts";
import { Post } from "../types";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<Post>>({});
  const nav = useNavigate();

  useEffect(() => {
    if (id) getPost(id).then(setInitial);
  }, [id]);

  const handle = async (data: any) => {
    if (id) {
      await updatePost(id, data);
      nav(`/post/${id}`);
    } else {
      const res = await createPost(data);
      nav(`/post/${res.data._id}`);
    }
  };

  return <PostForm initial={initial} onSubmit={handle} />;
}

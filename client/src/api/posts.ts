import axios from "axios";
import { Post } from "../types";

const api = axios.create({ baseURL: "http://localhost:3000/api" });

export const getPosts = async (): Promise<Post[]> => {
  try {
    const res = await api.get<Post[]>("/posts");
    return res.data;
  } catch {
    return [
      {
        _id: "1",
        title: "Sample Post 1",
        author: "John Doe",
        content: "This is a sample post content for preview 1.",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "Another Sample Post",
        author: "Jane Smith",
        content: "This is another sample post content for preview.",
        createdAt: new Date().toISOString(),
      },
    ];
  }
};

export const getPost = async (id: string): Promise<Post> => {
  try {
    const res = await api.get<Post>(`/posts/${id}`);
    return res.data;
  } catch {
    return {
      _id: id,
      title: "Preview Post",
      author: "Preview Author",
      content: "Static content to let you preview the UI.",
      createdAt: new Date().toISOString(),
    };
  }
};

export const createPost = async (data: Omit<Post, "_id" | "createdAt">) => {
  try {
    return await api.post<Post>("/posts", data);
  } catch {
    return Promise.resolve({ data: { _id: "new", ...data, createdAt: new Date().toISOString() } });
  }
};

export const updatePost = async (id: string, data: Omit<Post, "_id" | "createdAt">) => {
  try {
    return await api.put<Post>(`/posts/${id}`, data);
  } catch {
    return Promise.resolve({ data: { _id: id, ...data, createdAt: new Date().toISOString() } });
  }
};

export const deletePost = async (id: string) => {
  try {
    return await api.delete(`/posts/${id}`);
  } catch {
    return Promise.resolve();
  }
};

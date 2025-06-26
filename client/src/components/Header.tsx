import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">BetterBlogs</Link>
        <Link to="/new" className="bg-indigo-500 text-white px-3 py-2 rounded hover:bg-indigo-600">New Post</Link>
      </div>
    </header>
  );
}

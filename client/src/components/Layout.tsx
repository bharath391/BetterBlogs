import { ReactNode } from "react";
import Header from "./Header";

interface Props { children: ReactNode; }

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="max-w-3xl mx-auto p-4">{children}</main>
    </div>
  );
}

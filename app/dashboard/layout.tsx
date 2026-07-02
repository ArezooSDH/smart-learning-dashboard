"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<null | { name: string }>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>

          <nav className="space-y-3">
            <Link href="/dashboard">Home</Link>
            <br />
            <Link href="/dashboard/students">Students</Link>
            <br />
            <Link href="/dashboard/courses">Courses</Link>
          </nav>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            {user.name}
          </p>

          <button
            onClick={handleLogout}
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-gray-100 text-gray-900">
        {children}
      </main>
    </div>
  );
}

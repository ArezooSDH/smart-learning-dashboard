"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

type LinkItem = {
  href: string;
  label: string;
  icon: any;
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: LinkItem[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/students", label: "Students", icon: Users },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/teachers", label: "Teachers", icon: GraduationCap },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* mobile top bar */}
      <div className="lg:hidden p-4 border-b bg-white w-full">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu />
        </button>
      </div>

      {/* sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 w-64 bg-white border-r p-6 transform transition-transform z-50
        ${open ? "translate-x-0 h-full" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* close mobile */}
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-blue-600">
          Learning Dashboard
        </h2>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 p-2 rounded transition
                  ${
                    active
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

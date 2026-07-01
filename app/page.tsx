import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Smart Learning Dashboard
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          A modern dashboard for managing students, courses, and instructors
          built with Next.js, TypeScript, and TailwindCSS.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg">Open Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

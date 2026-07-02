import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold">
          Smart Learning Dashboard
        </h1>

        <p className="mt-4 text-gray-600">
          Manage students and courses with a modern dashboard.
        </p>

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-6 py-2 border border-black rounded hover:bg-gray-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}

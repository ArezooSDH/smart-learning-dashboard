"use client";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <h2 className="text-2xl font-bold text-red-500">
        Something went wrong
      </h2>

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Try again
      </button>
    </div>
  );
}

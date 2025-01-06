"use client";

import { useRouter } from "next/navigation";

export default function BackToClientProfile() {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={router.back}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        <p className="text-xs">Back</p>
      </button>
    </div>
  );
}

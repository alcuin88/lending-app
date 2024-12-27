"use client";

import { useRouter } from "next/navigation";

export default function ModalBackdrop() {
  const router = useRouter();
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/90"
      onClick={router.back}
    />
  );
}

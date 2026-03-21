"use client";

import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function SidePanel({
  isOpen,
  onClose,
  title,
  children,
}: Props) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* 🔷 OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-[999] transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* 🔷 PANEL */}
      <div
        className={`fixed top-0 right-0 h-[100vh]
        w-full sm:w-[420px] lg:w-[500px] xl:w-[600px]
        bg-white shadow-xl z-[1000]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold text-gray-800">
            {title}
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}
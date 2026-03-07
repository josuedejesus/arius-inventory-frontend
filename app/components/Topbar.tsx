"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdMenu } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

type TokenPayload = {
  username: string;
  role: string;
};

type TopbarProps = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
      } catch {
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-4">
      <div className="flex items-center gap-3">
        {/* Botón menú SOLO en mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          <MdMenu size={24} />
        </button>

        <span className="text-sm text-gray-600">
          Bienvenido{user ? `, ${user.username}` : ""}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">● Online</span>
      </div>
    </header>
  );
}

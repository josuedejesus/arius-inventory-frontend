"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //AUTH
  const { reloadUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username: username,
        password: password,
      });

      const token = response.data.data.access_token;

      localStorage.setItem("access_token", token);
      await reloadUser();
      router.push("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      {/* Logo / Branding */}
      <div className="text-center mb-6">
        {/* 🔷 LOGO con fondo */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-2xl shadow-sm">
            <img
              src="/logo.png"
              alt="Arius Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Sistema de gestión de inventario
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-700"
            placeholder="Ingrese su usuario"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-700"
            placeholder="Ingrese su contraseña"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg
                     hover:bg-gray-800 transition
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Arius
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FormLayout } from "./form/FormLayout";
import FormField from "./form/FormField";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);

  const router = useRouter();

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //AUTH
  const { reloadUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError([]);
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
      console.log("Login error", error);
      const rawMessage = error?.response?.data?.message;

      const messages = Array.isArray(rawMessage)
        ? rawMessage
        : typeof rawMessage === "string"
        ? rawMessage.split("\n")
        : ["El servidor no está disponible en este momento. Intente más tarde."];

      setError(messages);
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

      <FormLayout title="" onSubmit={handleSubmit} buttonWidth="full" buttonClassName="bg-gray-900 text-white hover:bg-gray-800" submitLabel="Iniciar sesión" loading={loading}>
        {/* El formulario se encuentra aquí */}
        <FormField
          name="username"
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormField
          name="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Error */}
        {error.length > 0 && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        )}

       
      </FormLayout>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Arius
      </div>
    </div>
  );
}

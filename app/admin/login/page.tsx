"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("jaco-admin-token", data.token);
      router.push("/admin");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0A1342 0%, #001A8B 100%)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative h-[48px] w-[170px]">
            <Image src="/logos/jaco-full.png" alt="Maquinados JACO" fill className="object-contain brightness-0 invert" sizes="170px" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-sm">
          <h1 className="font-display text-2xl uppercase tracking-wider text-jaco-black mb-1">
            Panel Admin
          </h1>
          <p className="text-gray-500 text-sm mb-7">Ingresa tu contraseña para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-10 pr-10 py-3 border border-gray-200 text-sm focus:border-jaco-blue outline-none transition-colors"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-jaco-red text-sm flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-jaco-red" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-jaco-red text-white font-semibold uppercase tracking-wider text-sm rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "VERIFICANDO..." : "INGRESAR"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Maquinados JACO © 2026 · Panel Administrativo
        </p>
      </div>
    </div>
  );
}

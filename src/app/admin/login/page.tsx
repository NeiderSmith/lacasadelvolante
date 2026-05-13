"use client";

import Link from "next/link";
import { useState } from "react";
import {
  configureAmplifyClient,
  hasAmplifyOutputsEnv,
} from "@/lib/amplify/configure";
import { signIn } from "aws-amplify/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!hasAmplifyOutputsEnv()) {
      setMessage("Configura NEXT_PUBLIC_AMPLIFY_OUTPUTS en .env.local primero.");
      return;
    }
    configureAmplifyClient();
    setSubmitting(true);
    try {
      const result = await signIn({
        username: email.trim().toLowerCase(),
        password,
      });
      if (result.isSignedIn) {
        window.location.href = "/admin";
        return;
      }
      setMessage("Revisa el siguiente paso en la consola de Cognito (MFA, etc.).");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-lg font-semibold text-white">Panel de administración</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Acceso solo con usuarios de Cognito en el grupo{" "}
        <code className="rounded bg-zinc-800 px-1 text-zinc-200">ADMINS</code>.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4"
        aria-label="Inicio de sesión administrador"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Correo</span>
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-zinc-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Contraseña</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-zinc-500"
          />
        </label>
        {message ? (
          <p className="text-sm text-red-400" role="alert">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
        >
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-500">
        ¿Primera vez?{" "}
        <Link href="/admin/registro" className="text-zinc-300 hover:text-white">
          Crear cuenta (el primero confirmado será admin)
        </Link>
      </p>
    </div>
  );
}

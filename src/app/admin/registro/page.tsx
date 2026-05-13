"use client";

import Link from "next/link";
import { useState } from "react";
import {
  configureAmplifyClient,
  hasAmplifyOutputsEnv,
} from "@/lib/amplify/configure";
import { confirmSignUp, signUp } from "aws-amplify/auth";

type Step = "register" | "confirm";

export default function AdminRegistroPage() {
  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!hasAmplifyOutputsEnv()) {
      setMessage("Configura NEXT_PUBLIC_AMPLIFY_OUTPUTS en .env.local primero.");
      return;
    }
    configureAmplifyClient();
    setSubmitting(true);
    try {
      const normalized = email.trim().toLowerCase();
      await signUp({
        username: normalized,
        password,
        options: {
          userAttributes: { email: normalized },
        },
      });
      setEmail(normalized);
      setStep("confirm");
      setMessage("Revisa tu correo e introduce el código de verificación.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "No se pudo registrar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    configureAmplifyClient();
    setSubmitting(true);
    try {
      await confirmSignUp({
        username: email.trim().toLowerCase(),
        confirmationCode: code.trim(),
      });
      window.location.href = "/admin/login";
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Código incorrecto o caducado.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-lg font-semibold text-white">Crear cuenta de administrador</h1>
      <p className="mt-2 text-sm text-zinc-400">
        El <strong>primer</strong> usuario que confirme el correo desde aquí pasa al grupo{" "}
        <code className="rounded bg-zinc-800 px-1 text-zinc-200">ADMINS</code> (regla en
        Cognito). Los siguientes no reciben admin automático.
      </p>

      {step === "register" ? (
        <form
          onSubmit={handleRegister}
          className="mt-8 flex flex-col gap-4"
          aria-label="Registro administrador"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-400">Correo</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-zinc-500"
            />
          </label>
          {message ? (
            <p className="text-sm text-amber-200" role="status">
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
          >
            {submitting ? "Enviando…" : "Registrarse"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleConfirm}
          className="mt-8 flex flex-col gap-4"
          aria-label="Confirmar correo"
        >
          <p className="text-sm text-zinc-400">
            Correo: <span className="text-zinc-200">{email}</span>
          </p>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-400">Código de verificación</span>
            <input
              type="text"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-zinc-500"
            />
          </label>
          {message ? (
            <p className="text-sm text-amber-200" role="status">
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
          >
            {submitting ? "Confirmando…" : "Confirmar y continuar al login"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("register");
              setCode("");
              setMessage(null);
            }}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            Volver
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-zinc-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/admin/login" className="text-zinc-300 hover:text-white">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}

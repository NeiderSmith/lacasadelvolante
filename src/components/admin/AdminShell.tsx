"use client";



import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { signOut } from "aws-amplify/auth";

import {

  configureAmplifyClient,

  hasAmplifyOutputsEnv,

} from "@/lib/amplify/configure";

import { userIsAdmin } from "@/lib/amplify/admin-auth";



type AdminShellProps = {

  readonly children: React.ReactNode;

};



const isPublicAdminPath = (pathname: string | null) =>

  pathname === "/admin/login" || pathname === "/admin/registro";



const navItems = [

  { href: "/admin", label: "Inicio" },

  { href: "/admin/categorias", label: "Categorías (galería)" },

  { href: "/admin/galeria", label: "Gestión de galería" },

  { href: "/admin/vehiculos", label: "Vehículos en venta" },

] as const;



const isNavActive = (pathname: string | null, href: string) => {

  if (!pathname) return false;

  if (href === "/admin") return pathname === "/admin";

  return pathname === href || pathname.startsWith(`${href}/`);

};



export const AdminShell = ({ children }: AdminShellProps) => {

  const pathname = usePathname();

  const router = useRouter();

  const [ready, setReady] = useState(false);

  const [allowed, setAllowed] = useState(false);

  const publicPath = isPublicAdminPath(pathname);



  useEffect(() => {

    configureAmplifyClient();

    let cancelled = false;



    const run = async () => {

      if (!hasAmplifyOutputsEnv()) {

        setReady(true);

        setAllowed(publicPath);

        return;

      }



      const admin = await userIsAdmin();

      if (cancelled) return;



      setReady(true);



      if (publicPath) {

        setAllowed(true);

        if (admin) router.replace("/admin");

        return;

      }



      if (admin) {

        setAllowed(true);

      } else {

        setAllowed(false);

        router.replace("/admin/login");

      }

    };



    void run();

    return () => {

      cancelled = true;

    };

  }, [pathname, router, publicPath]);



  const handleSignOut = async () => {

    await signOut();

    router.replace("/admin/login");

    router.refresh();

  };



  if (!ready) {

    return (

      <div className="flex min-h-dvh items-center justify-center text-sm text-zinc-400">

        Cargando panel…

      </div>

    );

  }



  if (!hasAmplifyOutputsEnv()) {

    if (publicPath) {

      return (

        <div className="mx-auto max-w-3xl px-4 py-10">

          <div className="rounded-lg border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">

            Falta configurar el backend: en{" "}

            <code className="rounded bg-zinc-900 px-1 py-0.5">.env.local</code>{" "}

            define{" "}

            <code className="rounded bg-zinc-900 px-1 py-0.5">

              NEXT_PUBLIC_AMPLIFY_OUTPUTS

            </code>{" "}

            con el JSON de{" "}

            <code className="rounded bg-zinc-900 px-1 py-0.5">

              amplify_outputs.json

            </code>{" "}

            (

            <code className="rounded bg-zinc-900 px-1 py-0.5">

              npx ampx sandbox

            </code>

            ).

          </div>

          {children}

        </div>

      );

    }



    return (

      <div className="mx-auto max-w-3xl px-4 py-16">

        <div className="rounded-lg border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">

          Configura{" "}

          <code className="rounded bg-zinc-900 px-1">NEXT_PUBLIC_AMPLIFY_OUTPUTS</code>{" "}

          para usar el panel de administración (categorías, vehículos y SEO).

        </div>

        <p className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">

          <Link href="/admin/login" className="text-zinc-300 hover:text-white">

            Ir al inicio de sesión

          </Link>

          <Link href="/admin/registro" className="text-zinc-300 hover:text-white">

            Crear cuenta

          </Link>

        </p>

      </div>

    );

  }



  if (!allowed && !publicPath) {

    return (

      <div className="flex min-h-dvh items-center justify-center text-sm text-zinc-400">

        Redirigiendo al inicio de sesión…

      </div>

    );

  }



  return (

    <>

      {!publicPath && allowed ? (

        <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">

          <aside className="shrink-0 border-b border-zinc-800 bg-zinc-900/90 lg:w-56 lg:border-b-0 lg:border-r">

            <div className="flex items-center justify-between gap-2 px-4 py-4 lg:flex-col lg:items-stretch">

              <Link

                href="/admin"

                className="text-sm font-semibold tracking-tight text-white hover:text-zinc-200"

              >

                LCDV Admin

              </Link>

            </div>

            <nav

              className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:px-3 lg:pb-6"

              aria-label="Secciones del panel"

            >

              {navItems.map((item) => {

                const active = isNavActive(pathname, item.href);

                return (

                  <Link

                    key={item.href}

                    href={item.href}

                    className={[

                      "whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",

                      active

                        ? "bg-zinc-800 font-medium text-white"

                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",

                    ].join(" ")}

                  >

                    {item.label}

                  </Link>

                );

              })}

            </nav>

            <div className="hidden flex-col gap-1 border-t border-zinc-800 p-3 lg:flex">

              <Link

                href="/"

                className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-white"

              >

                Ver sitio

              </Link>

              <button

                type="button"

                onClick={handleSignOut}

                className="rounded-md px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-white"

              >

                Cerrar sesión

              </button>

            </div>

          </aside>

          <div className="flex min-w-0 flex-1 flex-col border-b border-zinc-800 bg-zinc-950 lg:border-b-0">

            <div className="flex items-center justify-end gap-2 border-b border-zinc-800 px-4 py-2 lg:hidden">

              <Link

                href="/"

                className="rounded-md px-2 py-1.5 text-xs text-zinc-400 hover:text-white"

              >

                Ver sitio

              </Link>

              <button

                type="button"

                onClick={handleSignOut}

                className="rounded-md px-2 py-1.5 text-xs text-zinc-400 hover:text-white"

              >

                Salir

              </button>

            </div>

            <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

              {children}

            </main>

          </div>

        </div>

      ) : (

        <div className={publicPath ? "" : "mx-auto max-w-5xl px-4 py-8"}>

          {children}

        </div>

      )}

    </>

  );

};


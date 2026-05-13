import Link from "next/link";



export default function AdminIndexPage() {

  return (

    <div className="space-y-8">

      <header>

        <h1 className="text-xl font-semibold text-white">Panel de administración</h1>

        <p className="mt-2 max-w-xl text-sm text-zinc-400">

          Gestiona categorías, recursos de galería (por categoría y marca) y los

          vehículos en la sección &quot;En venta&quot;.

        </p>

      </header>



      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <li>

          <Link

            href="/admin/categorias"

            className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-900"

          >

            <span className="text-sm font-semibold text-white">

              Categorías (galería)

            </span>

            <span className="mt-2 text-sm text-zinc-500">

              Slug, textos, SEO, portada y publicación en la web.

            </span>

          </Link>

        </li>

        <li>

          <Link

            href="/admin/galeria"

            className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-900"

          >

            <span className="text-sm font-semibold text-white">

              Gestión de galería

            </span>

            <span className="mt-2 text-sm text-zinc-500">

              Recursos con ninguna, una o varias categorías y marca; imagen única o antes/después.

            </span>

          </Link>

        </li>

        <li>

          <Link

            href="/admin/vehiculos"

            className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-900"

          >

            <span className="text-sm font-semibold text-white">

              Vehículos en venta

            </span>

            <span className="mt-2 text-sm text-zinc-500">

              Ficha, foto, precio mostrado y orden en la landing.

            </span>

          </Link>

        </li>

      </ul>

    </div>

  );

}


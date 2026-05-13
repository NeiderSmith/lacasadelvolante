"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  assertCategoryImageFile,
  getCategoryCoverUrl,
  removeCategoryCoverImage,
  uploadCategoryCoverImage,
} from "@/lib/amplify/category-image-storage";
import { adminDataClient } from "@/lib/amplify/admin-data-client";
import { configureAmplifyClient } from "@/lib/amplify/configure";
import { CATEGORY_IMAGE_S3_PREFIX } from "@/lib/storage-paths";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type CategoryRow = {
  readonly id: string;
  slug: string;
  label: string;
  shortDescription: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number | null;
  isPublished: boolean | null;
  coverImageKey: string | null;
  coverPreviewUrl: string | null;
};

const emptyForm = {
  slug: "",
  label: "",
  shortDescription: "",
  seoTitle: "",
  seoDescription: "",
  sortOrder: 0,
  isPublished: true,
};

export default function AdminCategoriasPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingCoverKey, setExistingCoverKey] = useState<string | null>(null);
  const [remoteCoverPreview, setRemoteCoverPreview] = useState<string | null>(
    null,
  );
  const [blobPreview, setBlobPreview] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const loadRows = useCallback(async () => {
    configureAmplifyClient();
    const client = adminDataClient();
    const { data, errors } = await client.models.GalleryCategory.list();
    if (errors?.length) {
      setError(errors.map((e) => e.message).join(", "));
      setLoading(false);
      return;
    }
    const list = (data ?? []) as Omit<CategoryRow, "coverPreviewUrl">[];
    const sorted = [...list].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
    const withPreview = await Promise.all(
      sorted.map(async (r) => ({
        ...r,
        coverPreviewUrl: await getCategoryCoverUrl(r.coverImageKey ?? undefined),
      })),
    );
    setRows(withPreview);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = globalThis.setTimeout(() => {
      void loadRows();
    }, 0);
    return () => globalThis.clearTimeout(t);
  }, [loadRows]);

  useEffect(() => {
    if (!imageFile) {
      const clearT = globalThis.setTimeout(() => {
        setBlobPreview(null);
      }, 0);
      return () => globalThis.clearTimeout(clearT);
    }
    const url = URL.createObjectURL(imageFile);
    const setT = globalThis.setTimeout(() => {
      setBlobPreview(url);
    }, 0);
    return () => {
      globalThis.clearTimeout(setT);
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  useEffect(() => {
    if (imageFile) {
      const t = globalThis.setTimeout(() => {
        setRemoteCoverPreview(null);
      }, 0);
      return () => globalThis.clearTimeout(t);
    }
    let cancelled = false;
    const run = async () => {
      if (!existingCoverKey?.trim()) {
        setRemoteCoverPreview(null);
        return;
      }
      const u = await getCategoryCoverUrl(existingCoverKey);
      if (!cancelled) setRemoteCoverPreview(u);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [existingCoverKey, imageFile]);

  useEffect(() => {
    if (!panelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => {
      firstFieldRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(t);
      document.body.style.overflow = prev;
    };
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setPanelOpen(false);
        setEditingId(null);
        setForm(emptyForm);
        setImageFile(null);
        setExistingCoverKey(null);
        setError(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const resetFormState = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setExistingCoverKey(null);
    setError(null);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    resetFormState();
  };

  const handleOpenCreate = () => {
    resetFormState();
    setPanelOpen(true);
  };

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) {
      setImageFile(null);
      return;
    }
    const validationError = assertCategoryImageFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const slug = form.slug.trim();
    if (!slugPattern.test(slug)) {
      setError("Slug: solo minúsculas, números y guiones (sin espacios).");
      return;
    }

    let coverImageKey: string | undefined =
      existingCoverKey?.trim() || undefined;

    if (imageFile) {
      try {
        const newKey = await uploadCategoryCoverImage(imageFile, slug);
        if (editingId && existingCoverKey && existingCoverKey !== newKey) {
          await removeCategoryCoverImage(existingCoverKey);
        }
        coverImageKey = newKey;
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error al subir la imagen.",
        );
        return;
      }
    }

    const client = adminDataClient();
    const payload = {
      slug,
      label: form.label.trim(),
      shortDescription: form.shortDescription.trim() || undefined,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      isPublished: form.isPublished,
      ...(coverImageKey !== undefined ? { coverImageKey } : {}),
    };

    if (editingId) {
      const { errors } = await client.models.GalleryCategory.update({
        id: editingId,
        ...payload,
      });
      if (errors?.length) {
        setError(errors.map((er) => er.message).join(", "));
        return;
      }
    } else {
      const { errors } = await client.models.GalleryCategory.create(payload);
      if (errors?.length) {
        setError(errors.map((er) => er.message).join(", "));
        return;
      }
    }

    setPanelOpen(false);
    resetFormState();
    setLoading(true);
    await loadRows();
  };

  const handleEdit = (r: CategoryRow) => {
    setEditingId(r.id);
    setImageFile(null);
    setExistingCoverKey(r.coverImageKey ?? null);
    setError(null);
    setForm({
      slug: r.slug,
      label: r.label,
      shortDescription: r.shortDescription ?? "",
      seoTitle: r.seoTitle ?? "",
      seoDescription: r.seoDescription ?? "",
      sortOrder: r.sortOrder ?? 0,
      isPublished: r.isPublished ?? true,
    });
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!globalThis.confirm("¿Eliminar esta categoría?")) return;
    configureAmplifyClient();
    const client = adminDataClient();
    const row = rows.find((x) => x.id === id);
    if (row?.coverImageKey) {
      await removeCategoryCoverImage(row.coverImageKey);
    }
    await client.models.GalleryCategory.delete({ id });
    setLoading(true);
    await loadRows();
  };

  const coverPreview = blobPreview ?? remoteCoverPreview;

  if (loading && rows.length === 0) {
    return <p className="text-sm text-zinc-400">Cargando categorías…</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Categorías (galería)
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Slug para URLs y SEO; título y descripción opcionales para meta tags.
            Imagen de portada en S3 (
            <code className="rounded bg-zinc-800 px-1">
              {CATEGORY_IMAGE_S3_PREFIX}/
            </code>
            ). Solo las publicadas se muestran en la web.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="shrink-0 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
        >
          Nueva categoría
        </button>
      </header>

      {error && !panelOpen ? (
        <p className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <section aria-labelledby="lista-cat-heading">
        <h2 id="lista-cat-heading" className="sr-only">
          Listado de categorías
        </h2>
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center">
            <p className="text-sm text-zinc-400">
              No hay categorías todavía. Crea la primera con el botón
              &quot;Nueva categoría&quot;.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 rounded-md border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              Nueva categoría
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                <div className="relative aspect-[16/10] bg-zinc-800">
                  {r.coverPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- URL firmada S3
                    <img
                      src={r.coverPreviewUrl}
                      alt={r.label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                      Sin imagen
                    </div>
                  )}
                  <span
                    className={[
                      "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      r.isPublished
                        ? "bg-emerald-950/90 text-emerald-200"
                        : "bg-zinc-950/90 text-zinc-400",
                    ].join(" ")}
                  >
                    {r.isPublished ? "Publicada" : "Borrador"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div>
                    <p className="font-medium text-white">{r.label}</p>
                    <p className="text-xs text-zinc-500">
                      /{r.slug} · orden {r.sortOrder ?? 0}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(r)}
                      className="rounded-md border border-zinc-600 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="rounded-md border border-red-900/60 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/40"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {panelOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            tabIndex={0}
            aria-label="Cerrar panel"
            className="absolute inset-0 bg-black/60"
            onClick={handleClosePanel}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-cat-title"
            className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2
                id="panel-cat-title"
                className="text-sm font-semibold text-white"
              >
                {editingId ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button
                type="button"
                onClick={handleClosePanel}
                className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {error ? (
                <p className="mb-4 rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              <form onSubmit={handleSubmit} className="grid gap-4">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Slug (URL)</span>
                  <input
                    ref={firstFieldRef}
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="ej. tapizado-volantes-bucaramanga"
                    aria-describedby="slug-hint"
                  />
                  <span id="slug-hint" className="text-xs text-zinc-500">
                    Minúsculas y guiones.
                  </span>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Nombre visible</span>
                  <input
                    required
                    value={form.label}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, label: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                  />
                </label>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">Foto de la categoría</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePickImage}
                    className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-zinc-100"
                    aria-label="Seleccionar imagen JPEG, PNG o WebP"
                  />
                  <p className="text-xs text-zinc-500">Máx. 8 MB.</p>
                  {coverPreview ? (
                    <div className="relative mt-2 aspect-[16/10] max-w-md overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverPreview}
                        alt="Vista previa de la imagen de categoría"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Descripción corta (landing)</span>
                  <textarea
                    rows={3}
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        shortDescription: e.target.value,
                      }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">SEO — meta title</span>
                  <input
                    value={form.seoTitle}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, seoTitle: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">SEO — meta description</span>
                  <textarea
                    rows={2}
                    value={form.seoDescription}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        seoDescription: e.target.value,
                      }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Orden</span>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sortOrder: Number.parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isPublished: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-zinc-600"
                  />
                  Publicada en la web
                </label>
                <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-zinc-800 bg-zinc-900 pt-4">
                  <button
                    type="submit"
                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
                  >
                    {editingId ? "Guardar cambios" : "Crear categoría"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClosePanel}
                    className="rounded-md border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

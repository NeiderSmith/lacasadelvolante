"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LatamBrandSelect } from "@/components/admin/LatamBrandSelect";
import {
  assertGalleryItemImageFile,
  getGalleryWorkImageUrl,
  removeGalleryWorkImage,
  uploadGalleryWorkImage,
} from "@/lib/amplify/gallery-item-image-storage";
import { adminDataClient } from "@/lib/amplify/admin-data-client";
import { configureAmplifyClient } from "@/lib/amplify/configure";
import { GALLERY_WORK_IMAGE_S3_PREFIX } from "@/lib/storage-paths";
import type { GalleryLayoutType } from "@/lib/gallery-types";

const LAYOUT_SINGLE: GalleryLayoutType = "SINGLE";
const LAYOUT_BEFORE_AFTER: GalleryLayoutType = "BEFORE_AFTER";

type CategoryOption = { readonly id: string; label: string; slug: string };

type ItemRow = {
  readonly id: string;
  readonly categoryIds: readonly string[];
  readonly categoryLabelsLine: string;
  layoutType: GalleryLayoutType;
  vehicleBrand: string | null;
  title: string;
  body: string | null;
  sortOrder: number | null;
  isPublished: boolean | null;
};

const emptyForm = {
  selectedCategoryIds: [] as string[],
  layoutType: LAYOUT_SINGLE as GalleryLayoutType,
  vehicleBrand: "",
  title: "",
  body: "",
  sortOrder: 0,
  isPublished: true,
};

const modelsMissingMessage =
  "Faltan modelos GalleryItem / GalleryItemCategoryLink / GalleryCategory. Despliega Amplify y actualiza amplify_outputs.";

const syncGalleryItemCategoryLinks = async (
  itemId: string,
  categoryIds: readonly string[],
): Promise<void> => {
  const client = adminDataClient();
  const m = client.models.GalleryItemCategoryLink;
  if (!m?.list || !m.create || !m.delete) {
    throw new Error("Modelo de enlaces no disponible.");
  }
  const { data: all } = await m.list();
  const mine = (all ?? []).filter((l) => l.galleryItemId === itemId);
  for (const l of mine) {
    await m.delete({ id: l.id });
  }
  const unique = [...new Set(categoryIds.filter(Boolean))];
  for (const cid of unique) {
    await m.create({ galleryItemId: itemId, galleryCategoryId: cid });
  }
};

export default function AdminGaleriaPage() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [rows, setRows] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [fileSingle, setFileSingle] = useState<File | null>(null);
  const [fileBefore, setFileBefore] = useState<File | null>(null);
  const [fileAfter, setFileAfter] = useState<File | null>(null);
  const [existingSingle, setExistingSingle] = useState<string | null>(null);
  const [existingBefore, setExistingBefore] = useState<string | null>(null);
  const [existingAfter, setExistingAfter] = useState<string | null>(null);
  const [previewSingle, setPreviewSingle] = useState<string | null>(null);
  const [previewBefore, setPreviewBefore] = useState<string | null>(null);
  const [previewAfter, setPreviewAfter] = useState<string | null>(null);
  const categoryFieldsetRef = useRef<HTMLFieldSetElement>(null);
  const draftRef = useRef({
    fileSingle,
    fileBefore,
    fileAfter,
    previewSingle,
    previewBefore,
    previewAfter,
  });
  draftRef.current = {
    fileSingle,
    fileBefore,
    fileAfter,
    previewSingle,
    previewBefore,
    previewAfter,
  };

  const revokeDraftBlobs = () => {
    const d = draftRef.current;
    for (const url of [d.previewSingle, d.previewBefore, d.previewAfter]) {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    }
  };

  const modelsOk = useCallback(() => {
    if (!configureAmplifyClient()) return false;
    const c = adminDataClient();
    // Con outputs antiguos pueden faltar modelos en runtime; el tipo Schema
    // siempre declara los métodos, por eso se usa una vista laxa.
    const m = c.models as unknown as Record<
      string,
      Partial<{
        list: unknown;
        create: unknown;
        update: unknown;
        delete: unknown;
      }>
    >;
    const cat = m.GalleryCategory;
    const it = m.GalleryItem;
    const link = m.GalleryItemCategoryLink;
    return Boolean(
      typeof cat?.list === "function" &&
        typeof it?.list === "function" &&
        typeof it.create === "function" &&
        typeof it.update === "function" &&
        typeof it.delete === "function" &&
        typeof link?.list === "function" &&
        typeof link.create === "function" &&
        typeof link.delete === "function",
    );
  }, []);

  const loadData = useCallback(async () => {
    if (!modelsOk()) {
      setError(modelsMissingMessage);
      setCategories([]);
      setRows([]);
      setLoading(false);
      return;
    }
    setError(null);
    const client = adminDataClient();
    const { data: cats, errors: e1 } = await client.models.GalleryCategory.list();
    if (e1?.length) {
      setError(e1.map((x) => x.message).join(", "));
      setLoading(false);
      return;
    }
    const catList = (cats ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      slug: c.slug,
    }));
    catList.sort((a, b) => a.label.localeCompare(b.label));
    setCategories(catList);
    const catLabel = new Map(catList.map((c) => [c.id, c.label]));

    const { data: items, errors: e2 } = await client.models.GalleryItem.list();
    if (e2?.length) {
      setError(e2.map((x) => x.message).join(", "));
      setLoading(false);
      return;
    }

    const { data: linkRows, errors: e3 } =
      await client.models.GalleryItemCategoryLink.list();
    if (e3?.length) {
      setError(e3.map((x) => x.message).join(", "));
      setLoading(false);
      return;
    }

    const linksByItem = new Map<string, string[]>();
    for (const l of linkRows ?? []) {
      if (!l.galleryItemId || !l.galleryCategoryId) continue;
      const arr = linksByItem.get(l.galleryItemId) ?? [];
      arr.push(l.galleryCategoryId);
      linksByItem.set(l.galleryItemId, arr);
    }

    const enriched: ItemRow[] = (items ?? []).map((r) => {
      const ids = [...new Set(linksByItem.get(r.id) ?? [])];
      const labels = ids
        .map((id) => catLabel.get(id))
        .filter(Boolean)
        .join(", ");
      return {
        id: r.id,
        categoryIds: ids,
        categoryLabelsLine: labels.length > 0 ? labels : "— sin categorías",
        layoutType: r.layoutType === "BEFORE_AFTER" ? LAYOUT_BEFORE_AFTER : LAYOUT_SINGLE,
        vehicleBrand: r.vehicleBrand ?? null,
        title: r.title,
        body: r.body ?? null,
        sortOrder: r.sortOrder ?? 0,
        isPublished: r.isPublished ?? true,
      };
    });
    enriched.sort((a, b) => {
      const so = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (so !== 0) return so;
      return a.title.localeCompare(b.title);
    });
    setRows(enriched);
    setLoading(false);
  }, [modelsOk]);

  useEffect(() => {
    const t = globalThis.setTimeout(() => void loadData(), 0);
    return () => globalThis.clearTimeout(t);
  }, [loadData]);

  useEffect(() => {
    if (fileSingle) {
      const u = URL.createObjectURL(fileSingle);
      setPreviewSingle(u);
      return () => URL.revokeObjectURL(u);
    }
    let cancelled = false;
    const run = async () => {
      if (existingSingle) {
        const u = await getGalleryWorkImageUrl(existingSingle);
        if (!cancelled) setPreviewSingle(u);
      } else if (!cancelled) {
        setPreviewSingle(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [fileSingle, existingSingle]);

  useEffect(() => {
    if (fileBefore) {
      const u = URL.createObjectURL(fileBefore);
      setPreviewBefore(u);
      return () => URL.revokeObjectURL(u);
    }
    let cancelled = false;
    const run = async () => {
      if (existingBefore) {
        const u = await getGalleryWorkImageUrl(existingBefore);
        if (!cancelled) setPreviewBefore(u);
      } else if (!cancelled) {
        setPreviewBefore(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [fileBefore, existingBefore]);

  useEffect(() => {
    if (fileAfter) {
      const u = URL.createObjectURL(fileAfter);
      setPreviewAfter(u);
      return () => URL.revokeObjectURL(u);
    }
    let cancelled = false;
    const run = async () => {
      if (existingAfter) {
        const u = await getGalleryWorkImageUrl(existingAfter);
        if (!cancelled) setPreviewAfter(u);
      } else if (!cancelled) {
        setPreviewAfter(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [fileAfter, existingAfter]);

  useEffect(() => {
    if (!panelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => {
      const el = categoryFieldsetRef.current?.querySelector("input[type=checkbox]");
      (el as HTMLInputElement | undefined)?.focus();
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
        handleClosePanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const resetFormState = () => {
    revokeDraftBlobs();
    setFileSingle(null);
    setFileBefore(null);
    setFileAfter(null);
    setExistingSingle(null);
    setExistingBefore(null);
    setExistingAfter(null);
    setPreviewSingle(null);
    setPreviewBefore(null);
    setPreviewAfter(null);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    resetFormState();
  };

  const handleOpenCreate = () => {
    if (!modelsOk()) {
      setError(modelsMissingMessage);
      return;
    }
    resetFormState();
    setPanelOpen(true);
  };

  const handleToggleCategory = (categoryId: string) => {
    setForm((f) => {
      const has = f.selectedCategoryIds.includes(categoryId);
      return {
        ...f,
        selectedCategoryIds: has
          ? f.selectedCategoryIds.filter((x) => x !== categoryId)
          : [...f.selectedCategoryIds, categoryId],
      };
    });
  };

  const handlePickSingle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    setError(null);
    if (!f) {
      setFileSingle(null);
      return;
    }
    const err = assertGalleryItemImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFileSingle(f);
  };

  const handlePickBefore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    setError(null);
    if (!f) {
      setFileBefore(null);
      return;
    }
    const err = assertGalleryItemImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFileBefore(f);
  };

  const handlePickAfter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    setError(null);
    if (!f) {
      setFileAfter(null);
      return;
    }
    const err = assertGalleryItemImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFileAfter(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!modelsOk()) {
      setError(modelsMissingMessage);
      return;
    }
    const title = form.title.trim();
    if (!title) {
      setError("El título es obligatorio.");
      return;
    }

    const nameHint = title.slice(0, 40);
    let keySingle = existingSingle?.trim() || undefined;
    let keyBefore = existingBefore?.trim() || undefined;
    let keyAfter = existingAfter?.trim() || undefined;

    try {
      if (form.layoutType === LAYOUT_SINGLE) {
        if (fileSingle) {
          const k = await uploadGalleryWorkImage(fileSingle, nameHint);
          if (existingSingle && existingSingle !== k) {
            await removeGalleryWorkImage(existingSingle);
          }
          keySingle = k;
        }
        if (!keySingle) {
          setError("Modo una imagen: sube una foto o conserva la existente.");
          return;
        }
        keyBefore = undefined;
        keyAfter = undefined;
      } else {
        if (fileBefore) {
          const k = await uploadGalleryWorkImage(fileBefore, `${nameHint}-antes`);
          if (existingBefore && existingBefore !== k) {
            await removeGalleryWorkImage(existingBefore);
          }
          keyBefore = k;
        }
        if (fileAfter) {
          const k = await uploadGalleryWorkImage(fileAfter, `${nameHint}-despues`);
          if (existingAfter && existingAfter !== k) {
            await removeGalleryWorkImage(existingAfter);
          }
          keyAfter = k;
        }
        if (!keyBefore || !keyAfter) {
          setError(
            "Modo antes/después: necesitas ambas imágenes (archivos nuevos o ya guardados).",
          );
          return;
        }
        keySingle = undefined;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir imágenes.");
      return;
    }

    const client = adminDataClient();
    const payload = {
      layoutType: form.layoutType,
      vehicleBrand: form.vehicleBrand.trim() || undefined,
      title,
      body: form.body.trim() || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      isPublished: form.isPublished,
      ...(form.layoutType === LAYOUT_SINGLE
        ? {
            imageKeySingle: keySingle,
            imageKeyBefore: null,
            imageKeyAfter: null,
          }
        : {
            imageKeySingle: null,
            imageKeyBefore: keyBefore,
            imageKeyAfter: keyAfter,
          }),
    };

    let itemId = editingId;

    if (editingId) {
      const { errors } = await client.models.GalleryItem.update({
        id: editingId,
        ...payload,
      });
      if (errors?.length) {
        setError(errors.map((x) => x.message).join(", "));
        return;
      }
    } else {
      const { data: created, errors } = await client.models.GalleryItem.create(payload);
      if (errors?.length) {
        setError(errors.map((x) => x.message).join(", "));
        return;
      }
      if (!created?.id) {
        setError("No se recibió el id del recurso creado.");
        return;
      }
      itemId = created.id;
    }

    try {
      await syncGalleryItemCategoryLinks(itemId!, form.selectedCategoryIds);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar categorías.");
      return;
    }

    setPanelOpen(false);
    resetFormState();
    setLoading(true);
    await loadData();
  };

  const handleEdit = async (r: ItemRow) => {
    if (!modelsOk()) {
      setError(modelsMissingMessage);
      return;
    }
    setEditingId(r.id);
    setForm({
      ...emptyForm,
      selectedCategoryIds: [...r.categoryIds],
      layoutType: r.layoutType,
      vehicleBrand: r.vehicleBrand ?? "",
      title: r.title,
      body: r.body ?? "",
      sortOrder: r.sortOrder ?? 0,
      isPublished: r.isPublished ?? true,
    });
    setFileSingle(null);
    setFileBefore(null);
    setFileAfter(null);
    setError(null);

    const client = adminDataClient();
    const { data: raw } = await client.models.GalleryItem.get({ id: r.id });
    if (!raw) {
      setError("No se pudo cargar el recurso.");
      return;
    }
    setExistingSingle(raw.imageKeySingle ?? null);
    setExistingBefore(raw.imageKeyBefore ?? null);
    setExistingAfter(raw.imageKeyAfter ?? null);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!globalThis.confirm("¿Eliminar este recurso de la galería?")) return;
    if (!modelsOk()) return;
    const client = adminDataClient();
    const linkModel = client.models.GalleryItemCategoryLink;
    if (linkModel?.list && linkModel.delete) {
      const { data: allLinks } = await linkModel.list();
      for (const l of (allLinks ?? []).filter((x) => x.galleryItemId === id)) {
        await linkModel.delete({ id: l.id });
      }
    }
    const { data: row } = await client.models.GalleryItem.get({ id });
    if (row) {
      await removeGalleryWorkImage(row.imageKeySingle ?? undefined);
      await removeGalleryWorkImage(row.imageKeyBefore ?? undefined);
      await removeGalleryWorkImage(row.imageKeyAfter ?? undefined);
    }
    await client.models.GalleryItem.delete({ id });
    setLoading(true);
    await loadData();
  };

  const filteredRows = rows.filter((r) => {
    if (filterCategoryId && !r.categoryIds.includes(filterCategoryId)) return false;
    if (filterBrand.trim()) {
      const b = r.vehicleBrand?.toLowerCase() ?? "";
      if (!b.includes(filterBrand.trim().toLowerCase())) return false;
    }
    return true;
  });

  const showSinglePreview = Boolean(previewSingle);
  const showBeforePreview = Boolean(previewBefore);
  const showAfterPreview = Boolean(previewAfter);

  if (loading && rows.length === 0 && categories.length === 0) {
    return <p className="text-sm text-zinc-400">Cargando galería…</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Gestión de galería</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Sube recursos y asígnalos a{" "}
            <span className="text-zinc-300">ninguna, una o varias categorías</span> del
            sitio. Opcionalmente indica{" "}
            <span className="text-zinc-300">marca de vehículo</span>. Cada recurso: una
            imagen + título + descripción, o dos imágenes (antes/después) + título +
            descripción. Publicados en{" "}
            <code className="rounded bg-zinc-800 px-1">/galeria/[slug]</code> cuando la
            categoría está enlazada. S3:{" "}
            <code className="rounded bg-zinc-800 px-1">{GALLERY_WORK_IMAGE_S3_PREFIX}/</code>
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="shrink-0 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
        >
          Nuevo recurso
        </button>
      </header>

      {error && !panelOpen ? (
        <p className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex max-w-xs flex-col gap-1 text-sm text-zinc-400">
          Filtrar por categoría
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex max-w-xs flex-col gap-1 text-sm text-zinc-400">
          Marca (contiene)
          <input
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            placeholder="ej. BMW"
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </label>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center text-sm text-zinc-400">
          No hay recursos con estos filtros.{" "}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="text-zinc-200 underline hover:text-white"
          >
            Crear uno
          </button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRows.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm"
            >
              <p className="font-medium text-white">{r.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {r.categoryLabelsLine} ·{" "}
                {r.layoutType === LAYOUT_BEFORE_AFTER ? "Antes / después" : "Una imagen"}
                {r.vehicleBrand ? ` · ${r.vehicleBrand}` : ""}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {r.isPublished ? "Publicado" : "Borrador"} · orden {r.sortOrder ?? 0}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleEdit(r)}
                  className="rounded-md border border-zinc-600 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="rounded-md border border-red-900/60 px-2 py-1 text-xs text-red-300 hover:bg-red-950/40"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {panelOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Cerrar panel"
            className="absolute inset-0 bg-black/60"
            onClick={handleClosePanel}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="galeria-panel-title"
            className="relative z-50 flex h-full w-full max-w-xl flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2 id="galeria-panel-title" className="text-sm font-semibold text-white">
                {editingId ? "Editar recurso" : "Nuevo recurso"}
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
                <fieldset
                  ref={categoryFieldsetRef}
                  className="rounded-lg border border-zinc-800 p-3"
                >
                  <legend className="px-1 text-sm text-zinc-300">
                    Categorías del sitio (ninguna, una o varias)
                  </legend>
                  {categories.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Crea categorías primero en &quot;Categorías (galería)&quot;.
                    </p>
                  ) : (
                    <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
                      {categories.map((c) => {
                        const checked = form.selectedCategoryIds.includes(c.id);
                        return (
                          <li key={c.id}>
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleCategory(c.id)}
                                className="h-4 w-4 rounded border-zinc-600"
                                aria-checked={checked}
                              />
                              <span>
                                {c.label}{" "}
                                <span className="text-zinc-500">({c.slug})</span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </fieldset>

                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Marca del vehículo (opcional)</span>
                  <LatamBrandSelect
                    id="gallery-item-brand"
                    value={form.vehicleBrand}
                    onChange={(next) => setForm((f) => ({ ...f, vehicleBrand: next }))}
                  />
                </div>
                <fieldset className="grid gap-2 rounded-lg border border-zinc-800 p-3">
                  <legend className="px-1 text-sm text-zinc-400">Tipo de recurso</legend>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="radio"
                      name="layout"
                      checked={form.layoutType === LAYOUT_SINGLE}
                      onChange={() =>
                        setForm((f) => ({ ...f, layoutType: LAYOUT_SINGLE }))
                      }
                      className="h-4 w-4 border-zinc-600"
                    />
                    Una imagen + título + descripción
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="radio"
                      name="layout"
                      checked={form.layoutType === LAYOUT_BEFORE_AFTER}
                      onChange={() =>
                        setForm((f) => ({ ...f, layoutType: LAYOUT_BEFORE_AFTER }))
                      }
                      className="h-4 w-4 border-zinc-600"
                    />
                    Antes y después (dos imágenes) + título + descripción
                  </label>
                </fieldset>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Título</span>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Descripción</span>
                  <textarea
                    rows={4}
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                  />
                </label>

                {form.layoutType === LAYOUT_SINGLE ? (
                  <div className="space-y-2">
                    <span className="text-sm text-zinc-400">Imagen</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePickSingle}
                      className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-zinc-100"
                    />
                    {showSinglePreview ? (
                      <div className="relative mt-2 aspect-video max-w-md overflow-hidden rounded-lg border border-zinc-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewSingle!}
                          alt="Vista previa"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <span className="text-sm text-zinc-400">Imagen antes</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePickBefore}
                        className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-zinc-100"
                      />
                      {showBeforePreview ? (
                        <div className="relative mt-2 aspect-video overflow-hidden rounded-lg border border-zinc-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewBefore!}
                            alt="Antes"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-zinc-400">Imagen después</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePickAfter}
                        className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-zinc-100"
                      />
                      {showAfterPreview ? (
                        <div className="relative mt-2 aspect-video overflow-hidden rounded-lg border border-zinc-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewAfter!}
                            alt="Después"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Orden de visualización</span>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sortOrder: Number.parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
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
                  Publicado en la web
                </label>
                <div className="sticky bottom-0 flex gap-2 border-t border-zinc-800 bg-zinc-900 pt-4">
                  <button
                    type="submit"
                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
                  >
                    {editingId ? "Guardar" : "Crear"}
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

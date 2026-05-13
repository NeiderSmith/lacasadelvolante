"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  assertVehicleImageFile,
  getVehicleListingImageUrl,
  removeVehicleListingImage,
  uploadVehicleListingImage,
} from "@/lib/amplify/vehicle-image-storage";
import { adminDataClient } from "@/lib/amplify/admin-data-client";
import { configureAmplifyClient } from "@/lib/amplify/configure";
import {
  groupVehicleImagesByListingId,
  listVehicleListingImagesAll,
  normalizePrimaryDrafts,
  normalizePrimaryInDatabase,
  pickPrimaryVehicleImage,
  type VehicleListingImageRow,
} from "@/lib/amplify/vehicle-listing-images";
import { VEHICLE_IMAGE_S3_PREFIX } from "@/lib/storage-paths";

type VehicleRow = {
  readonly id: string;
  name: string;
  year: number | null;
  kmLabel: string | null;
  engine: string | null;
  power: string | null;
  trans: string | null;
  priceLabel: string | null;
  badge: string | null;
  sortOrder: number | null;
  isPublished: boolean | null;
  primaryPreviewUrl: string | null;
  imageCount: number;
};

type VehicleImageDraft = {
  readonly clientKey: string;
  recordId?: string;
  imageKey?: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
  previewUrl: string | null;
  pendingFile?: File;
};

const emptyForm = {
  name: "",
  year: "",
  kmLabel: "",
  engine: "",
  power: "",
  trans: "",
  priceLabel: "",
  badge: "",
  sortOrder: 0,
  isPublished: true,
};

const newDraftKey = (): string =>
  typeof globalThis.crypto !== "undefined" &&
  typeof globalThis.crypto.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const vehicleModelMissingMessage =
  "Faltan modelos VehicleListing / VehicleListingImage en la configuración. Despliega Amplify, regenera amplify_outputs.json y actualiza NEXT_PUBLIC_AMPLIFY_OUTPUTS; luego recarga.";

export default function AdminVehiculosPage() {
  const [rows, setRows] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draftImages, setDraftImages] = useState<VehicleImageDraft[]>([]);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const draftImagesRef = useRef<VehicleImageDraft[]>([]);
  draftImagesRef.current = draftImages;

  const revokeBlobPreviews = (drafts: readonly VehicleImageDraft[]) => {
    for (const d of drafts) {
      if (d.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(d.previewUrl);
      }
    }
  };

  const getVehicleModel = useCallback(() => {
    if (!configureAmplifyClient()) return null;
    const client = adminDataClient();
    const m = client.models.VehicleListing;
    if (typeof m?.list !== "function") return null;
    return m;
  }, []);

  const modelsAvailable = useCallback(() => {
    if (!configureAmplifyClient()) return false;
    const client = adminDataClient();
    const models = client.models as unknown as Record<
      string,
      Partial<{
        list: unknown;
        create: unknown;
        update: unknown;
        delete: unknown;
      }>
    >;
    const v = models.VehicleListing;
    const i = models.VehicleListingImage;
    return Boolean(
      typeof v?.list === "function" &&
        typeof i?.list === "function" &&
        typeof v.create === "function" &&
        typeof v.update === "function" &&
        typeof v.delete === "function" &&
        typeof i.create === "function" &&
        typeof i.update === "function" &&
        typeof i.delete === "function",
    );
  }, []);

  const loadRows = useCallback(async () => {
    if (!modelsAvailable()) {
      setError(vehicleModelMissingMessage);
      setRows([]);
      setLoading(false);
      return;
    }
    setError(null);
    const client = adminDataClient();
    const vehicleModel = client.models.VehicleListing;
    const { data, errors } = await vehicleModel.list();
    if (errors?.length) {
      setError(errors.map((e) => e.message).join(", "));
      setLoading(false);
      return;
    }
    const allImgs = await listVehicleListingImagesAll(client);
    const byVehicle = groupVehicleImagesByListingId(allImgs);
    const list = (data ?? []) as Omit<
      VehicleRow,
      "primaryPreviewUrl" | "imageCount"
    >[];
    const sorted = [...list].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
    const withPreview = await Promise.all(
      sorted.map(async (r) => {
        const imgs = byVehicle.get(r.id) ?? [];
        const primary = pickPrimaryVehicleImage(imgs);
        const primaryPreviewUrl = await getVehicleListingImageUrl(
          primary?.imageKey ?? undefined,
        );
        return {
          ...r,
          primaryPreviewUrl,
          imageCount: imgs.length,
        } satisfies VehicleRow;
      }),
    );
    setRows(withPreview);
    setLoading(false);
  }, [modelsAvailable]);

  useEffect(() => {
    const t = globalThis.setTimeout(() => {
      void loadRows();
    }, 0);
    return () => globalThis.clearTimeout(t);
  }, [loadRows]);

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
        revokeBlobPreviews(draftImagesRef.current);
        setDraftImages([]);
        setError(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const resetFormState = () => {
    revokeBlobPreviews(draftImagesRef.current);
    setDraftImages([]);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    resetFormState();
  };

  const handleOpenCreate = () => {
    if (!modelsAvailable()) {
      setError(vehicleModelMissingMessage);
      return;
    }
    resetFormState();
    setPanelOpen(true);
  };

  const handlePickMultipleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    setError(null);
    if (files.length === 0) return;
    const nameHint = form.name.trim() || "vehiculo";
    const newRows: VehicleImageDraft[] = [];
    for (const file of files) {
      const validationError = assertVehicleImageFile(file);
      if (validationError) {
        setError(validationError);
        revokeBlobPreviews(newRows);
        return;
      }
      const url = URL.createObjectURL(file);
      newRows.push({
        clientKey: newDraftKey(),
        alt: nameHint,
        sortOrder: draftImagesRef.current.length + newRows.length,
        isPrimary: false,
        previewUrl: url,
        pendingFile: file,
      });
    }
    setDraftImages((prev) =>
      normalizePrimaryDrafts([...prev, ...newRows]),
    );
  };

  const handleRemoveDraft = (clientKey: string) => {
    setDraftImages((prev) => {
      const found = prev.find((d) => d.clientKey === clientKey);
      if (found?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(found.previewUrl);
      }
      const next = prev.filter((d) => d.clientKey !== clientKey);
      return normalizePrimaryDrafts(
        next.map((d, i) => ({ ...d, sortOrder: i })),
      );
    });
  };

  const handleSetPrimary = (clientKey: string) => {
    setDraftImages((prev) =>
      normalizePrimaryDrafts(
        prev.map((d) => ({
          ...d,
          isPrimary: d.clientKey === clientKey,
        })),
      ),
    );
  };

  const handleDraftAltChange = (clientKey: string, alt: string) => {
    setDraftImages((prev) =>
      prev.map((d) => (d.clientKey === clientKey ? { ...d, alt } : d)),
    );
  };

  const handleMoveDraft = (clientKey: string, delta: -1 | 1) => {
    setDraftImages((prev) => {
      const idx = prev.findIndex((d) => d.clientKey === clientKey);
      if (idx < 0) return prev;
      const j = idx + delta;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      const t = copy[idx];
      copy[idx] = copy[j]!;
      copy[j] = t!;
      const reordered = copy.map((d, i) => ({ ...d, sortOrder: i }));
      return normalizePrimaryDrafts(reordered);
    });
  };

  const buildVehiclePayload = ():
    | { readonly ok: false; readonly error: string }
    | {
        readonly ok: true;
        readonly payload: {
          name: string;
          year?: number;
          kmLabel?: string;
          engine?: string;
          power?: string;
          trans?: string;
          priceLabel?: string;
          badge?: string;
          sortOrder: number;
          isPublished: boolean;
        };
      } => {
    const name = form.name.trim();
    const yearRaw = form.year.trim();
    let year: number | undefined;
    if (yearRaw) {
      const n = Number.parseInt(yearRaw, 10);
      if (Number.isNaN(n)) {
        return { ok: false, error: "Año inválido." };
      }
      year = n;
    }
    return {
      ok: true,
      payload: {
        name,
        ...(year !== undefined ? { year } : {}),
        kmLabel: form.kmLabel.trim() || undefined,
        engine: form.engine.trim() || undefined,
        power: form.power.trim() || undefined,
        trans: form.trans.trim() || undefined,
        priceLabel: form.priceLabel.trim() || undefined,
        badge: form.badge.trim() || undefined,
        sortOrder: Number(form.sortOrder) || 0,
        isPublished: form.isPublished,
      },
    };
  };

  const persistGallery = async (
    vehicleListingId: string,
    drafts: VehicleImageDraft[],
    vehicleNameForUpload: string,
  ): Promise<string | null> => {
    const client = adminDataClient();
    const imgModel = client.models.VehicleListingImage;
    if (!imgModel?.list || !imgModel.create || !imgModel.update || !imgModel.delete) {
      return "No se pudo acceder al modelo de imágenes.";
    }

    const { data: allRows } = await imgModel.list();
    const existingForVehicle = ((allRows ?? []) as VehicleListingImageRow[]).filter(
      (r) => r.vehicleListingId === vehicleListingId,
    );
    const desiredIds = new Set(
      drafts.map((d) => d.recordId).filter(Boolean) as string[],
    );

    for (const ex of existingForVehicle) {
      if (!desiredIds.has(ex.id)) {
        await removeVehicleListingImage(ex.imageKey);
        await imgModel.delete({ id: ex.id });
      }
    }

    const normalized = normalizePrimaryDrafts(drafts);

    for (let i = 0; i < normalized.length; i++) {
      const d = normalized[i]!;
      let imageKey = d.imageKey;
      if (d.pendingFile) {
        const uploaded = await uploadVehicleListingImage(
          d.pendingFile,
          vehicleNameForUpload,
        );
        if (d.recordId && d.imageKey && d.imageKey !== uploaded) {
          await removeVehicleListingImage(d.imageKey);
        }
        imageKey = uploaded;
      }
      if (!imageKey?.trim()) {
        return "Cada imagen debe tener archivo (filas nuevas) o estar guardada.";
      }

      const alt = d.alt.trim() || undefined;
      const sortOrder = d.sortOrder ?? i;
      const isPrimary = d.isPrimary === true;

      if (d.recordId) {
        const { errors } = await imgModel.update({
          id: d.recordId,
          imageKey: imageKey.trim(),
          imageAlt: alt,
          sortOrder,
          isPrimary,
        });
        if (errors?.length) {
          return errors.map((er) => er.message).join(", ");
        }
      } else {
        const { errors } = await imgModel.create({
          vehicleListingId,
          imageKey: imageKey.trim(),
          imageAlt: alt,
          sortOrder,
          isPrimary,
        });
        if (errors?.length) {
          return errors.map((er) => er.message).join(", ");
        }
      }
    }

    await normalizePrimaryInDatabase(client, vehicleListingId);
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const name = form.name.trim();
    if (!name) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!modelsAvailable()) {
      setError(vehicleModelMissingMessage);
      return;
    }

    const built = buildVehiclePayload();
    if (!built.ok) {
      setError(built.error);
      return;
    }

    const client = adminDataClient();
    const vehicleModel = client.models.VehicleListing;
    const drafts = normalizePrimaryDrafts(draftImages);

    let vehicleId = editingId;

    if (editingId) {
      const { errors } = await vehicleModel.update({
        id: editingId,
        ...built.payload,
      });
      if (errors?.length) {
        setError(errors.map((er) => er.message).join(", "));
        return;
      }
    } else {
      const { data: created, errors } = await vehicleModel.create(built.payload);
      if (errors?.length) {
        setError(errors.map((er) => er.message).join(", "));
        return;
      }
      if (!created?.id) {
        setError("No se recibió el id del vehículo creado.");
        return;
      }
      vehicleId = created.id;
    }

    const galleryErr = await persistGallery(vehicleId!, drafts, name);
    if (galleryErr) {
      setError(galleryErr);
      return;
    }

    setPanelOpen(false);
    resetFormState();
    setLoading(true);
    await loadRows();
  };

  const handleEdit = async (r: VehicleRow) => {
    if (!modelsAvailable()) {
      setError(vehicleModelMissingMessage);
      return;
    }
    setEditingId(r.id);
    setError(null);
    setForm({
      name: r.name,
      year: r.year != null ? String(r.year) : "",
      kmLabel: r.kmLabel ?? "",
      engine: r.engine ?? "",
      power: r.power ?? "",
      trans: r.trans ?? "",
      priceLabel: r.priceLabel ?? "",
      badge: r.badge ?? "",
      sortOrder: r.sortOrder ?? 0,
      isPublished: r.isPublished ?? true,
    });

    const client = adminDataClient();
    const allImgs = await listVehicleListingImagesAll(client);
    const mine = allImgs
      .filter((img) => img.vehicleListingId === r.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    const drafts: VehicleImageDraft[] = await Promise.all(
      mine.map(async (img, i) => {
        const previewUrl = await getVehicleListingImageUrl(img.imageKey);
        return {
          clientKey: img.id,
          recordId: img.id,
          imageKey: img.imageKey,
          alt: img.imageAlt ?? "",
          sortOrder: img.sortOrder ?? i,
          isPrimary: img.isPrimary === true,
          previewUrl,
        } satisfies VehicleImageDraft;
      }),
    );
    setDraftImages(normalizePrimaryDrafts(drafts));
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!globalThis.confirm("¿Eliminar este vehículo del listado?")) return;
    if (!modelsAvailable()) {
      setError(vehicleModelMissingMessage);
      return;
    }
    const client = adminDataClient();
    const vehicleModel = client.models.VehicleListing;
    const imgModel = client.models.VehicleListingImage;
    if (!vehicleModel?.delete || !imgModel?.list || !imgModel.delete) {
      setError(vehicleModelMissingMessage);
      return;
    }
    const { data: allRows } = await imgModel.list();
    const mine = ((allRows ?? []) as VehicleListingImageRow[]).filter(
      (row) => row.vehicleListingId === id,
    );
    for (const im of mine) {
      await removeVehicleListingImage(im.imageKey);
      await imgModel.delete({ id: im.id });
    }
    await vehicleModel.delete({ id });
    setLoading(true);
    await loadRows();
  };

  if (loading && rows.length === 0) {
    return <p className="text-sm text-zinc-400">Cargando vehículos…</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Vehículos en venta
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Varias fotos por anuncio; marca una como{" "}
            <span className="font-medium text-zinc-200">principal</span> para la
            tarjeta en la web. S3:{" "}
            <code className="rounded bg-zinc-800 px-1">
              {VEHICLE_IMAGE_S3_PREFIX}/
            </code>
            . Solo publicados se muestran en la landing.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="shrink-0 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
        >
          Nuevo vehículo
        </button>
      </header>

      {error && !panelOpen ? (
        <p className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <section aria-labelledby="lista-veh-heading">
        <h2 id="lista-veh-heading" className="sr-only">
          Listado de vehículos
        </h2>
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center">
            <p className="text-sm text-zinc-400">
              No hay vehículos en el panel. Añade el primero con &quot;Nuevo
              vehículo&quot;.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 rounded-md border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              Nuevo vehículo
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                <div className="relative aspect-[5/3] bg-zinc-800">
                  {r.primaryPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.primaryPreviewUrl}
                      alt={r.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                      Sin foto
                    </div>
                  )}
                  <span
                    className={[
                      "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white",
                      "bg-zinc-950/85",
                    ].join(" ")}
                  >
                    {r.imageCount} foto{r.imageCount === 1 ? "" : "s"}
                  </span>
                  <span
                    className={[
                      "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      r.isPublished
                        ? "bg-emerald-950/90 text-emerald-200"
                        : "bg-zinc-950/90 text-zinc-400",
                    ].join(" ")}
                  >
                    {r.isPublished ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div>
                    <p className="font-medium text-white">{r.name}</p>
                    <p className="text-xs text-zinc-500">
                      {r.year ?? "—"} · orden {r.sortOrder ?? 0}
                      {r.priceLabel ? ` · ${r.priceLabel}` : ""}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleEdit(r)}
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
            aria-labelledby="panel-veh-title"
            className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2
                id="panel-veh-title"
                className="text-sm font-semibold text-white"
              >
                {editingId ? "Editar vehículo" : "Nuevo vehículo"}
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
                  <span className="text-zinc-400">Nombre del anuncio</span>
                  <input
                    ref={firstFieldRef}
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="ej. SUV ejecutiva AWD"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Año</span>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, year: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="2022"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Kilometraje (texto)</span>
                  <input
                    value={form.kmLabel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, kmLabel: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="38.000 km"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Motor</span>
                  <input
                    value={form.engine}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, engine: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="3.0 T"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Potencia</span>
                  <input
                    value={form.power}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, power: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="340 HP"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Transmisión</span>
                  <input
                    value={form.trans}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, trans: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="Auto 8V"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Precio (texto en pantalla)</span>
                  <input
                    value={form.priceLabel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priceLabel: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="$189.000.000"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Badge (opcional)</span>
                  <input
                    value={form.badge}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, badge: e.target.value }))
                    }
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                    placeholder="Destacado"
                  />
                </label>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-300">
                      Fotos del vehículo
                    </span>
                    <p className="text-xs text-zinc-500">
                      Añade varias imágenes (JPEG, PNG o WebP, máx. 8 MB c/u).
                      Marca una como principal para la tarjeta en la web.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePickMultipleImages}
                      className="mt-2 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-zinc-100"
                      aria-label="Añadir una o más imágenes del vehículo"
                    />
                  </div>

                  {draftImages.length > 0 ? (
                    <ul className="mt-4 space-y-3" aria-label="Imágenes del anuncio">
                      {draftImages.map((d, index) => (
                        <li
                          key={d.clientKey}
                          className="flex gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-2"
                        >
                          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded border border-zinc-700 bg-zinc-800">
                            {d.previewUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={d.previewUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <label className="block text-xs text-zinc-400">
                              Texto alternativo
                              <input
                                value={d.alt}
                                onChange={(e) =>
                                  handleDraftAltChange(
                                    d.clientKey,
                                    e.target.value,
                                  )
                                }
                                className="mt-0.5 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-white outline-none focus:border-zinc-500"
                              />
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-300">
                                <input
                                  type="radio"
                                  name="primary-vehicle-image"
                                  checked={d.isPrimary}
                                  onChange={() => handleSetPrimary(d.clientKey)}
                                  className="h-3.5 w-3.5 border-zinc-600"
                                  aria-label={`Marcar como foto principal: posición ${index + 1}`}
                                />
                                Principal
                              </label>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveDraft(d.clientKey, -1)}
                                  disabled={index === 0}
                                  className="rounded border border-zinc-600 px-1.5 py-0.5 text-xs text-zinc-300 disabled:opacity-40"
                                  aria-label="Subir en el orden"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveDraft(d.clientKey, 1)}
                                  disabled={index === draftImages.length - 1}
                                  className="rounded border border-zinc-600 px-1.5 py-0.5 text-xs text-zinc-300 disabled:opacity-40"
                                  aria-label="Bajar en el orden"
                                >
                                  ↓
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveDraft(d.clientKey)}
                                className="ml-auto text-xs text-red-300 hover:text-red-200"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-zinc-500">
                      Opcional: puedes guardar el vehículo sin fotos y añadirlas
                      después al editar.
                    </p>
                  )}
                </div>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">Orden en la landing</span>
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
                  Publicado en la web
                </label>
                <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-zinc-800 bg-zinc-900 pt-4">
                  <button
                    type="submit"
                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
                  >
                    {editingId ? "Guardar cambios" : "Crear vehículo"}
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

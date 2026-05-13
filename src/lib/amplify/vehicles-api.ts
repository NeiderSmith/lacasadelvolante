"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import { getVehicleListingImageUrl } from "@/lib/amplify/vehicle-image-storage";
import {
  groupVehicleImagesByListingId,
  listVehicleListingImagesAll,
  pickPrimaryVehicleImage,
} from "@/lib/amplify/vehicle-listing-images";
import { configureAmplifyClient } from "@/lib/amplify/configure";
import type { VehicleListingDisplay } from "@/lib/vehicle-types";

const clientIdentityPool = () =>
  generateClient<Schema>({ authMode: "identityPool" });

const clientUserPool = () =>
  generateClient<Schema>({ authMode: "userPool" });

const getVehicleListClient = async () => {
  try {
    const session = await fetchAuthSession();
    if (session.tokens?.idToken) {
      return clientUserPool();
    }
  } catch {
    /* sin sesión */
  }
  return clientIdentityPool();
};

export const fetchPublishedVehicleListings =
  async (): Promise<VehicleListingDisplay[]> => {
    if (!configureAmplifyClient()) return [];

    const dataClient = await getVehicleListClient();

    const vehicleModel = dataClient.models.VehicleListing;
    if (!vehicleModel?.list) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[VehicleListing] El modelo no está en amplify_outputs; despliega el schema y regenera outputs.",
        );
      }
      return [];
    }

    const { data: rows, errors } = await vehicleModel.list();

    if (errors?.length) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[VehicleListing.list]", errors);
      }
      return [];
    }

    const list = rows ?? [];
    const published = list.filter((r) => r.isPublished !== false);

    if (published.length === 0) return [];

    const sorted = [...published].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );

    const allImages = await listVehicleListingImagesAll(dataClient);
    const byVehicle = groupVehicleImagesByListingId(allImages);

    const mapped = await Promise.all(
      sorted.map(async (r) => {
        const imgs = byVehicle.get(r.id) ?? [];
        const primary = pickPrimaryVehicleImage(imgs);
        const imageUrl = await getVehicleListingImageUrl(
          primary?.imageKey ?? undefined,
        );
        return {
          id: r.id,
          name: r.name,
          year: r.year ?? null,
          km: r.kmLabel?.trim() || "—",
          engine: r.engine?.trim() || "—",
          power: r.power?.trim() || "—",
          trans: r.trans?.trim() || "—",
          price: r.priceLabel?.trim() || "Consultar",
          badge: r.badge?.trim() || null,
          vehicleBrand: r.vehicleBrand?.trim() || null,
          alt:
            primary?.imageAlt?.trim() ||
            `${r.name} — vehículo en venta La Casa del Volante`,
          imageUrl,
        } satisfies VehicleListingDisplay;
      }),
    );

    return mapped;
  };

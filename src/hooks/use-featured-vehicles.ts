"use client";



import { useEffect, useState } from "react";

import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";

import { fetchPublishedVehicleListings } from "@/lib/amplify/vehicles-api";

import { featuredVehicleFallback } from "@/lib/vehicle-fallback";

import type { VehicleListingDisplay } from "@/lib/vehicle-types";



/**

 * Vehículos en venta (landing):

 * - Con Amplify: listado publicado desde Data.

 * - Sin backend: datos de ejemplo en `featuredVehicleFallback`.

 */

export const useFeaturedVehicles = () => {

  const [vehicles, setVehicles] = useState<VehicleListingDisplay[]>(() =>

    hasAmplifyOutputsEnv() ? [] : [...featuredVehicleFallback],

  );

  const [loading, setLoading] = useState(() => hasAmplifyOutputsEnv());



  useEffect(() => {

    if (!hasAmplifyOutputsEnv()) return;



    let cancelled = false;



    const load = async () => {

      const fromApi = await fetchPublishedVehicleListings();

      if (cancelled) return;

      setVehicles(fromApi);

      setLoading(false);

    };



    void load();

    return () => {

      cancelled = true;

    };

  }, []);



  return { vehicles, loading };

};



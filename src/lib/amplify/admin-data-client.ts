"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";

/** Cliente Data con sesión Cognito (grupo ADMINS) para el panel. */
export const adminDataClient = () =>
  generateClient<Schema>({ authMode: "userPool" });

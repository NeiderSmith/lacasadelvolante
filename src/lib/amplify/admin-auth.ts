"use client";

import { fetchAuthSession } from "aws-amplify/auth";

export const userIsAdmin = async (): Promise<boolean> => {
  try {
    const session = await fetchAuthSession();
    const groups = session.tokens?.idToken?.payload["cognito:groups"];
    if (Array.isArray(groups)) return groups.includes("ADMINS");
    if (typeof groups === "string") return groups === "ADMINS";
    return false;
  } catch {
    return false;
  }
};

"use server";

import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

/**
 * Get the authorization token from the cookies.
 * Get on client (cookies-next) and server (next/headers)
 * @returns The authorization token.
 */
export async function getAuthorization(): Promise<string> {
  if (typeof window === "undefined") {
    // Server side
    const cookieStore = cookies();
    return cookieStore.get("accessToken")?.value || "";
  } else {
    // Client side
    return getCookie("accessToken") || "";
  }
}

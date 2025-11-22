"use server";

import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

export async function getAuthorization(): Promise<string> {
  if (typeof window === "undefined") {
    const cookieStore = cookies();
    return cookieStore.get("accessToken")?.value || "";
  } else {
    return getCookie("accessToken") || "";
  }
}

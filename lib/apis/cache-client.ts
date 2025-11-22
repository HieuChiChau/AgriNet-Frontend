"use client";

import { setCookie, deleteCookie, getCookie } from "cookies-next";

/**
 * Get the authorization token from cookies (client-side only)
 * @returns The authorization token
 */
export function getAuthorizationClient(): string {
  if (typeof window !== "undefined") {
    return getCookie("accessToken") || "";
  }
  return "";
}

/**
 * Set the authorization token to cookies
 * @param token - The authorization token
 */
export function setAuthorization(token: string): void {
  if (typeof window !== "undefined") {
    setCookie("accessToken", token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });
  }
}

/**
 * Remove the authorization token from cookies
 */
export function removeAuthorization(): void {
  if (typeof window !== "undefined") {
    deleteCookie("accessToken", { path: "/" });
  }
}

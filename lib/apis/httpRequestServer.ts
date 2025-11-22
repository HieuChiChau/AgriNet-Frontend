"use server";

import { getAuthorization } from "./cache";

const httpRequestServer = async (
  url: string,
  method = "GET",
  options: any = {}
) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + (await getAuthorization()),
  };
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}${url}`, {
      method: method,
      ...options,
      headers: defaultHeaders,
    });
    const data = await response.json();
    return data.status === "error" ? null : data;
  } catch (error) {
    return null;
  }
};

export default httpRequestServer;

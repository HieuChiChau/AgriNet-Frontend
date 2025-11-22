import { ApiUrl } from "@/constants/api-url";
import httpRequestServer from "../apis/httpRequestServer";

export const getCurrentUserServer = async (): Promise<any> => {
  const res = await httpRequestServer(ApiUrl.GET_PROFILE);
  return res;
};

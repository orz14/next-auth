import axiosInstance from "@/lib/axios";
import { getCookie } from "@/lib/cookie";

const auth = {
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (credentials) => axiosInstance.post("/auth/register", credentials),
  getUser: () =>
    axiosInstance.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }),
  logout: () =>
    axiosInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      }
    ),
};

export default auth;

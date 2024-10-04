import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { deleteCookie, getCookie } from "./cookie";
import { useAuthContext } from "@/contexts/AuthContext";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
  Expires: "0",
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
  timeout: 60 * 1000,
});

function useAxiosInterceptors() {
  const router = useRouter();
  const { logout } = useAuthContext();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = getCookie("token") ?? null;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          deleteCookie("token");
          logout();
          router.push("/auth/login");
          return Promise.reject(new Error("Unauthorized, redirecting to login..."));
        } else if (error.response) {
          console.error("🚀 Error response:", error.response);
        } else if (error.request) {
          console.error("🚀 Error request:", error.request);
        } else {
          console.error("🚀 Error message:", error.message);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [router, logout]);

  return axiosInstance;
}

export default useAxiosInterceptors;

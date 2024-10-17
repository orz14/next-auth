import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/contexts/AuthContext";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
  Expires: "0",
};

const axiosInstance = axios.create({
  headers,
  timeout: 60 * 1000,
});

function useAxiosInterceptors() {
  const router = useRouter();
  const { logout } = useAuthContext();
  const [token, setToken] = useState(null);

  async function getToken() {
    try {
      const res = await axiosInstance.get("/api/get-token");
      setToken(res.data.token);
    } catch (err) {
      if (err.status === 400) {
        setToken(null);
      }
    }
  }

  useEffect(() => {
    getToken();

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
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
  }, [router, logout, token]);

  return axiosInstance;
}

export default useAxiosInterceptors;

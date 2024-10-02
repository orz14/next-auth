import useAxiosInterceptors from "@/lib/axios";

function useAuth() {
  const axiosInstance = useAxiosInterceptors();

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response;
    } catch (error) {
      console.error("🚀 Login error:", error);
      throw error;
    }
  };

  const register = async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/register", credentials);
      return response;
    } catch (error) {
      console.error("🚀 Register error:", error);
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response;
    } catch (error) {
      console.error("🚀 Get User error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      return response;
    } catch (error) {
      console.error("🚀 Logout error:", error);
      throw error;
    }
  };

  return {
    login,
    register,
    getUser,
    logout,
  };
}

export default useAuth;

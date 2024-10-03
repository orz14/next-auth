import jwt from "jsonwebtoken";
import { deleteCookie, getCookie } from "@/lib/cookie";
import { decryptData, encryptData } from "@/lib/crypto";
import { createContext, useContext, useState, useEffect } from "react";
import { differenceInMinutes, isBefore } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);

    const encryptedUser = encryptData(userData);
    if (encryptedUser) {
      localStorage.setItem("user", encryptedUser);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    function checkTokenExpiration() {
      console.log("AuthContext executed!");

      const token = getCookie("token") ?? null;

      if (token) {
        const now = new Date();
        const decoded = jwt.decode(token);

        const expTimestamp = decoded?.exp;
        const date = new Date(expTimestamp * 1000);

        const isExpired = isBefore(date, now);
        const minutesUntilExpiration = differenceInMinutes(date, now);

        if (isExpired || minutesUntilExpiration <= 5) {
          toast({
            variant: "destructive",
            description: "Your session has expired. Please log in again.",
          });

          deleteCookie("token");
          logout();
          router.push("/auth/login");
        } else {
          const encryptedUser = localStorage.getItem("user") ?? null;

          if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            setUser(decryptedUser);
          } else {
            const data = decoded?.data;

            const userData = {
              id: data.id,
              name: data.name,
              email: data.email,
              permissions: [],
            };

            login(userData);
          }

          setLoading(false);
        }
      } else {
        const userData = localStorage.getItem("user") ?? null;
        if (userData) {
          toast({
            variant: "destructive",
            description: "Please log in again.",
          });

          logout();
          router.push("/auth/login");
        }

        setLoading(false);
      }
    }

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 180000);

    return () => clearInterval(interval);
  }, [router, toast]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {loading ? (
        <div className="flex items-center justify-center w-full min-h-screen">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Please wait
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

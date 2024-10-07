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
    setLoading(true);
    setUser(userData);

    const encryptedUser = encryptData(userData);
    if (encryptedUser) {
      localStorage.setItem("user", encryptedUser);
    }
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    function checkTokenExpiration() {
      console.log("AuthContext executed!");

      const token = getCookie("token") ?? null;
      const callbackUrl = encodeURI(router.asPath);

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
          router.push({
            pathname: "/auth/login",
            query: { callbackUrl },
          });
        } else {
          const encryptedUser = localStorage.getItem("user") ?? null;

          if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            setUser(decryptedUser);
          } else {
            const data = decoded?.data;

            login({
              id: data.id,
              name: data.name,
              email: data.email,
              permissions: [],
            });
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
          router.push({
            pathname: "/auth/login",
            query: { callbackUrl },
          });
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
      {loading && (
        <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, width: "100%", minHeight: "100vh", backgroundColor: "#0a0a0a", zIndex: 9999 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "100vh" }}>
            <Loader2 className="animate-spin" style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
            <span>Please wait</span>
          </div>
        </div>
      )}
      <div style={{ zIndex: 10 }}>{children}</div>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

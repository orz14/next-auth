import axios from "axios";
import jwt from "jsonwebtoken";
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
  const [loadingIp, setLoadingIp] = useState(true);

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
    localStorage.removeItem("userIp");
    localStorage.removeItem("encryptedData");
  };

  useEffect(() => {
    async function getIp() {
      setLoadingIp(true);
      const ip = localStorage.getItem("userIp");

      if (!ip) {
        try {
          const res = await axios.get("/api/get-ip");
          if (res.data.ip) {
            localStorage.setItem("userIp", res.data.ip);
            setLoadingIp(false);
            return res.data.ip;
          }
        } catch (err) {
          console.error("🚀 Error fetching IP:", err);
        }
      } else {
        setLoadingIp(false);
        return ip;
      }
    }

    async function handleLogout(callbackUrl, message, logoutApi = false) {
      toast({
        variant: "destructive",
        description: message,
      });

      if (logoutApi) {
        await axios.post("/api/logout");
      }

      logout();
      router.push({
        pathname: "/auth/login",
        query: { callbackUrl },
      });
    }

    async function handleToken(token, ip, callbackUrl, setEncryptData = false) {
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

        await axios.post("/api/logout");
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

        if (setEncryptData) {
          const encryptedData = encryptData({ token, ip });
          if (encryptedData) {
            localStorage.setItem("encryptedData", encryptedData);
          }
        }
      }
    }

    async function checkTokenExpiration() {
      setLoading(true);
      console.log("AuthContext executed!");
      const callbackUrl = encodeURI(router.asPath);

      const ip = await getIp();
      if (loadingIp) return;

      const authData = localStorage.getItem("encryptedData");
      if (!authData) {
        try {
          const res = await axios.get("/api/get-token");
          await handleToken(res.data.token, ip, callbackUrl, true);
        } catch (err) {
          if (err.status === 400) {
            const userData = localStorage.getItem("user") ?? null;

            if (userData) {
              await handleLogout(callbackUrl, "Please log in again.", false);
            }
          }
        }
      } else {
        const decryptedData = decryptData(authData);

        if (decryptedData.ip != ip) {
          await handleLogout(callbackUrl, "Your ip address has changed. Please log in again.", true);
        } else {
          await handleToken(decryptedData.token, ip, callbackUrl, false);
        }
      }

      setLoading(false);
    }

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 180000);

    return () => clearInterval(interval);
  }, [router, toast, loadingIp]);

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

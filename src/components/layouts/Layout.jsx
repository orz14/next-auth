import jwt from "jsonwebtoken";
import { deleteCookie, getCookie } from "@/lib/cookie";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { differenceInMinutes, isBefore } from "date-fns";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Layout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    function checkTokenExpiration() {
      const token = getCookie("token");

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
          router.push("/auth/login");
        } else {
          setLoading(false);
        }
      } else {
        toast({
          variant: "destructive",
          description: "Your session has expired. Please log in again.",
        });

        router.push("/auth/login");
      }
    }

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 180000);

    return () => clearInterval(interval);
  }, [router, toast]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full min-h-screen">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Please wait
        </div>
      ) : (
        <main className="flex flex-col items-center justify-center w-full min-h-screen">
          <section className="my-10">{children}</section>
        </main>
      )}
    </>
  );
}

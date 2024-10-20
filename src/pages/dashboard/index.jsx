import Layout from "@/components/layouts/Layout";
import Meta from "@/components/Meta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import useAuth from "@/configs/api/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import useAxiosInterceptors from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { user, logout: logoutAuth } = useAuthContext();
  const axiosInstance = useAxiosInterceptors();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const res = await logout();

      if (res.status === 200) {
        await axiosInstance.post("/api/logout");

        logoutAuth();
        router.push("/auth/login");
      }
    } catch (err) {
      console.log("🚀 ~ handleLogout ~ err:", err);

      if (err.status === 400) {
        console.error("🚀 ~ Logout error:", err.response.data);
      }

      setLoading(false);
    }
  };

  return (
    <>
      <Meta title="Dashboard Page" />

      <Layout>
        <Card className="w-full max-w-[500px] bg-background border-zinc-900">
          <CardContent>
            <Table className="mt-6 text-zinc-300">
              <TableBody>
                <TableRow className="border-none hover:bg-zinc-900">
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>&nbsp;:&nbsp;</TableCell>
                  <TableCell>{user?.name}</TableCell>
                </TableRow>
                <TableRow className="border-none hover:bg-zinc-900">
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>&nbsp;:&nbsp;</TableCell>
                  <TableCell>{user?.email}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={handleLogout} variant="outline" className="w-full text-zinc-300 border-zinc-900" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait
                </>
              ) : (
                "Logout"
              )}
            </Button>
          </CardFooter>
        </Card>
      </Layout>
    </>
  );
}

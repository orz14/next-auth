import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Meta from "@/components/Meta";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { setCookie } from "@/lib/cookie";
import useAuth from "@/configs/api/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import Layout from "@/components/layouts/Layout";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { login: setAuth } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    validateOnMount: true,
    onSubmit: async (credentials) => {
      setLoading(true);
      await login(credentials)
        .then((res) => {
          if (res.status === 200) {
            setCookie("token", res.data.accessToken, {
              path: "/",
              secure: true,
              sameSite: "Strict",
            });

            const userData = {
              id: res.data.data.id,
              name: res.data.data.name,
              email: res.data.data.email,
              permissions: [],
            };

            setAuth(userData);

            router.push("/dashboard");
          }
        })
        .catch((err) => {
          console.log("err:", err);
          if (err.status === 403 || err.status === 404) {
            setError("Invalid credentials");
            setLoading(false);
          }
        });
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;
  console.log("errors:", errors);

  return (
    <>
      <Meta title="Login Page" />

      <Layout>
        {error && <div className="w-[500px] bg-background border border-zinc-900 rounded-lg p-4 text-sm text-red-700 text-center mb-2">{error}</div>}

        <Card className="w-[500px] bg-background border-zinc-900">
          <CardHeader>
            <CardTitle className="text-zinc-300">Login</CardTitle>
            <CardDescription>Login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="loginForm" onSubmit={handleSubmit} className="grid items-center w-full gap-4" autoComplete="off">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="example@mail.com"
                  className="transition-colors duration-200 border-zinc-900 text-zinc-300 placeholder:text-muted-foreground focus:border-zinc-300"
                />
                {errors.email && touched.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="********"
                  className="transition-colors duration-200 border-zinc-900 text-zinc-300 placeholder:text-muted-foreground focus:border-zinc-300"
                />
                {errors.password && touched.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="outline" className="w-full text-zinc-300 border-zinc-900" form="loginForm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="p-4 text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={"/auth/register"} className="text-primary-foreground underline-offset-4 hover:underline">
            Register
          </Link>
        </div>
      </Layout>
    </>
  );
}

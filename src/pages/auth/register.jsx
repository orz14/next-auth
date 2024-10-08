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
import useAuth from "@/configs/api/auth";
import Layout from "@/components/layouts/Layout";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    validateOnMount: true,
    onSubmit: async (credentials) => {
      setLoading(true);
      await register(credentials)
        .then((res) => {
          if (res.status === 201) {
            router.push("/auth/login");
          }
        })
        .catch((err) => {
          console.log("err:", err);
          if (err.status === 409) {
            setError(err.response.data.message);
            setLoading(false);
          }
        });
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;
  console.log("errors:", errors);

  return (
    <>
      <Meta title="Register Page" />

      <Layout>
        {error && <div className="w-full max-w-[500px] bg-background border border-zinc-900 rounded-lg p-4 text-sm text-red-700 text-center mb-2">{error}</div>}

        <Card className="w-full max-w-[500px] bg-background border-zinc-900">
          <CardHeader>
            <CardTitle className="text-zinc-300">Register</CardTitle>
            <CardDescription>Fill the form to register.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="registerForm" onSubmit={handleSubmit} className="grid items-center w-full gap-4" autoComplete="off">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-zinc-300">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="John Doe"
                  className="transition-colors duration-200 border-zinc-900 text-zinc-300 placeholder:text-muted-foreground focus:border-zinc-300"
                />
                {errors.name && touched.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
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
            <Button type="submit" variant="outline" className="w-full text-zinc-300 border-zinc-900" form="registerForm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait
                </>
              ) : (
                "Register"
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="p-4 text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href={"/auth/login"} className="text-primary-foreground underline-offset-4 hover:underline">
            Login
          </Link>
        </div>
      </Layout>
    </>
  );
}

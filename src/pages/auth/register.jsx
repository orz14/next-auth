import Layout from "@/components/layouts/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Meta from "@/components/Meta";

export default function RegisterPage() {
  return (
    <>
      <Meta title="Register Page" />

      <Layout>
        <Card className="w-[500px] bg-background border-zinc-900">
          <CardHeader>
            <CardTitle className="text-zinc-300">Register</CardTitle>
            <CardDescription>Fill the form to register.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="registerForm" className="grid items-center w-full gap-4" autoComplete="off">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input type="email" id="email" placeholder="example@mail.com" className="transition-colors duration-200 border-zinc-900 text-zinc-300 placeholder:text-muted-foreground focus:border-zinc-300" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input type="password" id="password" placeholder="********" className="transition-colors duration-200 border-zinc-900 text-zinc-300 placeholder:text-muted-foreground focus:border-zinc-300" />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="outline" className="w-full text-zinc-300 border-zinc-900" form="registerForm">
              Register
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
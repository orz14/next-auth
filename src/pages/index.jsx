import Layout from "@/components/layouts/Layout";
import Meta from "@/components/Meta";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Meta title="Next.js" />

      <Layout>
        <div className="space-x-2">
          <Button variant="outline" className="text-zinc-300 border-zinc-900" asChild>
            <Link href={"/auth/login"}>Login</Link>
          </Button>
          <Button variant="outline" className="text-zinc-300 border-zinc-900" asChild>
            <Link href={"/auth/register"}>Register</Link>
          </Button>
        </div>
      </Layout>
    </>
  );
}

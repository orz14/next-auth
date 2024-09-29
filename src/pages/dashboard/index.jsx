import Layout from "@/components/layouts/Layout";
import Meta from "@/components/Meta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardPage() {
  return (
    <>
      <Meta title="Dashboard Page" />

      <Layout>
        <Card className="w-[500px] bg-background border-zinc-900">
          <CardContent>
            <Table className="mt-6 text-zinc-300">
              <TableBody>
                <TableRow className="border-none hover:bg-zinc-900">
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>&nbsp;:&nbsp;</TableCell>
                  <TableCell>John Doe</TableCell>
                </TableRow>
                <TableRow className="border-none hover:bg-zinc-900">
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>&nbsp;:&nbsp;</TableCell>
                  <TableCell>example@mail.com</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button type="button" variant="outline" className="w-full text-zinc-300 border-zinc-900">
              Logout
            </Button>
          </CardFooter>
        </Card>
      </Layout>
    </>
  );
}

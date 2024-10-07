import { Toaster } from "../ui/toaster";

export default function Layout({ children }) {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full min-h-screen px-5 py-10">{children}</main>
      <Toaster />
    </>
  );
}

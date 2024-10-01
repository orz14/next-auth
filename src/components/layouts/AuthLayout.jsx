import { Toaster } from "../ui/toaster";

export default function AuthLayout({ children }) {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen">
      <section className="my-10">{children}</section>
      <Toaster />
    </main>
  );
}

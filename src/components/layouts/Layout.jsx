export default function Layout({ children }) {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen">
      <section className="my-10">{children}</section>
    </main>
  );
}

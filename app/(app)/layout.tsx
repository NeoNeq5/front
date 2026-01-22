// app/(app)/layout.tsx
import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col p-10 px-20 bg-[#F1EFF8]">
      <Header />
      <Navbar />
      {children}
    </div>
  );
}

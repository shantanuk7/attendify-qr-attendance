import Navbar from "@/components/admin/Navbar";
import SidebarAdmin from "@/components/admin/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row">
      <SidebarProvider>
        <SidebarAdmin />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

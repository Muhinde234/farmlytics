import { ReactNode } from 'react';
import AppSidebar from "@/components/common/app-side-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/userContext"; 

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider> 
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <SidebarTrigger />
          <main className="px-6 w-full min-h-screen bg-white">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}

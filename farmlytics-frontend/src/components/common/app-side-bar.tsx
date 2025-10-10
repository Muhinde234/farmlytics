'use client';

import { usePathname, useRouter } from 'next/navigation';
import { bottomNavItems, navItems } from './constant';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Logo from '@/components/common/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {Button} from "@/components/ui/button";
import {LogOutIcon} from "lucide-react";
import {useUser} from "@/context/userContext";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {logout} = useUser();
  const t = useTranslations("dashboard");


  const handleLogout = () => {
    logout();
    router.push("/");
  }

  return (
    <Sidebar className="bg-white ">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <Link href="/" className="flex items-center ">
           
              <Logo />
              <p >Farmlytics</p>
            </Link>
          </SidebarHeader>

          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild size="lg" className={cn(
                    'text-md justify-start hover:bg-white/10',
                    isActive && 'bg-white/10'
                  )}>
                    <Link href={item.path}>
                      <item.icon size={20} />
                      <span>{t(item.label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto border-t border-white/10 pt-2">
          <SidebarMenu>
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild size="lg" className={cn(
                    'text-md justify-start hover:bg-white/10',
                    isActive && 'bg-white/10'
                  )}>
                    <Link href={item.path}>
                      <item.icon size={20} />
                      <span>{t(item.label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem>
              <SidebarMenuButton
                  size="lg"
                  className="text-md justify-start hover:bg-white/10"
                  asChild
              >
                <Button
                    variant="ghost"
                    className="w-full justify-start  hover:bg-white/10"
                    onClick={handleLogout}
                >
                  <LogOutIcon size={20} />
                  <span>{t("sidebar.logout")}</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
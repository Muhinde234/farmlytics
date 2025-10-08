import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Bug,
  Bell,
  Wheat,
  Settings,
} from "lucide-react";

export type UserRole = 'admin' | 'manager' | 'user';

export interface NavItem {
  path: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  allowedRoles?: UserRole[];
}

export const navItems: NavItem[] = [
  { path: "/admin", icon: LayoutDashboard, label: "sidebar.dashboard" },
  { path: "/admin/crop-plans", icon: Sprout, label: "sidebar.crop-planner" },
  { path: "/admin/market-connection", icon: ShoppingBag, label: "sidebar.market" },
  { path: "/admin/diseases", icon: Bug, label: "sidebar.diseases" },
  { path: "/admin/notification", icon: Bell, label: "sidebar.notification" },
  { path: "/admin/harvest-tracker", icon: Wheat, label: "sidebar.harvest" },
];

export const bottomNavItems: NavItem[] = [
  { path: "/admin/settings", icon: Settings, label: "sidebar.settings" },
];

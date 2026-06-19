"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  TrendingUp,
  MessageSquare,
  ShoppingBag,
  User,
  Settings,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/meal-plan", icon: UtensilsCrossed, label: "Meal Plan" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
  { href: "/chat", icon: MessageSquare, label: "AI Assistant" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">NutriAI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-green-50 text-green-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

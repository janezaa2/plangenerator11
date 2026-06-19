import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, Package, BarChart3, Settings, Leaf } from "lucide-react";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") redirect("/dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Admin</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {adminNav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}

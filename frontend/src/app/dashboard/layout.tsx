"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Building2, ShoppingBag, Users, Handshake, LogOut, UserCheck } from "lucide-react";
import { getAccessToken, getCurrentUser, logout, StaffUser } from "@/lib/auth";

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard, roles: ["owner"] },
  { href: "/dashboard/listings", label: "Listings", icon: Building2, roles: ["owner", "content_manager"] },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag, roles: ["owner", "content_manager"] },
  { href: "/dashboard/roommates", label: "Roommates", icon: UserCheck, roles: ["owner", "content_manager"] },
  { href: "/dashboard/transactions", label: "Transactions", icon: Handshake, roles: ["owner", "support_sales"] },
  { href: "/dashboard/staff", label: "Staff", icon: Users, roles: ["owner"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/dashboard/login") {
      setIsChecking(false);
      return;
    }
    const token = getAccessToken();
    const currentUser = getCurrentUser();
    if (!token || !currentUser) {
      router.push("/dashboard/login");
      return;
    }
    setUser(currentUser);
    setIsChecking(false);
  }, [pathname, router]);

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center text-foreground-muted text-sm">Loading...</div>;
  }

  if (!user) return null; // redirect already triggered

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  function handleLogout() {
    logout();
    router.push("/dashboard/login");
  }

  return (
    <div className="min-h-screen flex bg-surface-muted">
      <aside className="w-56 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <p className="font-medium text-sm">Kampurse</p>
          <p className="text-xs text-foreground-muted">{user.full_name}</p>
          <p className="text-xs text-kampurse-green-dark capitalize">{user.role.replace("_", " ")}</p>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-kampurse-green-light text-kampurse-green-dark"
                    : "text-foreground-muted hover:bg-surface-muted"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 m-2 rounded-md text-sm text-foreground-muted hover:bg-surface-muted transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
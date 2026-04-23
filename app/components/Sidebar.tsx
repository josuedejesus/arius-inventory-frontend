"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import {
  MdMenu,
  MdDashboard,
  MdPeople,
  MdWork,
  MdTask,
  MdStraighten,
  MdAssignmentTurnedIn,
  MdPayments,
  MdManageAccounts,
  MdPlace,
  MdInventory2,
  MdSwapHoriz,
  MdSettings,
  MdLogout,
  MdHome,
} from "react-icons/md";
import { useCan } from "../lib/auth/useCan";
import { hasPermission, PERMISSIONS } from "../lib/auth/permissions";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

const links = [
  // Core
  { label: "Inicio", href: "/dashboard", icon: MdDashboard, permission: PERMISSIONS.VIEW_DASHBOARD },
  { label: "Inicio", href: "/home", icon: MdHome, permission: PERMISSIONS.VIEW_HOME },
  { label: "Personas", href: "/dashboard/persons", icon: MdPeople, permission: PERMISSIONS.VIEW_USERS },

  { label: "Ubicaciones", href: "/dashboard/locations", icon: MdPlace, permission: PERMISSIONS.VIEW_LOCATIONS },
  { label: "Articulos", href: "/dashboard/items", icon: MdInventory2, permission: PERMISSIONS.VIEW_ITEMS },

  // Catálogos
  { label: "Unidades", href: "/dashboard/units", icon: MdStraighten, permission: PERMISSIONS.VIEW_UNITS },

  // Operación
  {
    label: "Requisiciones",
    href: "/dashboard/requisitions",
    icon: MdSwapHoriz,
    permission: PERMISSIONS.VIEW_REQUISITIONS,
  },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const { logout, user } = useAuth();

  const filteredLinks = links.filter((l) => hasPermission(user!, l.permission));

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static inset-y-0 left-0 z-50 bg-gray-900 text-gray-100 flex flex-col transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          {/* Collapse SOLO desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden pl-2 md:block text-gray-400 hover:text-white"
          >
            <MdMenu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {filteredLinks.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;

            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose} // 👈 cerrar en mobile
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded transition",
                  active
                    ? "bg-gray-800 text-white font-medium"
                    : "text-gray-300 hover:bg-gray-800",
                )}
              >
                <Icon size={20} />
                {!collapsed && <span>{l.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 px-2 py-3 space-y-1">
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded text-gray-300 hover:bg-red-900/40 hover:text-red-400 transition"
          >
            <MdLogout size={20} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";
import { ReactNode, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Toaster } from "sonner";
import AuthGuard from "../components/AuthGuard";



export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar onMenuClick={() => setMobileOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4">
            {children}
            <Toaster position="top-right" richColors />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

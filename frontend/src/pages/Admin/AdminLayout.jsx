import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Wallet,
  Bell,
  BarChart3,
  Building2,
} from "lucide-react";

const adminNavItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Admissions", to: "/admin/admissions", icon: ClipboardList },
  { label: "Students", to: "/admin/students", icon: Users },
  { label: "Fees", to: "/admin/fees", icon: Wallet },
  { label: "Branches", to: "/admin/branches", icon: Building2 },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout() {
  return (
    <div className="space-y-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================== Top Navigation ================== */}
      <section className="rounded-2xl bg-white/90 p-4 shadow-[0_8px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl border border-gray-100/50 transition">
        <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto md:justify-start">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "bg-[#2563eb] text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] scale-[1.02]"
                      : "bg-[#2563eb] text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] hover:bg-[#1e40af] hover:shadow-[0_12px_36px_rgba(37,99,235,0.35)] hover:scale-105",
                  ].join(" ")
                }
              >
                <Icon
                  className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </section>

      {/* ================== Page Content ================== */}
      <main className="animate-fade-in-up">
        <Outlet />
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Layers, User, Sun } from "lucide-react";
import CreateOutfitSheet from "@/components/shared/CreateOutfitSheet";

// Navigation Items Configuration
const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Search", icon: Search, href: "/search" },
    { label: "Add", icon: PlusSquare, href: "/upload", isSpecial: true },
    { label: "Collections", icon: Layers, href: "/collections" },
    { label: "Profile", icon: User, href: "/profile" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-white text-black flex flex-col md:flex-row">

            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside className="hidden md:flex flex-col w-64 border-r border-gray-100 h-screen sticky top-0 p-6">
                {/* Logo Area */}
                <div className="mb-10 pl-2">
                    <h1 className="text-2xl font-bold tracking-tighter">Closet AI.</h1>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 flex flex-col gap-2">
                    {NAV_ITEMS.map((item) => {
                        if (item.label === "Add") {
                            return (
                                <CreateOutfitSheet key="add-desktop" />
                            );
                        }

                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
                  ${isActive ? "bg-black text-white font-medium" : "hover:bg-gray-50 text-gray-600"}
                `}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-1.5"}`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Weather "Pill" at bottom of sidebar */}
                <div className="mt-auto p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                        <Sun className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Sahibzada Ajit Singh Nagar</p>
                        <p className="text-sm font-bold">28°C, Clear</p>
                    </div>
                </div>
            </aside>

            {/* ================= MOBILE TOP HEADER ================= */}
            <header className="md:hidden flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <span className="font-bold text-xl tracking-tight">Closet AI.</span>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Sun className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-semibold">28°C</span>
                </div>
            </header>

            {/* ================= MAIN CONTENT AREA ================= */}
            <main className="flex-1 w-full max-w-4xl mx-auto md:p-8 pb-24 md:pb-8">
                {children}
            </main>

            {/* ================= MOBILE BOTTOM NAV ================= */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe z-50">
                {NAV_ITEMS.map((item) => {
                    if (item.label === "Add") {
                        return (
                            <CreateOutfitSheet
                                key="add-mobile"
                                isMobile={true}
                                triggerIconClass="w-7 h-7 text-black stroke-2" // Bigger icon for mobile center
                            />
                        );
                    }

                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2">
                            <item.icon
                                className={`w-6 h-6 transition-all ${isActive ? "text-black fill-black" : "text-gray-400 stroke-[1.5px]"
                                    } ${item.isSpecial ? "w-7 h-7" : ""}`}
                            />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

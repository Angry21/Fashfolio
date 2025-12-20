"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, Cpu, User } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) =>
        pathname === path
            ? "bg-black text-white shadow-md"
            : "text-gray-500 hover:bg-gray-100 hover:text-black";

    return (
        <nav className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-40 transition-all">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative w-32 h-10">
                    <Image
                        src="/logo.jpeg"
                        alt="FashFolio Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </Link>

            {/* The "Pill" Navigation */}
            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                <Link
                    href="/"
                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-medium text-sm ${isActive(
                        "/"
                    )}`}
                >
                    <LayoutGrid size={16} /> Studio
                </Link>
                <Link
                    href="/hq"
                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-medium text-sm ${isActive(
                        "/hq"
                    )}`}
                >
                    <Cpu size={16} /> HQ
                </Link>
            </div>

            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border hover:border-black cursor-pointer transition">
                <User size={20} />
            </div>
        </nav>
    );
}

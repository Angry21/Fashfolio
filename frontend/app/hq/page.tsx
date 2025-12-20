"use client";

import SeynaDashboard from "@/components/SeynaDashboard";
import Image from "next/image";

export default function HQPage() {
    return (
        <div className="relative min-h-[calc(100vh-80px)] text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/background.jpeg"
                    alt="HQ Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 pt-8">
                <SeynaDashboard />
            </div>
        </div>
    );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import SeynaDashboard from "@/components/SeynaDashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome to Fashfolio</h1>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>

      <div className="w-full">
        <SeynaDashboard />
      </div>
    </div>
  );
}

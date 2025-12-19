import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";

const Navbar = () => {
    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-2 flex-center">
                <p className="logo-text">Fashfolio</p>
            </Link>
            <div className="flex gap-4">
                <SignedIn>
                    <div className="flex gap-4 items-center mr-4 font-medium text-dark-600">
                        <Link href="/dashboard">Items</Link>
                        <Link href="/collections">Looks</Link>
                        <Link href="/upload" className="text-purple-600 font-semibold">+ Add</Link>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                    <Button asChild className="button bg-purple-gradient bg-cover">
                        <Link href="/sign-in">Login</Link>
                    </Button>
                </SignedOut>
            </div>
        </nav>
    );
};
export default Navbar;

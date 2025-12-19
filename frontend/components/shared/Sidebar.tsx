import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="flex size-full flex-col gap-4">
                <Link href="/" className="sidebar-logo">
                    <span className="text-2xl font-bold">Fashfolio</span>
                </Link>
                <nav className="sidebar-nav">
                    <ul className="sidebar-nav_elements">
                        {/* Links will go here */}
                        <li><Link href="/dashboard">Dashboard</Link></li>
                        <li><Link href="/upload">Upload</Link></li>
                        <li><Link href="/gallery">Gallery</Link></li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};
export default Sidebar;

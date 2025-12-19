import { auth } from "@clerk/nextjs/server";
import OutfitForm from "@/components/forms/OutfitForm";
import Link from "next/link";

const UploadPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return (
            <div className="wrapper flex-center flex-col min-h-[60vh] text-center gap-6">
                <div className="bg-purple-100 p-6 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="h2-bold text-dark-600">Upload Your Style</h2>
                <p className="p-16-regular text-gray-500 max-w-md">
                    Guests can view the gallery, but you need to sign in to upload your own outfits and use the AI Stylist.
                </p>
                <Link href="/sign-in" className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition">
                    Sign In to Upload
                </Link>
            </div>
        );
    }

    return (
        <div className="wrapper">
            <h1 className="h1-bold text-dark-600 mb-8">Add New Outfit</h1>
            <OutfitForm userId={userId} />
        </div>
    );
};
export default UploadPage;

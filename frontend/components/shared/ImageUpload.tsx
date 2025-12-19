"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";

interface ImageUploadProps {
    value: string;
    onChange: (value: string, publicId?: string) => void;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = useCallback((result: any) => {
        // Cloudinary returns the secure_url in info
        onChange(result.info.secure_url, result.info.public_id);
    }, [onChange]);

    return (
        <div className="mb-4 flex items-center justify-center w-full">
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{
                    maxFiles: 1,
                    resourceType: "image"
                }}
            >
                {({ open }) => {
                    return (
                        <div
                            onClick={() => disabled ? null : open?.()}
                            className={`relative cursor-pointer hover:opacity-70 transition border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center gap-4 text-gray-500 w-full h-64 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {value ? (
                                <div className="absolute inset-0 w-full h-full">
                                    <Image
                                        fill
                                        style={{ objectFit: "contain" }}
                                        src={value}
                                        alt="Outfit Upload"
                                    />
                                </div>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <p className="text-sm font-semibold">Click to Upload Outfit</p>
                                </>
                            )}
                        </div>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;

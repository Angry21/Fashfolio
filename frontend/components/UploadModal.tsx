import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface UploadModalProps {
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    form: any;
    setForm: (form: any) => void;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    loading: boolean;
}

export const UploadModal = ({ onClose, onSubmit, form, setForm, imageFile, setImageFile, loading }: UploadModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold">✕</button>
                <h2 className="text-xl font-bold mb-6">Upload New Design</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <input
                        placeholder="Title (e.g., Summer Dress)"
                        className="p-3 rounded-xl border"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                    <div className="flex gap-4">
                        <input
                            placeholder="Designer"
                            className="p-3 rounded-xl border flex-1"
                            value={form.designer}
                            onChange={e => setForm({ ...form, designer: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="p-3 rounded-xl border w-32"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                        />
                    </div>
                    <select
                        className="p-3 rounded-xl border"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                        <option>Streetwear</option>
                        <option>Vintage</option>
                        <option>Haute Couture</option>
                        <option>Techwear</option>
                    </select>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="p-3 bg-white rounded-xl border"
                    />
                    <button disabled={loading} className="bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Launch Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

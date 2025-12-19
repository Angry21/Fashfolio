"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const FilterBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Helper to update URL params
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== 'all') {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (key: string, value: string) => {
        router.push(`/dashboard?${createQueryString(key, value)}`, { scroll: false });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex flex-col gap-2 w-full sm:w-1/3">
                <label className="text-sm font-medium text-gray-700">Season</label>
                <select
                    className="p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                    onChange={(e) => handleFilterChange('season', e.target.value)}
                    defaultValue={searchParams.get('season') || 'all'}
                >
                    <option value="all">All Seasons</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                </select>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-1/3">
                <label className="text-sm font-medium text-gray-700">Mood</label>
                {/* For now, text input as mood is freeform in form. Can change to select if standardized. */}
                <input
                    type="text"
                    placeholder="Search mood..."
                    className="p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                    onChange={(e) => {
                        // Debounce could be added here
                        handleFilterChange('mood', e.target.value);
                    }}
                    defaultValue={searchParams.get('mood') || ''}
                />
            </div>
        </div>
    );
};

export default FilterBar;

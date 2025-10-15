'use client'
import { ItemType } from "@/types/type";
import CartItem from "./cardItem";
import FilterCategoryAndSort from "./filter_sort";
import { useItems } from "@/hooks/useHookItem";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { useSearch } from "../context/search.context";
const SkeletonCard = () => (
    <div className="border rounded-lg p-4 shadow-sm space-y-3">
        <Skeleton className="h-48 w-full rounded-md" />
        <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            <Skeleton className="h-8 w-1/4" />
        </div>
    </div>
);

const ProductsPage = () => {
    const { data, isLoading, isError } = useItems();
    const { listItem } = useSearch();
    const [sort, setSelectedSort] = useState<string | null>(null);
    const [category, setSelectedCategory] = useState<string | null>(null);

    const isSearchActive = listItem && listItem.length > 0;

    // Reset filter khi có search active
    useEffect(() => {
        if (isSearchActive) {
            setSelectedCategory(null);
            setSelectedSort(null);
        }
    }, [isSearchActive]);


    // lọc theo category 
    const filteredAndSortedItems = useMemo(() => {
        if (isSearchActive) {
            let items = [...listItem];

            // Áp dụng thêm filter category nếu cần
            if (category && category !== 'all') {
                items = items.filter((item: ItemType) => item.category === category);
            }

            // Áp dụng sort nếu cần
            if (sort) {
                if (sort === 'a-z') {
                    items = items.sort((a: ItemType, b: ItemType) =>
                        a.title.localeCompare(b.title)
                    );
                } else if (sort === 'z-a') {
                    items = items.sort((a: ItemType, b: ItemType) =>
                        b.title.localeCompare(a.title)
                    );
                } else if (sort === 'latest') {
                    items = items.sort((a: ItemType, b: ItemType) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                } else if (sort === 'oldest') {
                    items = items.sort((a: ItemType, b: ItemType) =>
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    );
                } else if (sort === 'trending') {
                    items = items.sort((a: ItemType, b: ItemType) =>
                        b.likes - a.likes
                    );
                }
            }

            return items;
        }

        // Logic cho data bình thường (không search)
        if (!data || data.length === 0) return [];

        let items = [...data];

        // Filter by category
        if (category && category !== 'all') {
            items = items.filter((item: ItemType) => item.category === category);
        }

        // Sort
        if (sort) {
            if (sort === 'a-z') {
                items = items.sort((a: ItemType, b: ItemType) =>
                    a.title.localeCompare(b.title)
                );
            } else if (sort === 'z-a') {
                items = items.sort((a: ItemType, b: ItemType) =>
                    b.title.localeCompare(a.title)
                );
            } else if (sort === 'latest') {
                items = items.sort((a: ItemType, b: ItemType) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
            } else if (sort === 'oldest') {
                items = items.sort((a: ItemType, b: ItemType) =>
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
            } else if (sort === 'trending') {
                items = items.sort((a: ItemType, b: ItemType) =>
                    b.likes - a.likes
                );
            }
        }

        return items;
    }, [sort, category, data]);

    const categories = useMemo<string[]>(() => {
        if (!data || data.length === 0) {
            return [];
        }
        const allCategories = data.map((item: ItemType) => item.category);
        const uniqueCategoriesSet = new Set(allCategories);
        const uniqueCategoriesArray = Array.from(uniqueCategoriesSet);
        return uniqueCategoriesArray as string[]
    }, [data]);

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value === 'all' ? null : value);
    };

    const handleSortChange = (value: string) => {
        setSelectedSort(value);
    };

    const displayItems = listItem && listItem.length > 0 ? listItem : filteredAndSortedItems;


    return (
        <>
            <FilterCategoryAndSort categories={categories} onCategoryChange={(value) => handleCategoryChange(value)} onSortChange={(value) => handleSortChange(value)} totalItems={filteredAndSortedItems.length} />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-[5%] md:mx-[10%]">
                {/* Skeleton loading */}
                {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                }
                {/* Error state */}
                {isError && (
                    <div className="col-span-full flex justify-center py-10">
                        <Alert variant="destructive" className="max-w-md">
                            <AlertCircle className="h-5 w-5" />
                            <AlertTitle>Error loading items</AlertTitle>
                            <AlertDescription>
                                Something went wrong while fetching the items. Please try again later.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                {/* Empty state */}
                {!isLoading && !isError && displayItems.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500 font-medium">
                        No items found.
                    </div>
                )}
                {/* Loaded data */}
                {!isLoading && !isError && displayItems.map((item: ItemType) => (
                    <Link className="cursor-pointer" key={item.id} href={`/items/${item.id}`}>
                        <CartItem item={item} />
                    </Link>
                ))}
            </div>
        </>
    )
}

export default ProductsPage;
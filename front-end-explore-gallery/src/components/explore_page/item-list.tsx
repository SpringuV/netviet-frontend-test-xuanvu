// components/ItemList.tsx
'use client'

import { useEffect, useRef } from "react";
import ItemCardWithLike from "./item-cart-with-like";
import { Skeleton } from "../ui/skeleton";
import { useInfiniteItems } from "@/hooks/useHookItem";
import { ItemType } from "@/types/type";
import { PAGE_SIZE } from "@/constant";

interface Props {
    category?: string | null;
    sort?: string | null;
}

const ItemList = ({ category, sort }: Props) => {
    const { items, setSize, hasMore, size, isLoading, isError } = useInfiniteItems(category, sort);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = loaderRef.current;
        if (!target || !hasMore) return;

        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry.isIntersecting && !isLoading && hasMore) {
                    setSize(size + 1);
                }
            },
            { rootMargin: "300px", threshold: 0.5 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMore, isLoading, size, setSize]);

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

    if (isError) return <div className="text-center text-red-500">Failed to load items.</div>;

    if (!items.length && isLoading)
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );

    if (!items.length) return <div className="text-center text-gray-500 py-10">No items found.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item: ItemType) => (
                <ItemCardWithLike key={item.id} item={item} />
            ))}

            {/* Loader */}
            {hasMore && (
                <div ref={loaderRef} className="col-span-full h-20 flex items-center justify-center">
                    {isLoading && <span className="text-gray-400">Loading more items...</span>}
                </div>
            )}
        </div>
    );
};

export default ItemList;

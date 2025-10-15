'use client'

import { useInfiniteItems } from "@/hooks/useHookItem"
import { ItemType } from "@/types/type"
import Link from "next/link"
import { useEffect, useRef } from "react"
import CartItem from "./cardItem"
import { Skeleton } from "../ui/skeleton"

const ItemList = ({ category, sort }: { category?: string | null; sort?: string | null }) => {
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
    const { items, setSize, hasMore, size, isLoading, isError, mutate } = useInfiniteItems(category, sort)
    const loaderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const target = loaderRef.current
        if (!target || !hasMore || isLoading) return
        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0]
                if (entry.isIntersecting && hasMore) {
                    console.log("Observer triggered!");
                    setSize(size + 1) // gọi page kế tiếp
                }
            },
            { rootMargin: "300px", threshold: 0.5 }
        )
        observer.observe(target)

        // cleanup
        return () => {
            observer.disconnect() // disconnect đủ, không cần unobserve riêng lẻ
        }
    }, [hasMore, setSize, isLoading])

    if (isLoading && size === 1) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
        )
    }

    if (isError) {
        return <div className="text-center text-red-500">Failed to load items.</div>
    }

    if (!items?.length) {
        return <div className="text-center text-gray-500 py-10">No items found.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            {items.map((item: ItemType) => (
                <Link key={item.id} href={`/items/${item.id}`} className="cursor-pointer">
                    <CartItem item={item} />
                </Link>
            ))}

            {hasMore && (
                <div ref={loaderRef} className="col-span-full h-20 flex items-center justify-center">
                    {isLoading && (
                        <span className="text-gray-400">Loading more items...</span>
                    )}
                </div>
            )}
        </div>
    )
}

export default ItemList
'use client'
import { ItemType } from "@/types/type";
import CartItem from "./cardItem";
import FilterCategoryAndSort from "./filter_sort";
import { useItems } from "@/hooks/useHookItem";
import Link from "next/link";
import { useMemo, useState } from "react";

const ProductsPage = () => {
    const { data, isLoading, isError } = useItems();
    const [sort, setSelectedSort] = useState<string | null>(null);
    const [category, setSelectedCategory] = useState<string | null>(null);

    // lọc theo category 
    const filteredAndSortedItems = useMemo(() => {
        if (!data || data.length === 0) return [];
        let items = [...data];
        // Filter by category
        if (category && category !== 'all') {
            items = items.filter((item: ItemType) => item.category === category);
        }
        // sort
        if (sort) {
            if (sort === 'a-z') items = items.sort((a: ItemType, b: ItemType) => a.title.localeCompare(b.title))
            else if (sort === 'z-a') items = items.sort((a: ItemType, b: ItemType) => b.title.localeCompare(a.title))
            else if (sort === 'latest') items = items.sort((a: ItemType, b: ItemType) => b.id - a.id)
            else if (sort === 'trending') items = items.sort((a: ItemType, b: ItemType) => b.likes - a.likes)
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

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (isError) return <div className="text-center py-10">Error loading items</div>;
    if (!data || data.length === 0) return <div className="text-center py-10">No items found</div>;

    return (
        <>
            <FilterCategoryAndSort categories={categories} onCategoryChange={(value) => handleCategoryChange(value)} onSortChange={(value) => handleSortChange(value)} totalItems={filteredAndSortedItems.length} />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-[5%] md:mx-[10%]">
                {filteredAndSortedItems.map((item: ItemType) => (
                    <Link className="cursor-pointer" key={item.id} href={`/items/${item.id}`}>
                        <CartItem item={item} />
                    </Link>
                ))}
            </div>
        </>
    )
}

export default ProductsPage;
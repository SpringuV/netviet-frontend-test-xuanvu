'use client'
import FilterCategoryAndSort from "./filter_sort";
import { useFilter } from "../context/filter.context";
import ItemList from "./item-list";
import { useState } from "react";


const ProductsPage = () => {
    const { showFilter } = useFilter()
    const [sort, setSort] = useState<string | null>(null)
    const [category, setCategory] = useState<string | null>(null)

    return (
        <>
            {showFilter && (
                <FilterCategoryAndSort
                    onCategoryChange={v => setCategory(v === 'all' ? null : v)}
                    onSortChange={v => setSort(v)}
                />
            )}

            <div className="p-6 mx-[5%] md:mx-[10%]">
                <ItemList category={category} sort={sort} />
            </div>
        </>
    )
}

export default ProductsPage;
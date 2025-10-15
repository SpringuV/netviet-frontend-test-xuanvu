'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type PropsType = {
    categories: string[],
    onCategoryChange?: (category: string) => void,
    onSortChange?: (sort: string) => void,
    totalItems?: number,
}

const FilterCategoryAndSort = (props: PropsType) => {
    const { categories = [], onCategoryChange, onSortChange, totalItems = 0 } = props;
    return (
        <div className="fixed bg-white z-100 flex w-full justify-center items-center flex-col lg:flex-row gap-2 border-y-[1px] p-2 md:p-3">
            <div className="flex items-center justify-center  gap-2 md:gap-3">
                <label className="w-[20vw] text-left md:w-[12vw] lg:w-[7vw] lg:text-right font-light text-base md:text-lg">FILTER BY</label>
                <Select onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-center gap-2 md:gap-3">
                <label className="w-[20vw] md:w-[12vw] lg:w-[7vw] text-left lg:text-right font-light text-base md:text-lg">SORT BY</label>
                <Select onValueChange={onSortChange}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="a-z">A - Z</SelectItem>
                        <SelectItem value="z-a">Z - A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-center items-center font-light italic">Total {totalItems} products</div>
        </div>
    )
}

export default FilterCategoryAndSort;
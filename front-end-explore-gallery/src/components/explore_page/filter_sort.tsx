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
        <div className="flex w-full justify-center items-center  border-y-[1px] p-3">
            <div className="flex w-3/4 justify-between">
                <div className="w-4/5 gap-3 flex">
                    <div className="flex items-center gap-3">
                        <label className="font-light">FILTER BY</label>
                        <Select onValueChange={onCategoryChange}>
                            <SelectTrigger className="w-[180px]">
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
                    <div className="flex items-center gap-3">
                        <label className="font-light">SORT BY</label>
                        <Select onValueChange={onSortChange}>
                            <SelectTrigger className="w-[200px]">
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
                </div>
                <div className="flex justify-center items-center font-light italic">{totalItems} products</div>
            </div>
        </div>
    )
}

export default FilterCategoryAndSort;
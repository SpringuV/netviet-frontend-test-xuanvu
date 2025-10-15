'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type PropsType = {
    onCategoryChange?: (category: string) => void,
    onSortChange?: (sort: string) => void,
}
const categories = [
    { id: "1", name: "Nature" },
    { id: "2", name: "Architecture" },
    { id: "3", name: "Travel" },
    { id: "4", name: "Objects" },
    { id: "5", name: "People" },
    { id: "6", name: "Vehicles" },
    { id: "7", name: "Art" },
    { id: "8", name: "Animals" },
];
const FilterCategoryAndSort = (props: PropsType) => {
    const { onCategoryChange, onSortChange} = props;
    return (
        <div className="fixed left-0 top-[60px] md:top-[68px] lg:top-[80px] bg-white z-100 flex w-full justify-center items-center flex-col lg:flex-row gap-2 border-y-[1px] py-2 md:py-3">
            <div className="flex items-center justify-center  gap-2 md:gap-3">
                <label className="w-[20vw] text-left md:w-[12vw] lg:w-[7vw] lg:text-right font-light text-base md:text-lg">FILTER BY</label>
                <Select onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="z-[1004]">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                            </SelectItem>
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
                    <SelectContent className="z-[1004]">
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="a-z">A - Z</SelectItem>
                        <SelectItem value="z-a">Z - A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default FilterCategoryAndSort;
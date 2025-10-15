'use client'
import { createContext, useContext, useState } from "react";

interface FilterContextType {
    showFilter: boolean,
    setShowFilter: (val: boolean) => void;
}

const FilterContext = createContext<FilterContextType | false>(false)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [showFilter, setShowFilter] = useState(false);
    return (
        <FilterContext.Provider value={{ showFilter, setShowFilter}}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within FilterProvider !!!")
    }
    return context;
};
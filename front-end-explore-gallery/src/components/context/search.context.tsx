'use client'
import { ItemType } from "@/types/type";
import { createContext, useContext, useState } from "react";

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    listItem: ItemType[] | null;
    setListItem: (items: ItemType[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [listItem, setListItem] = useState<ItemType[]>([]);
    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm , listItem, setListItem}}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within SearchProvider !!!")
    }
    return context;
};
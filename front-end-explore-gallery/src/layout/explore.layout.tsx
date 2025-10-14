'use client'
import HeaderExplorePage from "@/components/explore_page/header.page";
import { useSearchItems } from "@/hooks/useHookItem";
import { useState } from "react";

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };
    const { data, isLoading, isError } = useSearchItems(searchTerm);
    return (
        <>
            <HeaderExplorePage onChangeSearch={handleSearchChange} searchTermValue={searchTerm} />
            {children}
        </>
    )
}

export default ExploreLayout;
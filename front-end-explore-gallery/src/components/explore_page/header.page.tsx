'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../toggle-mode";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
// <a href="..."> <button> <input>, <textarea>, <select></select> use tab-keyboard

interface HeaderProps {
    searchTermValue: string;
    onChangeSearch: (value: string) => void;
}

const HeaderExplorePage = ({ onChangeSearch, searchTermValue }: HeaderProps) => {
    const pathName = usePathname();
    const is_create_page = pathName === "/create";
    const is_detail_page = pathName.startsWith("/items/");
    const [showSearchBar, setShowSearchBar] = useState(false);

    const handleSearchTermChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        onChangeSearch(e.target.value);
    }

    const handleSearchClick = () => {
        setShowSearchBar(!showSearchBar);
    }

    return (
        <>
            {!showSearchBar && (
                <div className="flex justify-between w-full p-4 border-b-[1px] border-gray-200">
                    <Link className="tab-keyboard hover:scale-[105%] transition-all duration-300 ease-in-out hover:underline tab-keyboard rounded-lg px-3 py-1" href="/">
                        <div className="text-center text-2xl font-semibold">
                            <div>EXPLORE GALERY</div>
                        </div>
                    </Link>
                    <div className="flex justify-center items-center">
                        {!is_detail_page && (
                            <Search onClick={handleSearchClick} />
                        )}
                        {!is_create_page && (
                            <Link href={"/create"} className="ml-2 text-white py-1 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-colors duration-300 ease-in-out flex justify-center items-center">
                                <span className="text-xl font-light w-5 flex justify-center items-center">+</span>
                                <span>Create New</span>
                            </Link>
                        )}
                        <div className="ml-2">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            )}
            {showSearchBar && (
                <div className="flex justify-center w-full p-4 border-b-[1px] border-gray-200">
                    <div className="py-1 w-1/2 flex justify-center items-center gap-2">
                        <div className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchTermValue}
                                onChange={handleSearchTermChangeInput}
                                className="w-full !py-2"
                            />
                            <button
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => console.log("Icon clicked")}
                            >
                                <Search />
                            </button>
                        </div>
                        <div><X onClick={handleSearchClick} /></div>
                    </div>
                </div>
            )}
        </>
    )
}

export default HeaderExplorePage
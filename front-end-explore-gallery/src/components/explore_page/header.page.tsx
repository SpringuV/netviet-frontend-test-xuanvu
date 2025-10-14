'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
// <a href="..."> <button> <input>, <textarea>, <select></select>
const HeaderExplorePage = () => {
    const pathName = usePathname();
    const is_create_page = pathName === "/create";
    return (
        <>
            <div className="flex justify-between w-full p-4 border-b-[1px] border-gray-200">
                <Link className="tab-keyboard hover:scale-[105%] transition-all duration-300 ease-in-out hover:underline tab-keyboard rounded-lg px-3 py-1" href="/">
                    <div className="text-center text-2xl font-semibold">
                        <div>EXPLORE GALERY</div>
                    </div>
                </Link>
                <div className="w-1/4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faSearch} />
                    {!is_create_page && (
                        <Link href={"/create"} className="ml-2 text-white py-1 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-colors duration-300 ease-in-out flex justify-center items-center">
                            <span className="text-xl font-light w-5 flex justify-center items-center">+</span>
                            <span>Create New</span>
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}

export default HeaderExplorePage
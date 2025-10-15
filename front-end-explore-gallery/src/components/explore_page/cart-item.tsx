/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'
import { ItemType } from "@/types/type";

type PropsType = {
    item: ItemType;
}

const CartItem = ({ item}: PropsType) => {

    return (
        <>
            <div className="overflow-hidden border-gray-200 rounded-lg shadow-lg dark:bg-gray-600  cursor-pointer">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover duration-500 hover:scale-105 transition-transform border ease-in-out" ></img>
                <div className="flex justify-between p-2">
                    <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartItem;
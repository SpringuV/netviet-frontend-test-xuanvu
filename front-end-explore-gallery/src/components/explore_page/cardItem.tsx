/* eslint-disable @next/next/no-img-element */
'use client'
import { ItemType } from "@/types/type";

type PropsType = {
    item: ItemType
}

const CartItem = (props: PropsType) => {
    const { item } = props;
    return (
        <>
            <div className="overflow-hidden border-gray-200 rounded-lg shadow-sm ">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover duration-500 hover:scale-105 transition-transform border ease-in-out" ></img>
                <div className="flex justify-between p-2">
                    <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex items-center">❤️ {item.likes} like</div>
                </div>
            </div>
        </>
    )
}

export default CartItem;
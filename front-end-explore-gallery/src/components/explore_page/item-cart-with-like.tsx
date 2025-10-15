'use client'
import { useItem } from "@/hooks/useHookItem"
import CartItem from "./cart-item"
import { Heart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { ItemType } from "@/types/type"

type Props = { item: ItemType }

const ItemCardWithLike = ({ item }: Props) => {
    const { data, updateLike } = useItem(item.id ?? "")
    const [liking, setLiking] = useState(false)

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (liking) return
        setLiking(true)
        await updateLike()
        setLiking(false)
    }

    return (
        <div className="relative">
            <div className="absolute bottom-2 right-0 z-10 mr-2">
                <button
                    type="button"
                    onClick={handleLike}
                    disabled={liking}
                    className={`px-3 py-1 cursor-pointer text-sm rounded-full flex gap-2 items-center bg-red-400 text-white hover:bg-red-500 ${liking ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <Heart className="w-4 h-4" />
                    {data?.likes ?? item.likes}
                </button>
            </div>
            <Link href={`/items/${item.id}`}>
                <CartItem item={data ?? item} />
            </Link>
        </div>
    )
}

export default ItemCardWithLike

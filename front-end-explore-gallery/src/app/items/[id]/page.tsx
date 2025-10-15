/* eslint-disable @next/next/no-img-element */
'use client'
import CartItem from "@/components/explore_page/cardItem";
import ZoomImage from "@/components/zoom-image";
import { useItem, useRelatedItem } from "@/hooks/useHookItem";
import { ItemType } from "@/types/type";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const ItemDetailPage = () => {
    const [liking, setLiking] = useState(false);
    const [zoom, setZoom] = useState(false);
    const router = useRouter();
    const paramString = useParams();
    const id = String(paramString.id);

    // Fetch item
    const { data: itemData, isError: isItemError, isLoading: isItemLoading, mutate: mutateItem, } = useItem(id);

    // Fetch 
    const { data: itemsRelated, isError: isItemsRelatedError, isLoading: isItemsRelatedLoading, mutate: mutateItemsRelated } = useRelatedItem(itemData?.category, id)
    if (isItemError) return notFound();

    // loading
    if (isItemLoading && !itemData) {
        return <div className="text-center py-10">Loading...</div>;
    }

    // data not found
    if (!itemData) {
        return <div className="text-center py-10">No data found</div>;
    }
    const handleLike = async () => {
        if (liking) return; // tránh double click
        setLiking(true);

        // Optimistic update
        mutateItem({ ...itemData, likes: itemData.likes + 1 }, false);

        try {
            // Gọi PATCH lên server
            await fetch(`http://localhost:3001/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ likes: itemData.likes + 1 }),
            });

            // Revalidate
            mutateItem();
        } catch (e) {
            console.error(e);
            // rollback
            mutateItem();
        } finally {
            setLiking(false);
        }
    };

    const handleOnClick = (id: string) => {
        router.push(`/items/${id}`);
    };

    const handleZoom = () => {
        setZoom(!zoom)
    }

    return (
        <>
            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-semibold mb-2">{itemData.title}</h1>
                <div className="">
                    <img onClick={handleZoom} src={itemData.image} alt={itemData.title} className=" rounded-2xl mb-4 object-cover m-auto min-h-[30vh] max-h-[50vh]" />
                    <ZoomImage alt={itemData.title} source={itemData.image} setZoom={handleZoom} zoom={zoom} />
                </div>

                <p className="text-gray-500 mb-4"><span className="text-black font-semibold">Category:</span> {itemData.category}</p>
                <p className="text-gray-500 mb-4"><span className="text-black font-semibold">Decription: </span>{itemData.description}</p>

                {itemData?.tags && (
                    <div className="flex gap-2 mb-4">
                        <span className="text-black font-semibold">Tags:</span>
                        {itemData.tags.split(',').map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center text-gray-600">
                    <span><span className="text-black font-semibold">Author:</span> {itemData.author}</span>
                    <div>

                        <button
                            onClick={handleLike}
                            disabled={liking}
                            className={`text-base ${liking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300 mr-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-1 rounded-lg`}
                        >
                            Favorite
                        </button>
                        <span className="text-black font-semibold mr-2">❤️ {itemData.likes}</span>
                    </div>
                </div>
            </div>

            {/* More from this category */}
            {itemsRelated.length > 0 && (
                <div className="p-6 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">More from this category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itemsRelated.map((itemRelate: ItemType) => (
                            <div
                                onClick={() => handleOnClick(itemRelate.id)}
                                key={itemRelate.id}
                                className="cursor-pointer"
                            >
                                <CartItem item={itemRelate} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ItemDetailPage;
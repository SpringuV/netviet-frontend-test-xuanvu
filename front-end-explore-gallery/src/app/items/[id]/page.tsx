/* eslint-disable @next/next/no-img-element */
'use client'
import ZoomImage from "@/components/zoom-image";
import { useItem, useRelatedItem } from "@/hooks/useHookItem";
import { AlertStatus, ItemType } from "@/types/type";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Alert from "@/components/alert/alert";
import ItemCardWithLike from "@/components/explore_page/item-cart-with-like";

const ItemDetailPage = () => {
    const [liking, setLiking] = useState(false);
    const [alert, setAlert] = useState<{ title: string; message: string; type: AlertStatus; duration: number } | null>(null);
    const [zoom, setZoom] = useState(false);
    const router = useRouter();
    const paramString = useParams();
    const id = String(paramString.id);
    // Fetch item
    const { data: itemData, isError: isItemError, isLoading: isItemLoading, updateLike } = useItem(id);

    // Fetch 
    const { data: itemsRelated, isError: isItemsRelatedError, isLoading: isItemsRelatedLoading } = useRelatedItem(itemData?.category, id)
    if (isItemError) {
        return (
            <div className="text-center py-10 text-red-500">
                Failed to load item. It may not exist or server is unreachable.
            </div>
        );
    }

    if (isItemLoading && !itemData) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!itemData) {
        return <div className="text-center py-10 text-gray-500">Item not found.</div>;
    }

    const handleOnClick = (id: string) => {
        if (!id) {
            setAlert({ title: "Error", message: "Invalid item ID", type: "error", duration: 3000 });
            return;
        }
        router.push(`/items/${id}`);
    };

    const handleZoom = () => {
        setZoom(!zoom)
    }
    const handleFavorite = async () => {
        if (!updateLike) {
            setAlert({ title: "Error", message: "Like function unavailable", type: "error", duration: 3000 });
            return;
        }

        try {
            setLiking(true);
            await updateLike();
        } catch (err) {
            console.error(err);
            setAlert({ title: "Error", message: "Failed to update favorite", type: "error", duration: 3000 });
        } finally {
            setLiking(false);
        }
    };
    return (
        <>
            {alert && (
                <div className="absolute top-15 right-10 z-50">
                    <Alert title={alert.title} message={alert.message} type={alert.type} duration={alert.duration} onClose={() => setAlert(null)} />
                </div>
            )}

            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="dark:text-white text-3xl font-semibold mb-2">{itemData.title}</h1>
                <div className="">
                    <img
                        onClick={handleZoom}
                        src={itemData.image}
                        alt={itemData.title}
                        className="rounded-2xl mb-4 object-cover m-auto min-h-[30vh] max-h-[50vh]"
                    />
                    <ZoomImage alt={itemData.title} source={itemData.image} setZoom={handleZoom} zoom={zoom} />
                </div>

                <p className="text-gray-500 mb-4 dark:text-white">
                    <span className="text-black font-semibold dark:text-gray-400">Category:</span> {itemData.category || "N/A"}
                </p>
                <p className="text-gray-500 mb-4 dark:text-white">
                    <span className="text-black font-semibold dark:text-gray-400">Description:</span> {itemData.description || "N/A"}
                </p>

                {itemData?.tags && itemData.tags.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        <span className="text-black font-semibold dark:text-gray-400">Tags:</span>
                        {itemData.tags.split(',').map((tag: string, index: number) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center text-gray-500 dark:text-white">
                    <span>
                        <span className="text-black font-semibold dark:text-gray-400">Author:</span> {itemData.author || "Unknown"}
                    </span>
                    <div>
                        <button
                            onClick={handleFavorite}
                            disabled={liking}
                            className={`text-base ${liking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300 mr-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-1 rounded-lg`}
                        >
                            Favorite
                        </button>
                        <span className="text-black dark:text-white font-semibold mr-2">❤️ {itemData.likes ?? 0}</span>
                    </div>
                </div>
            </div>

            {/* More from this category */}
            <div className="p-6 max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">More from this category</h2>
                {isItemsRelatedError && (
                    <div className="text-red-500 text-center py-4">
                        Failed to load related items.
                    </div>
                )}
                {isItemsRelatedLoading && (
                    <div className="text-gray-500 text-center py-4">
                        Loading related items...
                    </div>
                )}
                {itemsRelated && itemsRelated.length === 0 && !isItemsRelatedLoading && (
                    <div className="text-gray-500 text-center py-4">
                        No related items found.
                    </div>
                )}
                {itemsRelated && itemsRelated.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itemsRelated.map((itemRelate: ItemType) => (
                            <div
                                onClick={() => handleOnClick(itemRelate.id ?? "")}
                                key={itemRelate.id}
                                className="cursor-pointer"
                            >
                                <ItemCardWithLike item={itemRelate} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ItemDetailPage;
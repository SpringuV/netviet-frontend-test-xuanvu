/* eslint-disable @next/next/no-img-element */
'use client'
import CartItem from "@/components/explore_page/cardItem";
import { useItem, useItems } from "@/hooks/useHookItem";
import { ItemType } from "@/types/type";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const ItemDetailPage = () => {
    const [liking, setLiking] = useState(false);
    const router = useRouter();
    const paramString = useParams();
    const id = Number(paramString.id);

    // Fetch dữ liệu item cụ thể
    const { data: itemData, isError: isItemError, isLoading: isItemLoading, mutate: mutateItem, } = useItem(id);

    // Fetch danh sách item để hiển thị related
    const {
        data: allItems,
        isError: isAllError,
        isLoading: isAllLoading,
    } = useItems();

    // Handle error state
    if (isItemError) return notFound();

    // Handle loading state - chỉ show loading khi KHÔNG có data
    if (isItemLoading && !itemData) {
        return <div className="text-center py-10">Loading...</div>;
    }

    // Handle no data case
    if (!itemData) {
        return <div className="text-center py-10">No data found</div>;
    }

    const relatedItems = allItems?.filter((relate: ItemType) => (relate.category === itemData.category) && (Number(relate.id) !== id)) || [];
    console.log("Related Items: ", relatedItems);
    const handleLike = async () => {
        if (liking) return; // tránh double click
        setLiking(true);

        // Optimistic update: tăng likes ngay lập tức
        mutateItem({ ...itemData, likes: itemData.likes + 1 }, false);

        try {
            // Gọi PATCH lên server
            await fetch(`http://localhost:3001/items?id=${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ likes: itemData.likes + 1 }),
            });

            // Revalidate: đồng bộ lại từ server
            mutateItem();
        } catch (e) {
            console.error(e);
            // rollback nếu có lỗi: lấy lại dữ liệu từ server
            mutateItem();
        } finally {
            setLiking(false);
        }
    };

    const handleOnClick = (id: number) => {
        router.push(`/items/${id}`);
    };

    return (
        <>
            <div className="p-6 max-w-5xl mx-auto">
                <img
                    src={itemData.image}
                    alt={itemData.title}
                    className="w-full rounded-2xl mb-4"
                />
                <h1 className="text-3xl font-semibold mb-2">{itemData.title}</h1>
                <p className="text-gray-500 mb-4">{itemData.category}</p>
                <p className="text-lg mb-4">{itemData.description}</p>

                {itemData?.tags && (
                    <div className="flex gap-2 mb-4">
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
                    <span>Author: {itemData.author}</span>
                    <button
                        onClick={handleLike}
                        disabled={liking}
                        className={`text-lg ${liking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} transition`}
                    >
                        ❤️ {itemData.likes}
                    </button>
                </div>
            </div>

            {/* More from this category */}
            {relatedItems.length > 0 && (
                <div className="p-6 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">More from this category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedItems.map((itemRelate: ItemType) => (
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
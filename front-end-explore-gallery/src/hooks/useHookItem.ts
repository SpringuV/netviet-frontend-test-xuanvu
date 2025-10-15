'use client'
import { PAGE_SIZE } from '@/constant'
import { ItemType } from '@/types/type'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND
const fetcher = (url: string) => fetch(url).then(res => res.json())


export const useInfiniteItems = (category?: string | null, sort?: string | null) => {
    const getKey = (pageIndex: number, previousPageData: ItemType[]) => {
        if (previousPageData && previousPageData.length === 0) return null;

        const params = new URLSearchParams({
            _page: String(pageIndex + 1),
            _limit: String(PAGE_SIZE)
        });

        if (category && category !== "all") params.append("category", category);

        switch (sort) {
            case "a-z":
                params.append("_sort", "title");
                break;
            case "z-a":
                params.append("_sort", "title");
                params.append("_order", "desc");
                break;
            case "latest":
                params.append("_sort", "created_at");
                params.append("_order", "desc");
                break;
            case "oldest":
                params.append("_sort", "created_at");
                params.append("_order", "asc");
                break;
            case "trending":
                params.append("_sort", "likes");
                params.append("_order", "desc");
                break;
        }

        return `${API_URL}/items?${params.toString()}`;
    };

    const { data, error, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 5000
    });

    const items = data ? [].concat(...data) : [];
    const lastPage = data ? data[data.length - 1] : [];
    const hasMore = lastPage.length === PAGE_SIZE;

    return { items, isLoading, isError: error, size, setSize, hasMore };
};

export const useItem = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR<ItemType>(id ? `${API_URL}/items/${id}` : null, fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const updateLike = async () => {
        if (!data) return;
        mutate({ ...data, likes: data.likes + 1 }, false);

        try {
            await fetch(`${API_URL}/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ likes: data.likes + 1 }),
            });
            // Revalidate 
            mutate();
        } catch (err) {
            console.error(err);
            // Rollback
            mutate();
        }
    };

    return {
        data,
        isLoading,
        isError: error,
        mutate,
        updateLike,
    };
}

export const useRelatedItem = (cate?: string, id?: string) => {
    const willFetch = cate && cate.trim().length > 0;
    const { data, error, isLoading, mutate } = useSWR<ItemType[]>(willFetch ? `${API_URL}/items?category=${encodeURIComponent(cate)}` : null, fetcher, {
        revalidateOnFocus: false, // tránh refetch khi đổi tab
        shouldRetryOnError: false, // Không retry nếu 404
    })
    const filtered = data?.filter(item => item.id !== id) || [];
    return {
        data: filtered || [],
        isLoading,
        isError: error,
        mutate
    }
}

export const useSearchItems = (query: string) => {
    const { data, error, isLoading } = useSWR<ItemType[]>(
        query.trim().length > 0
            ? `${API_URL}/items?title_like=${encodeURIComponent(query)}`
            : null,
        fetcher,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    )
    return { data, isLoading, isError: error }
}

export function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debounced
}


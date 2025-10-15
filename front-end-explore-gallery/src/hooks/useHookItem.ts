'use client'
import { ItemType } from '@/types/type'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const useItems = () => {
    const { data, error, isLoading, mutate } = useSWR('http://localhost:3001/items', fetcher, {
        revalidateOnFocus: false, // tránh refetch khi đổi tab
        shouldRetryOnError: false, // Không retry nếu 404
    })

    return {
        data: data || [],
        isLoading,
        isError: error,
        mutate, // để update optimistic
    }
}

export function useItem(id?: string) {

    const { data, error, isLoading, mutate } = useSWR<ItemType>(id ? `http://localhost:3001/items/${id}` : null, fetcher);
    const itemData = Array.isArray(data) ? data[0] : data;
    return {
        data: itemData as ItemType,
        isLoading,
        isError: error,
        mutate, // để update optimistic
    }
}

export function useCategory() {
    const { data, error, isLoading } = useSWR('http://localhost:3001/categories', fetcher, {
        revalidateOnFocus: false, // tránh refetch khi đổi tab
        shouldRetryOnError: false, // Không retry nếu 404
    })
    return {
        data,
        isLoading,
        isError: error,
    };
}

export function useSearchItems(query: string) {
    console.log(">> check query: " , query)
    const { data, error, isLoading } = useSWR<ItemType[]>(query.trim().length !== 0 ? `http://localhost:3001/items?title_like=${encodeURIComponent(query)}` : 'http://localhost:3001/items', fetcher, {
        revalidateOnFocus: false, // tránh refetch khi đổi tab
        shouldRetryOnError: false,
    });
    return {
        data: data,
        isLoading,
        isError: error,
    };
}
export function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}


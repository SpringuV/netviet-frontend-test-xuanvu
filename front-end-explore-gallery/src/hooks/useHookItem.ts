'use client'
import { ItemType } from '@/types/type'
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
    const { data, error, isLoading } = useSWR<ItemType[]>(query ? `http://localhost:3001/items?title_like=${encodeURIComponent(query)}` : null, fetcher);
    const filterData = Array.isArray(data) ? data.filter((item: ItemType)=> item.title.toLowerCase().includes(query.toLowerCase())) : [];
    return {
        data: filterData,
        isLoading,
        isError: error,
    };
}


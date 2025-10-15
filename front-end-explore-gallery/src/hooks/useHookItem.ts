'use client'
import { ItemType } from '@/types/type'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
const PAGE_SIZE = 12
const API_URL = 'http://localhost:3001'
const fetcher = (url: string) => fetch(url).then(res => res.json())


export const useInfiniteItems = (category?: string | null, sort?: string | null) => {
    const getKey = (pageIndex: number, previousPageData: ItemType[]) => {
        if (previousPageData && previousPageData.length === 0) {
            return null;
        }
        // query
        const params = new URLSearchParams({
            _page: String(pageIndex + 1),
            _limit: String(PAGE_SIZE)
        })
        if (category && category !== 'all') {
            params.append('category', category)
        }
        if (sort === "a-z") {
            params.append('_sort', 'title')
        } else if (sort === 'z-a') {
            params.append('_sort', 'title')
            params.append('_order', 'desc')
        } else if (sort === 'latest') {
            params.append('_sort', 'created_at')
            params.append('_order', 'desc')
        } else if (sort === 'oldest') {
            params.append('_sort', 'created_at')
            params.append('_order', 'asc')
        } else if (sort === 'trending') {
            params.append('_sort', 'likes')
            params.append('_order', 'desc')
        }

        console.log('url: ', `${API_URL}/items?${params.toString()}`)
        return `${API_URL}/items?${params.toString()}`
    }

    const { data, error, size, setSize, isLoading, mutate } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 5000, //duplicate requests
    })

    const items = data ? [].concat(...data) : []

    return {
        items,
        isLoading,
        isError: error,
        size,
        setSize,
        hasMore: data ? data[data.length - 1]?.length === PAGE_SIZE : true,
        mutate
    }
}

export const useItem = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR<ItemType>(id ? `${API_URL}/items/${id}` : null, fetcher)
    return {
        data,
        isLoading,
        isError: error,
        mutate,
    }
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

export const useCategory = () => {
    const { data, error, isLoading } = useSWR(`${API_URL}/categories`, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    })
    return { data, isLoading, isError: error }
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


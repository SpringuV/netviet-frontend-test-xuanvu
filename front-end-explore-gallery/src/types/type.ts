export type ItemType = {
    id: string,
    title: string,
    image: string,
    category: string,
    tags: string,
    description: string,
    author: string,
    likes: number,
    created_at: string,
}

export type AlertStatus = 'success' | 'error' | 'info' | 'warning';
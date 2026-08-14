import type { Post } from '@/types/post'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

export async function fetchPosts(page: number, limit: number): Promise<Post[]> {
  const response = await fetch(`${POSTS_URL}?_page=${page}&_limit=${limit}`)

  if (!response.ok) {
    throw new Error('Не удалось загрузить посты')
  }

  return response.json()
}

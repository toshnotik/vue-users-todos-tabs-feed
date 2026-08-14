import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { fetchPosts } from '@/api/posts'
import type { Post } from '@/types/post'

const pageSize = 8

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const page = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)

  const isEmpty = computed(() => !isLoading.value && posts.value.length === 0)

  async function loadMorePosts() {
    if (isLoading.value || !hasMore.value) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const nextPosts = await fetchPosts(page.value, pageSize)

      posts.value.push(...nextPosts)
      page.value += 1
      hasMore.value = nextPosts.length === pageSize
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить посты'
    } finally {
      isLoading.value = false
    }
  }

  return {
    posts,
    isLoading,
    error,
    hasMore,
    isEmpty,
    loadMorePosts,
  }
})

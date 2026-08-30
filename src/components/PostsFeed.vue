<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { usePostsStore } from '@/stores/posts'

const postsStore = usePostsStore()
const { posts, isLoading, error, hasMore, isEmpty } = storeToRefs(postsStore)
const sentinel = ref<HTMLElement | null>(null)

onMounted(() => {
  postsStore.loadMorePosts()
})

useIntersectionObserver(sentinel, postsStore.loadMorePosts)
</script>

<template>
  <section class="section">
    <div class="section__header">
      <div>
        <h2>Лента постов</h2>
        <p>Новые посты подгружаются через Intersection Observer.</p>
      </div>
    </div>

    <div v-if="error" class="notice notice--error">
      <span>{{ error }}</span>
      <button class="button button--secondary" type="button" @click="postsStore.loadMorePosts">
        Повторить
      </button>
    </div>

    <p v-if="isEmpty" class="empty-text">Постов пока нет</p>

    <article v-for="post in posts" :key="post.id" class="post">
      <span>Пост #{{ post.id }}</span>
      <h3>{{ post.title }}</h3>
      <p>{{ post.body }}</p>
    </article>

    <div v-if="isLoading" class="skeleton-list" aria-label="Загрузка постов">
      <div v-for="item in 3" :key="item" class="skeleton" />
    </div>

    <div ref="sentinel" class="feed-sentinel">
      <span v-if="!hasMore">Нет больше постов</span>
    </div>
  </section>
</template>

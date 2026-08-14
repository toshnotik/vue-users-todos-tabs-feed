<script setup lang="ts">
import { ref } from 'vue'

import AppModal from '@/components/AppModal.vue'
import FeedbackForm from '@/components/FeedbackForm.vue'
import PostsFeed from '@/components/PostsFeed.vue'
import TabsPanel from '@/components/TabsPanel.vue'
import TodoList from '@/components/TodoList.vue'
import UsersTable from '@/components/UsersTable.vue'

const isModalOpen = ref(false)
</script>

<template>
  <main class="page">
    <header class="page-header">
      <div>
        <p>Vue 3 · TypeScript · Pinia · SCSS</p>
        <h1>Тестовое задание</h1>
      </div>
      <button class="button" type="button" @click="isModalOpen = true">Открыть modal</button>
    </header>

    <UsersTable />

    <div class="layout-grid">
      <TodoList />
      <TabsPanel />
    </div>

    <div class="layout-grid">
      <FeedbackForm />
      <PostsFeed />
    </div>

    <AppModal :is-open="isModalOpen" @close="isModalOpen = false">
      <h2 id="modal-title">Modal component</h2>
      <p>Контент передан через slot. Окно закрывается по клику на оверлей, по ESC и по кнопке.</p>
      <button class="button" type="button" @click="isModalOpen = false">Понятно</button>
    </AppModal>
  </main>
</template>

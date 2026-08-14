<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useTodosStore } from '@/stores/todos'
import type { TodoFilter } from '@/types/todo'

const todosStore = useTodosStore()
const { filter, visibleTodos } = storeToRefs(todosStore)

const newTodo = ref('')
const editingId = ref<string | null>(null)
const editingTitle = ref('')

const filters: Array<{ value: TodoFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' },
]

function addTodo() {
  todosStore.addTodo(newTodo.value)
  newTodo.value = ''
}

function startEditing(id: string, title: string) {
  editingId.value = id
  editingTitle.value = title
}

function saveEditing(id: string) {
  todosStore.updateTodo(id, editingTitle.value)
  editingId.value = null
}
</script>

<template>
  <section class="section">
    <div class="section__header">
      <div>
        <h2>Задачи</h2>
        <p>Список сохраняется в localStorage.</p>
      </div>
    </div>

    <form class="inline-form" @submit.prevent="addTodo">
      <input v-model="newTodo" type="text" placeholder="Новая задача" />
      <button class="button" type="submit">Добавить</button>
    </form>

    <div class="segmented">
      <button
        v-for="item in filters"
        :key="item.value"
        type="button"
        :class="{ active: filter === item.value }"
        @click="filter = item.value"
      >
        {{ item.label }}
      </button>
    </div>

    <ul class="todo-list">
      <li v-for="todo in visibleTodos" :key="todo.id" class="todo-item">
        <input :checked="todo.completed" type="checkbox" @change="todosStore.toggleTodo(todo.id)" />

        <form v-if="editingId === todo.id" class="todo-edit" @submit.prevent="saveEditing(todo.id)">
          <input v-model="editingTitle" type="text" />
          <button class="button button--secondary" type="submit">Сохранить</button>
        </form>

        <template v-else>
          <span :class="{ done: todo.completed }">{{ todo.title }}</span>
          <div class="todo-actions">
            <button class="text-button" type="button" @click="startEditing(todo.id, todo.title)">Изменить</button>
            <button class="text-button text-button--danger" type="button" @click="todosStore.deleteTodo(todo.id)">
              Удалить
            </button>
          </div>
        </template>
      </li>
    </ul>

    <p v-if="!visibleTodos.length" class="empty-text">Задач пока нет</p>
  </section>
</template>

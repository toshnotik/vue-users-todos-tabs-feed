import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Todo, TodoFilter } from '@/types/todo'

const STORAGE_KEY = 'eme.todos'

export const useTodosStore = defineStore('todos', () => {
  const todos = useLocalStorage<Todo[]>(STORAGE_KEY, [])
  const filter = ref<TodoFilter>('all')

  const visibleTodos = computed(() => {
    if (filter.value === 'active') {
      return todos.value.filter((todo) => !todo.completed)
    }

    if (filter.value === 'completed') {
      return todos.value.filter((todo) => todo.completed)
    }

    return todos.value
  })

  function addTodo(title: string) {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    todos.value.unshift({
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
    })
  }

  function updateTodo(id: string, title: string) {
    const todo = todos.value.find((item) => item.id === id)

    if (!todo) {
      return
    }

    todo.title = title.trim()
  }

  function toggleTodo(id: string) {
    const todo = todos.value.find((item) => item.id === id)

    if (!todo) {
      return
    }

    todo.completed = !todo.completed
  }

  function deleteTodo(id: string) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  return {
    todos,
    filter,
    visibleTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  }
})

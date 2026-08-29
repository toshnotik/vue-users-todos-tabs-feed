import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Todo, TodoFilter } from '@/types/todo'

const STORAGE_KEY = 'eme.todos'

function readTodos(): Todo[] {
  const savedTodos = localStorage.getItem(STORAGE_KEY)

  if (!savedTodos) {
    return []
  }

  try {
    return JSON.parse(savedTodos) as Todo[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<Todo[]>(readTodos())
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

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
  }

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
    saveTodos()
  }

  function updateTodo(id: string, title: string) {
    const todo = todos.value.find((item) => item.id === id)

    if (!todo) {
      return
    }

    todo.title = title.trim()
    saveTodos()
  }

  function toggleTodo(id: string) {
    const todo = todos.value.find((item) => item.id === id)

    if (!todo) {
      return
    }

    todo.completed = !todo.completed
    saveTodos()
  }

  function deleteTodo(id: string) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
    saveTodos()
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

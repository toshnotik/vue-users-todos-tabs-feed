import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useTodosStore } from '@/stores/todos'

describe('todos store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds, edits, toggles and deletes todos', async () => {
    const store = useTodosStore()

    store.addTodo('Write tests')
    store.updateTodo(store.todos[0].id, 'Write useful tests')
    store.toggleTodo(store.todos[0].id)

    expect(store.todos[0]).toMatchObject({
      title: 'Write useful tests',
      completed: true,
    })

    store.deleteTodo(store.todos[0].id)
    await nextTick()

    expect(store.todos).toHaveLength(0)
  })

  it('persists todos in localStorage', async () => {
    const store = useTodosStore()

    store.addTodo('Persist me')
    await nextTick()

    expect(localStorage.getItem('eme.todos')).toContain('Persist me')
  })
})

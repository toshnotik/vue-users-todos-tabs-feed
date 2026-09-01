import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import TodoList from '@/components/TodoList.vue'

function mountTodoList() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(TodoList, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('TodoList', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a todo', async () => {
    const wrapper = mountTodoList()

    await wrapper.get('input[type="text"]').setValue('Prepare review')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Prepare review')
  })

  it('edits a todo', async () => {
    const wrapper = mountTodoList()

    await wrapper.get('input[type="text"]').setValue('Draft README')
    await wrapper.get('form').trigger('submit')
    await wrapper.get('.text-button').trigger('click')
    await wrapper.get('.todo-edit input').setValue('Polish README')
    await wrapper.get('.todo-edit').trigger('submit')

    expect(wrapper.text()).toContain('Polish README')
    expect(wrapper.text()).not.toContain('Draft README')
  })

  it('marks a todo as completed', async () => {
    const wrapper = mountTodoList()

    await wrapper.get('input[type="text"]').setValue('Run tests')
    await wrapper.get('form').trigger('submit')
    await wrapper.get('input[type="checkbox"]').setValue(true)

    expect(wrapper.get('.todo-item span').classes()).toContain('done')
  })

  it('persists todos in localStorage', async () => {
    const wrapper = mountTodoList()

    await wrapper.get('input[type="text"]').setValue('Save locally')
    await wrapper.get('form').trigger('submit')
    await nextTick()

    expect(localStorage.getItem('eme.todos')).toContain('Save locally')
  })
})

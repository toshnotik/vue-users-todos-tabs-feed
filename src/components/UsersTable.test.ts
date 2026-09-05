import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import UsersTable from '@/components/UsersTable.vue'
import type { User } from '@/types/user'

function makeUser(id: number, name: string): User {
  return {
    id,
    name,
    username: name.toLowerCase().replace(/\s/g, '.'),
    email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    phone: '',
    website: '',
    company: {
      name: '',
      catchPhrase: '',
      bs: '',
    },
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: {
        lat: '',
        lng: '',
      },
    },
  }
}

function mountUsersTable() {
  const pinia = createPinia()
  setActivePinia(pinia)

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([makeUser(1, 'Charlie Brown'), makeUser(2, 'Alice Green')]),
    }),
  )

  return mount(UsersTable, {
    global: {
      plugins: [pinia],
    },
  })
}

function mountUsersTableWithFailedRequest() {
  const pinia = createPinia()
  setActivePinia(pinia)

  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

  return mount(UsersTable, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('UsersTable', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('filters users by role', async () => {
    const wrapper = mountUsersTable()

    await flushPromises()
    await wrapper.get('select').setValue('Администратор')

    expect(wrapper.text()).toContain('Найдено: 20')
  })

  it('filters users by status', async () => {
    const wrapper = mountUsersTable()

    await flushPromises()
    await wrapper.findAll('select')[1].setValue('Ожидает')

    expect(wrapper.text()).toContain('Найдено: 20')
  })

  it('updates aria-sort when sorting changes', async () => {
    const wrapper = mountUsersTable()

    await flushPromises()
    await wrapper.get('button[aria-label^="Email"]').trigger('click')

    expect(wrapper.get('th[aria-sort="ascending"]').text()).toContain('Email')
  })

  it('shows a retryable error when users cannot be loaded', async () => {
    const wrapper = mountUsersTableWithFailedRequest()

    await flushPromises()

    expect(wrapper.text()).toContain('Не удалось загрузить пользователей')
    expect(wrapper.get('.notice--error button').text()).toBe('Повторить')
  })
})

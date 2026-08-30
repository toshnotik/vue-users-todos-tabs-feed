import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useUsersStore } from '@/stores/users'
import type { TableUser } from '@/types/user'

function makeUser(id: number, overrides: Partial<TableUser> = {}): TableUser {
  return {
    id,
    name: `User ${id}`,
    username: `user${id}`,
    email: `user${id}@example.com`,
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
    role: 'Менеджер',
    status: 'Активен',
    registeredAt: `2024-01-${String(id).padStart(2, '0')}`,
    ...overrides,
  }
}

describe('users store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('filters users by role and status', () => {
    const store = useUsersStore()

    store.users = [
      makeUser(1, { role: 'Менеджер', status: 'Активен' }),
      makeUser(2, { role: 'Редактор', status: 'Ожидает' }),
      makeUser(3, { role: 'Менеджер', status: 'Ожидает' }),
    ]

    store.setRoleFilter('Менеджер')
    store.setStatusFilter('Ожидает')

    expect(store.filteredUsers).toHaveLength(1)
    expect(store.filteredUsers[0].id).toBe(3)
  })

  it('sorts users and toggles sort direction', () => {
    const store = useUsersStore()

    store.users = [makeUser(1, { name: 'Charlie' }), makeUser(2, { name: 'Alice' })]

    expect(store.visibleUsers.map((user) => user.name)).toEqual(['Alice', 'Charlie'])

    store.setSort('name')

    expect(store.visibleUsers.map((user) => user.name)).toEqual(['Charlie', 'Alice'])
  })

  it('derives visible users from the selected page size', () => {
    const store = useUsersStore()

    store.users = Array.from({ length: 25 }, (_, index) => makeUser(index + 1))

    store.setPageSize(20)
    store.currentPage = 2

    expect(store.totalPages).toBe(2)
    expect(store.visibleUsers).toHaveLength(5)
  })
})

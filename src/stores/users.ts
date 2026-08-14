import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { fetchUsers } from '@/api/users'
import type { TableUser, UserRole, UserStatus } from '@/types/user'

type SortKey = 'name' | 'email' | 'role' | 'status' | 'registeredAt'
type SortDirection = 'asc' | 'desc'

const pageSizes = [10, 20, 50] as const

export const useUsersStore = defineStore('users', () => {
  const users = ref<TableUser[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const roleFilter = ref<UserRole | 'all'>('all')
  const statusFilter = ref<UserStatus | 'all'>('all')
  const sortKey = ref<SortKey>('name')
  const sortDirection = ref<SortDirection>('asc')
  const currentPage = ref(1)
  const pageSize = ref<(typeof pageSizes)[number]>(10)

  const filteredUsers = computed(() =>
    users.value.filter((user) => {
      const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
      const matchesStatus = statusFilter.value === 'all' || user.status === statusFilter.value

      return matchesRole && matchesStatus
    }),
  )

  const sortedUsers = computed(() => {
    return [...filteredUsers.value].sort((first, second) => {
      const firstValue = first[sortKey.value]
      const secondValue = second[sortKey.value]
      const result = String(firstValue).localeCompare(String(secondValue), 'ru')

      return sortDirection.value === 'asc' ? result : -result
    })
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(sortedUsers.value.length / pageSize.value)))

  const visibleUsers = computed(() => {
    const page = Math.min(currentPage.value, totalPages.value)
    const start = (page - 1) * pageSize.value

    return sortedUsers.value.slice(start, start + pageSize.value)
  })

  function setSort(key: SortKey) {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDirection.value = 'asc'
    }
  }

  function setRoleFilter(role: UserRole | 'all') {
    roleFilter.value = role
    currentPage.value = 1
  }

  function setStatusFilter(status: UserStatus | 'all') {
    statusFilter.value = status
    currentPage.value = 1
  }

  function setPageSize(size: (typeof pageSizes)[number]) {
    pageSize.value = size
    currentPage.value = 1
  }

  async function loadUsers() {
    isLoading.value = true
    error.value = null

    try {
      users.value = await fetchUsers()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить пользователей'
    } finally {
      isLoading.value = false
    }
  }

  return {
    pageSizes,
    users,
    isLoading,
    error,
    roleFilter,
    statusFilter,
    sortKey,
    sortDirection,
    currentPage,
    pageSize,
    filteredUsers,
    totalPages,
    visibleUsers,
    loadUsers,
    setSort,
    setRoleFilter,
    setStatusFilter,
    setPageSize,
  }
})

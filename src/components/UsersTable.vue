<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useUsersStore } from '@/stores/users'
import type { UserRole, UserStatus } from '@/types/user'

const usersStore = useUsersStore()
const {
  visibleUsers,
  filteredUsers,
  isLoading,
  error,
  roleFilter,
  statusFilter,
  sortKey,
  sortDirection,
  currentPage,
  pageSize,
  totalPages,
} = storeToRefs(usersStore)

const roles: Array<UserRole | 'all'> = ['all', 'Администратор', 'Менеджер', 'Редактор']
const statuses: Array<UserStatus | 'all'> = ['all', 'Активен', 'Ожидает', 'Заблокирован']
const columns = [
  { key: 'name', label: 'Имя' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Роль' },
  { key: 'status', label: 'Статус' },
  { key: 'registeredAt', label: 'Дата регистрации' },
] as const

function getSortLabel(key: (typeof columns)[number]['key']) {
  if (sortKey.value !== key) {
    return 'Сортировать по возрастанию'
  }

  return sortDirection.value === 'asc' ? 'Сортировать по убыванию' : 'Сортировать по возрастанию'
}

function handleRoleChange(event: Event) {
  usersStore.setRoleFilter((event.target as HTMLSelectElement).value as UserRole | 'all')
}

function handleStatusChange(event: Event) {
  usersStore.setStatusFilter((event.target as HTMLSelectElement).value as UserStatus | 'all')
}

function handlePageSizeChange(event: Event) {
  usersStore.setPageSize(Number((event.target as HTMLSelectElement).value) as 10 | 20 | 50)
}

function formatOption(value: string) {
  return value === 'all' ? 'Все' : value
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
}

onMounted(() => {
  if (!usersStore.users.length) {
    usersStore.loadUsers()
  }
})
</script>

<template>
  <section class="section">
    <div class="section__header">
      <div>
        <h2>Пользователи</h2>
        <p>Данные из JSONPlaceholder с локальными полями роли, статуса и даты регистрации.</p>
      </div>

      <button
        class="button button--secondary"
        type="button"
        :disabled="isLoading"
        @click="usersStore.loadUsers"
      >
        Обновить
      </button>
    </div>

    <div class="toolbar">
      <label class="field">
        <span>Роль</span>
        <select :value="roleFilter" @change="handleRoleChange">
          <option v-for="role in roles" :key="role" :value="role">{{ formatOption(role) }}</option>
        </select>
      </label>

      <label class="field">
        <span>Статус</span>
        <select :value="statusFilter" @change="handleStatusChange">
          <option v-for="status in statuses" :key="status" :value="status">{{ formatOption(status) }}</option>
        </select>
      </label>

      <label class="field">
        <span>На странице</span>
        <select :value="pageSize" @change="handlePageSizeChange">
          <option v-for="size in usersStore.pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>
    </div>

    <div v-if="error" class="notice notice--error">
      <span>{{ error }}</span>
      <button class="button button--secondary" type="button" @click="usersStore.loadUsers">Повторить</button>
    </div>

    <div class="table-shell">
      <table aria-label="Таблица пользователей">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="
                sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined
              "
            >
              <button
                class="sort-button"
                type="button"
                :aria-label="`${column.label}: ${getSortLabel(column.key)}`"
                @click="usersStore.setSort(column.key)"
              >
                {{ column.label }}
                <span v-if="sortKey === column.key" aria-hidden="true">{{
                  sortDirection === 'asc' ? '↑' : '↓'
                }}</span>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="isLoading">
            <td class="table-state" colspan="5">Загружаем пользователей...</td>
          </tr>

          <tr v-else-if="!visibleUsers.length">
            <td class="table-state" colspan="5">
              Пользователи не найдены
              <span v-if="filteredUsers.length === 0">Попробуйте изменить фильтры.</span>
            </td>
          </tr>

          <tr v-for="user in visibleUsers" v-else :key="user.id">
            <td>
              <strong>{{ user.name }}</strong>
              <span class="muted">@{{ user.username }}</span>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span class="status" :class="`status--${user.status}`">{{ user.status }}</span>
            </td>
            <td>{{ formatDate(user.registeredAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <span>Найдено: {{ filteredUsers.length }}</span>
      <div class="pagination__controls">
        <button
          class="button button--secondary"
          type="button"
          :disabled="currentPage === 1"
          @click="currentPage -= 1"
        >
          Назад
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="button button--secondary"
          type="button"
          :disabled="currentPage >= totalPages"
          @click="currentPage += 1"
        >
          Вперед
        </button>
      </div>
    </div>
  </section>
</template>

import type { TableUser, User, UserRole, UserStatus } from '@/types/user'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

const roles: UserRole[] = ['Администратор', 'Менеджер', 'Редактор']
const statuses: UserStatus[] = ['Активен', 'Ожидает', 'Заблокирован']
const usersCount = 60

function buildTableUser(user: User, index: number): TableUser {
  const group = Math.floor(index / 10)
  const copyLabel = group ? ` ${group + 1}` : ''
  const [emailName, emailDomain] = user.email.split('@')

  return {
    ...user,
    id: index + 1,
    name: `${user.name}${copyLabel}`,
    username: `${user.username}${copyLabel}`.replace(/\s/g, ''),
    email: `${emailName}${group ? `.${group + 1}` : ''}@${emailDomain}`,
    role: roles[index % roles.length],
    status: statuses[index % statuses.length],
    registeredAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 24) + 3).padStart(2, '0')}`,
  }
}

export async function fetchUsers(): Promise<TableUser[]> {
  const response = await fetch(USERS_URL)

  if (!response.ok) {
    throw new Error('Не удалось загрузить пользователей')
  }

  const users = (await response.json()) as User[]

  return Array.from({ length: usersCount }, (_, index) => buildTableUser(users[index % users.length], index))
}

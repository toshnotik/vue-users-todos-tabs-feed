export type UserRole = 'Администратор' | 'Менеджер' | 'Редактор'
export type UserStatus = 'Активен' | 'Ожидает' | 'Заблокирован'

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
}

export interface TableUser extends User {
  role: UserRole
  status: UserStatus
  registeredAt: string
}

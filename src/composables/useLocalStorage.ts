import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = localStorage.getItem(key)
  const state = ref(defaultValue) as Ref<T>

  if (storedValue) {
    try {
      state.value = JSON.parse(storedValue) as T
    } catch {
      localStorage.removeItem(key)
    }
  }

  watch(
    state,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true },
  )

  return state
}

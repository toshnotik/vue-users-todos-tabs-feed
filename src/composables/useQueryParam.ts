import { ref } from 'vue'

export function useQueryParam<T extends string>(key: string, defaultValue: T, allowedValues: readonly T[]) {
  const params = new URLSearchParams(window.location.search)
  const valueFromUrl = params.get(key)
  const value = ref(allowedValues.includes(valueFromUrl as T) ? (valueFromUrl as T) : defaultValue)

  function setValue(nextValue: T) {
    value.value = nextValue

    const nextParams = new URLSearchParams(window.location.search)
    nextParams.set(key, nextValue)
    window.history.replaceState(null, '', `${window.location.pathname}?${nextParams.toString()}`)
  }

  return {
    value,
    setValue,
  }
}

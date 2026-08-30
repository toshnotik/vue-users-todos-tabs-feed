import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useIntersectionObserver(target: Ref<Element | null>, callback: () => void) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback()
      }
    })

    if (target.value) {
      observer.observe(target.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}

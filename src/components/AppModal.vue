<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const modal = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let previouslyFocusedElement: HTMLElement | null = null

function getFocusableElements() {
  return Array.from(
    modal.value?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ) ?? [],
  )
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.isOpen) {
    return
  }

  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)

  if (!firstElement || !lastElement) {
    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
      document.body.classList.add('modal-open')
      window.addEventListener('keydown', handleKeydown)
      await nextTick()
      closeButton.value?.focus()
    } else {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeydown)
      previouslyFocusedElement?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open')
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div ref="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button
            ref="closeButton"
            class="modal__close"
            type="button"
            aria-label="Закрыть окно"
            @click="emit('close')"
          >
            ×
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

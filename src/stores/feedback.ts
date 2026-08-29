import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface FeedbackForm {
  name: string
  email: string
  message: string
}

type FeedbackStatus = 'idle' | 'submitting' | 'success'

const STORAGE_KEY = 'eme.feedback'
const FEEDBACK_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useFeedbackStore = defineStore('feedback', () => {
  const status = ref<FeedbackStatus>('idle')
  const error = ref<string | null>(null)

  function resetStatus() {
    status.value = 'idle'
    error.value = null
  }

  async function submitFeedback(form: FeedbackForm) {
    status.value = 'submitting'
    error.value = null

    try {
      const response = await fetch(FEEDBACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Не удалось отправить сообщение')
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form, submittedAt: new Date().toISOString() }))
      status.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось отправить сообщение'
      status.value = 'idle'
    }
  }

  return {
    status,
    error,
    resetStatus,
    submitFeedback,
  }
})

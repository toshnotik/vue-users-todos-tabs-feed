import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

type FeedbackStatus = 'idle' | 'submitting' | 'success'

interface FeedbackForm {
  name: string
  email: string
  message: string
}

const STORAGE_KEY = 'eme.feedback'

export const useFeedbackStore = defineStore('feedback', () => {
  const form = ref<FeedbackForm>({
    name: '',
    email: '',
    message: '',
  })
  const touched = ref<Record<keyof FeedbackForm, boolean>>({
    name: false,
    email: false,
    message: false,
  })
  const status = ref<FeedbackStatus>('idle')

  const errors = computed(() => ({
    name: form.value.name.trim().length < 2 ? 'Введите имя не короче 2 символов' : '',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email) ? '' : 'Введите корректный email',
    message: form.value.message.trim().length < 10 ? 'Сообщение должно быть не короче 10 символов' : '',
  }))

  const isValid = computed(() => Object.values(errors.value).every((error) => !error))

  function touchField(field: keyof FeedbackForm) {
    touched.value[field] = true
    status.value = 'idle'
  }

  async function submitForm() {
    touched.value = {
      name: true,
      email: true,
      message: true,
    }

    if (!isValid.value) {
      return
    }

    status.value = 'submitting'

    await new Promise((resolve) => window.setTimeout(resolve, 700))
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form.value, submittedAt: new Date().toISOString() }))

    form.value = {
      name: '',
      email: '',
      message: '',
    }
    touched.value = {
      name: false,
      email: false,
      message: false,
    }
    status.value = 'success'
  }

  return {
    form,
    touched,
    status,
    errors,
    isValid,
    touchField,
    submitForm,
  }
})

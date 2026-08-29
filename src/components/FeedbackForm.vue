<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import { useFeedbackStore, type FeedbackForm } from '@/stores/feedback'

const feedbackStore = useFeedbackStore()
const { status, error } = storeToRefs(feedbackStore)

const { defineField, errors, handleSubmit, meta, resetForm } = useForm<FeedbackForm>({
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
  validationSchema: {
    name(value: string) {
      return value.trim().length >= 2 || 'Введите имя не короче 2 символов'
    },
    email(value: string) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Введите корректный email'
    },
    message(value: string) {
      return value.trim().length >= 10 || 'Сообщение должно быть не короче 10 символов'
    },
  },
})

const [name, nameAttrs] = defineField('name', { validateOnModelUpdate: true })
const [email, emailAttrs] = defineField('email', { validateOnModelUpdate: true })
const [message, messageAttrs] = defineField('message', { validateOnModelUpdate: true })

const submitForm = handleSubmit(async (values) => {
  await feedbackStore.submitFeedback(values)

  if (status.value === 'success') {
    resetForm()
  }
})
</script>

<template>
  <section class="section">
    <div class="section__header">
      <div>
        <h2>Обратная связь</h2>
        <p>Поля валидируются во время ввода, успешная заявка сохраняется локально.</p>
      </div>
    </div>

    <form class="feedback-form" novalidate @submit="submitForm">
      <label class="field">
        <span>Имя</span>
        <input
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          autocomplete="name"
          :aria-invalid="Boolean(errors.name)"
          aria-describedby="feedback-name-error"
          @input="feedbackStore.resetStatus"
        />
        <small v-if="errors.name" id="feedback-name-error">{{ errors.name }}</small>
      </label>

      <label class="field">
        <span>Email</span>
        <input
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          autocomplete="email"
          :aria-invalid="Boolean(errors.email)"
          aria-describedby="feedback-email-error"
          @input="feedbackStore.resetStatus"
        />
        <small v-if="errors.email" id="feedback-email-error">{{ errors.email }}</small>
      </label>

      <label class="field">
        <span>Сообщение</span>
        <textarea
          v-model="message"
          v-bind="messageAttrs"
          rows="5"
          :aria-invalid="Boolean(errors.message)"
          aria-describedby="feedback-message-error"
          @input="feedbackStore.resetStatus"
        />
        <small v-if="errors.message" id="feedback-message-error">{{ errors.message }}</small>
      </label>

      <div class="form-footer">
        <button class="button" type="submit" :disabled="status === 'submitting' || !meta.valid">
          {{ status === 'submitting' ? 'Отправляем...' : 'Отправить' }}
        </button>
        <span v-if="status === 'success'" class="success-text">Сообщение отправлено</span>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useFeedbackStore } from '@/stores/feedback'

const feedbackStore = useFeedbackStore()
const { form, touched, errors, status, isValid } = storeToRefs(feedbackStore)
</script>

<template>
  <section class="section">
    <div class="section__header">
      <div>
        <h2>Обратная связь</h2>
        <p>Поля валидируются во время ввода, успешная заявка сохраняется локально.</p>
      </div>
    </div>

    <form class="feedback-form" @submit.prevent="feedbackStore.submitForm">
      <label class="field">
        <span>Имя</span>
        <input v-model="form.name" type="text" @blur="feedbackStore.touchField('name')" />
        <small v-if="touched.name && errors.name">{{ errors.name }}</small>
      </label>

      <label class="field">
        <span>Email</span>
        <input v-model="form.email" type="email" @blur="feedbackStore.touchField('email')" />
        <small v-if="touched.email && errors.email">{{ errors.email }}</small>
      </label>

      <label class="field">
        <span>Сообщение</span>
        <textarea v-model="form.message" rows="5" @blur="feedbackStore.touchField('message')" />
        <small v-if="touched.message && errors.message">{{ errors.message }}</small>
      </label>

      <div class="form-footer">
        <button class="button" type="submit" :disabled="status === 'submitting' || !isValid">
          {{ status === 'submitting' ? 'Отправляем...' : 'Отправить' }}
        </button>
        <span v-if="status === 'success'" class="success-text">Сообщение отправлено</span>
      </div>
    </form>
  </section>
</template>

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useFeedbackStore } from '@/stores/feedback'

const feedback = {
  name: 'Konstantin',
  email: 'test@example.com',
  message: 'Useful feedback message',
}

describe('feedback store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('submits feedback and saves it locally', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const store = useFeedbackStore()

    await store.submitFeedback(feedback)

    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(store.status).toBe('success')
    expect(localStorage.getItem('eme.feedback')).toContain(feedback.email)
  })

  it('exposes an error when feedback submit fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const store = useFeedbackStore()

    await store.submitFeedback(feedback)

    expect(store.status).toBe('idle')
    expect(store.error).toBe('Не удалось отправить сообщение')
  })
})

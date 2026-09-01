import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import FeedbackForm from '@/components/FeedbackForm.vue'

function mountFeedbackForm() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(FeedbackForm, {
    global: {
      plugins: [pinia],
    },
  })
}

async function fillForm(wrapper: ReturnType<typeof mountFeedbackForm>, email: string) {
  const fields = wrapper.findAll('input, textarea')

  await fields[0].setValue('Konstantin')
  await fields[1].setValue(email)
  await fields[2].setValue('Message long enough')
}

describe('FeedbackForm', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('shows an error for invalid email', async () => {
    const wrapper = mountFeedbackForm()

    await fillForm(wrapper, 'wrong-email')

    expect(wrapper.text()).toContain('Введите корректный email')
  })

  it('submits valid feedback and saves it locally', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const wrapper = mountFeedbackForm()

    await fillForm(wrapper, 'test@example.com')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Сообщение отправлено')
    expect(localStorage.getItem('eme.feedback')).toContain('test@example.com')
  })
})

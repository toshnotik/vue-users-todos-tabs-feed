import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import AppModal from '@/components/AppModal.vue'

describe('AppModal', () => {
  it('moves focus into the dialog, locks scroll and emits close on Escape', async () => {
    const wrapper = mount(AppModal, {
      attachTo: document.body,
      props: {
        isOpen: true,
      },
      slots: {
        default: '<h2 id="modal-title">Modal title</h2><button>Action</button>',
      },
    })

    await nextTick()

    expect(document.body.classList.contains('modal-open')).toBe(true)
    expect(document.activeElement).toBe(document.querySelector('.modal__close'))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })
})

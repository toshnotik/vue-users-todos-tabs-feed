import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import TabsPanel from '@/components/TabsPanel.vue'

describe('TabsPanel', () => {
  it('reads the active tab from the URL', () => {
    window.history.replaceState(null, '', '/?tab=state')

    const wrapper = mount(TabsPanel)

    expect(wrapper.get('[role="tab"][aria-selected="true"]').text()).toBe('Состояние')
  })

  it('updates the URL and panel content after tab click', async () => {
    window.history.replaceState(null, '', '/')

    const wrapper = mount(TabsPanel)

    await wrapper.get('#tab-ui').trigger('click')

    expect(window.location.search).toBe('?tab=ui')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('адаптивной версткой')
  })

  it('connects tabs with the active panel for accessibility', () => {
    window.history.replaceState(null, '', '/?tab=summary')

    const wrapper = mount(TabsPanel)
    const selectedTab = wrapper.get('[role="tab"][aria-selected="true"]')
    const panel = wrapper.get('[role="tabpanel"]')

    expect(selectedTab.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(selectedTab.attributes('id'))
  })
})

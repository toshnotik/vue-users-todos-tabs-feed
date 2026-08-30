<script setup lang="ts">
import { computed } from 'vue'

import { useQueryParam } from '@/composables/useQueryParam'

const tabs = [
  {
    id: 'summary',
    label: 'Обзор',
    text: 'Все задания собраны на одной странице и используют Composition API.',
  },
  { id: 'state', label: 'Состояние', text: 'Pinia хранит данные таблицы, задач, формы и ленты постов.' },
  {
    id: 'ui',
    label: 'Интерфейс',
    text: 'Компоненты сделаны простыми, с понятными состояниями и адаптивной версткой.',
  },
] as const

type TabId = (typeof tabs)[number]['id']

const tabIds = tabs.map((tab) => tab.id)
const { value: activeTab, setValue: selectTab } = useQueryParam<TabId>('tab', 'summary', tabIds)

const activeContent = computed(() => tabs.find((tab) => tab.id === activeTab.value))

function getTabButtonId(id: TabId) {
  return `tab-${id}`
}

function getTabPanelId(id: TabId) {
  return `tab-panel-${id}`
}

function selectNextTab(direction: 1 | -1) {
  const currentIndex = tabs.findIndex((tab) => tab.id === activeTab.value)
  const nextIndex = (currentIndex + direction + tabs.length) % tabs.length

  selectTab(tabs[nextIndex].id)
}
</script>

<template>
  <section class="section">
    <div class="section__header">
      <div>
        <h2>Вкладки</h2>
        <p>Активная вкладка сохраняется в query-параметре.</p>
      </div>
    </div>

    <div class="tabs" role="tablist" aria-label="Информация о проекте">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :id="getTabButtonId(tab.id)"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="getTabPanelId(tab.id)"
        :tabindex="activeTab === tab.id ? 0 : -1"
        :class="{ active: activeTab === tab.id }"
        @click="selectTab(tab.id)"
        @keydown.left.prevent="selectNextTab(-1)"
        @keydown.right.prevent="selectNextTab(1)"
      >
        {{ tab.label }}
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <div
        :id="getTabPanelId(activeTab)"
        :key="activeTab"
        class="tab-panel"
        role="tabpanel"
        tabindex="0"
        :aria-labelledby="getTabButtonId(activeTab)"
      >
        {{ activeContent?.text }}
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const tabs = [
  { id: 'summary', label: 'Обзор', text: 'Все задания собраны на одной странице и используют Composition API.' },
  { id: 'state', label: 'Состояние', text: 'Pinia хранит данные таблицы, задач, формы и ленты постов.' },
  { id: 'ui', label: 'Интерфейс', text: 'Компоненты сделаны простыми, с понятными состояниями и адаптивной версткой.' },
] as const

type TabId = (typeof tabs)[number]['id']

const query = new URLSearchParams(window.location.search)
const initialTab = tabs.some((tab) => tab.id === query.get('tab')) ? (query.get('tab') as TabId) : 'summary'
const activeTab = ref<TabId>(initialTab)

const activeContent = computed(() => tabs.find((tab) => tab.id === activeTab.value))

function selectTab(id: TabId) {
  activeTab.value = id

  const params = new URLSearchParams(window.location.search)
  params.set('tab', id)
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
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
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="activeTab" class="tab-panel" role="tabpanel">
        {{ activeContent?.text }}
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

import IconClose from '@/shared/ui/icons/IconClose.vue'
import IconPlus from '@/shared/ui/icons/IconPlus.vue'
import IconSearch from '@/shared/ui/icons/IconSearch.vue'

const query = defineModel<string>('query', { required: true })

const emit = defineEmits<{
  'create-section': []
  'create-task': []
}>()
</script>

<template>
  <div class="sidebar-toolbar">
    <label class="search-field">
      <IconSearch class="search-icon" />
      <input
        v-model="query"
        class="search-input"
        type="search"
        placeholder="Search sections & tasks"
        aria-label="Search sections and tasks"
      />
      <button
        v-if="query"
        type="button"
        class="search-clear"
        aria-label="Clear search"
        @click="query = ''"
      >
        <IconClose />
      </button>
    </label>
    <Menu v-slot="{ open }" as="div" class="add-menu">
      <MenuButton class="add-menu-btn" aria-label="Add">
        <IconPlus />
        <span class="menu-chevron" :class="{ open }">›</span>
      </MenuButton>
      <transition
        enter-active-class="menu-enter-active"
        enter-from-class="menu-enter-from"
        enter-to-class="menu-enter-to"
        leave-active-class="menu-leave-active"
        leave-from-class="menu-leave-from"
        leave-to-class="menu-leave-to"
      >
        <MenuItems class="add-menu-items">
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              class="menu-item"
              :class="{ 'menu-item-active': active }"
              @click="emit('create-section')"
            >
              Add section
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              class="menu-item"
              :class="{ 'menu-item-active': active }"
              @click="emit('create-task')"
            >
              Add task
            </button>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<style scoped>
.sidebar-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
}

.search-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input::-webkit-search-cancel-button,
.search-input::-webkit-search-decoration {
  display: none;
}

.search-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.search-clear:hover {
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.search-clear :deep(svg) {
  width: 12px;
  height: 12px;
}

.add-menu {
  position: relative;
  flex-shrink: 0;
}

.add-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  min-width: 44px;
  padding: 0 10px 0 8px;
  border: none;
  border-radius: 10px;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.add-menu-btn:hover {
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.add-menu-btn :deep(svg) {
  width: 14px;
  height: 14px;
}

.menu-chevron {
  font-size: 0.875rem;
  line-height: 1;
  transform: rotate(90deg);
  transition: transform 0.15s ease;
}

.menu-chevron.open {
  transform: rotate(-90deg);
}

.add-menu-items {
  position: absolute;
  right: 0;
  top: calc(100% + 2px);
  z-index: 20;
  min-width: 148px;
  padding: 6px;
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: var(--color-sidebar-shadow);
  outline: none;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.menu-item-active,
.menu-item:hover {
  background: var(--color-surface-hover);
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

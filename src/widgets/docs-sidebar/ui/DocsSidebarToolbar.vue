<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

import IconPlus from '@/shared/ui/icons/IconPlus.vue'

const emit = defineEmits<{
  'create-section': []
  'create-task': []
}>()
</script>

<template>
  <div class="sidebar-toolbar">
    <p class="sidebar-label">Browse</p>
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
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.sidebar-label {
  margin: 0 0 0 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.add-menu {
  position: relative;
}

.add-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  min-width: 44px;
  padding: 0 10px 0 8px;
  border: none;
  border-radius: 8px;
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

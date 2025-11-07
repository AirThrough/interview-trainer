<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { computed } from 'vue'

export type SelectOption = {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: SelectOption[]
    placeholder?: string
  }>(),
  {
    placeholder: 'Select an option',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedLabel = computed(() => {
  return props.options.find((option) => option.value === props.modelValue)?.label ?? props.placeholder
})
</script>

<template>
  <Listbox
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="select-field">
      <ListboxButton class="select-trigger">
        <span class="select-value">{{ selectedLabel }}</span>
        <span class="select-chevron" aria-hidden="true">›</span>
      </ListboxButton>
      <transition
        enter-active-class="select-enter-active"
        enter-from-class="select-enter-from"
        enter-to-class="select-enter-to"
        leave-active-class="select-leave-active"
        leave-from-class="select-leave-from"
        leave-to-class="select-leave-to"
      >
        <ListboxOptions class="select-options">
          <ListboxOption
            v-for="option in options"
            :key="option.value"
            v-slot="{ active, selected }"
            :value="option.value"
            as="template"
          >
            <li class="select-option" :class="{ active, selected }">
              <span>{{ option.label }}</span>
              <span v-if="selected" class="select-check">✓</span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<style scoped>
.select-field {
  position: relative;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 0.9375rem;
  text-align: left;
  cursor: pointer;
  transition: outline 0.15s;
}

.select-trigger:focus {
  outline: 2px solid var(--color-accent-muted);
}

.select-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-chevron {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1;
  transform: rotate(90deg);
}

.select-options {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 240px;
  margin: 0;
  padding: 6px;
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: var(--color-sidebar-shadow);
  list-style: none;
  overflow-y: auto;
  outline: none;
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
}

.select-option.active {
  background: var(--color-surface-hover);
}

.select-option.selected {
  color: var(--color-accent);
  font-weight: 600;
}

.select-check {
  font-size: 0.75rem;
}

.select-enter-active,
.select-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.select-enter-from,
.select-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

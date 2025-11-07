<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog class="dialog-root" @close="emit('cancel')">
      <TransitionChild
        as="template"
        enter="backdrop-enter"
        enter-from="backdrop-enter-from"
        enter-to="backdrop-enter-to"
        leave="backdrop-leave"
        leave-from="backdrop-leave-from"
        leave-to="backdrop-leave-to"
      >
        <div class="dialog-backdrop" />
      </TransitionChild>

      <div class="dialog-wrap">
        <TransitionChild
          as="template"
          enter="panel-enter"
          enter-from="panel-enter-from"
          enter-to="panel-enter-to"
          leave="panel-leave"
          leave-from="panel-leave-from"
          leave-to="panel-leave-to"
        >
          <DialogPanel class="dialog-panel">
            <DialogTitle class="dialog-title">{{ title }}</DialogTitle>
            <p class="dialog-message">{{ message }}</p>
            <div class="dialog-actions">
              <button class="btn btn-ghost" type="button" @click="emit('cancel')">
                {{ cancelLabel ?? 'Cancel' }}
              </button>
              <button
                class="btn"
                :class="destructive ? 'btn-danger' : 'btn-primary'"
                type="button"
                @click="emit('confirm')"
              >
                {{ confirmLabel ?? 'Confirm' }}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.dialog-root {
  position: relative;
  z-index: 50;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.dialog-wrap {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.dialog-panel {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border-radius: 16px;
  background: var(--color-surface);
  box-shadow: var(--color-sidebar-shadow);
}

.dialog-title {
  margin: 0 0 8px;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.dialog-message {
  margin: 0 0 20px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
}

.btn-danger {
  background: var(--color-danger);
  color: #fff;
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
}

.btn-ghost:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

:global(.backdrop-enter),
:global(.backdrop-leave) {
  transition: opacity 0.2s ease;
}

:global(.backdrop-enter-from),
:global(.backdrop-leave-to) {
  opacity: 0;
}

:global(.panel-enter),
:global(.panel-leave) {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

:global(.panel-enter-from),
:global(.panel-leave-to) {
  opacity: 0;
  transform: scale(0.96);
}
</style>

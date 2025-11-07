<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="icon-tooltip">
    <slot />
    <span class="icon-tooltip-text">{{ label }}</span>
  </div>
</template>

<style scoped>
.icon-tooltip {
  position: relative;
  display: inline-flex;
}

.icon-tooltip-text {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  z-index: 1;
  padding: 5px 8px;
  border-radius: 8px;
  background: var(--color-text);
  color: var(--color-bg);
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.icon-tooltip:hover .icon-tooltip-text,
.icon-tooltip:focus-within .icon-tooltip-text {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>

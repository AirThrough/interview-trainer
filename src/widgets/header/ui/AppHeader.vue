<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useTheme } from '@/shared/lib/theme'
import { LogoMark } from '@/shared/ui/logo'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <header class="header">
    <RouterLink to="/docs" class="logo" aria-label="Drill home">
      <LogoMark class="logo-icon" />
    </RouterLink>
    <div class="header-actions">
      <nav class="nav">
        <RouterLink to="/train" class="nav-link">Train</RouterLink>
        <RouterLink to="/sessions" class="nav-link">Sessions</RouterLink>
        <RouterLink to="/docs" class="nav-link">Docs</RouterLink>
      </nav>
      <button
        type="button"
        class="theme-toggle"
        :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <span class="theme-toggle-track" :class="{ light: theme === 'light' }">
          <span class="theme-toggle-thumb" />
        </span>
        <span class="theme-toggle-label">{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  background: var(--color-bg);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  text-decoration: none;
}

.logo-icon {
  width: auto;
  height: 22px;
  flex-shrink: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 14px;
  border-radius: 8px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition:
    color 0.15s,
    background 0.15s;
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}

.nav-link.router-link-active {
  color: var(--color-accent);
  background: var(--color-accent-muted);
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 6px 6px;
  border: none;
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background 0.15s;
}

.theme-toggle:hover {
  background: var(--color-surface-hover);
}

.theme-toggle-track {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: var(--color-toggle-track);
  transition: background 0.2s;
}

.theme-toggle-track.light {
  background: var(--color-accent-muted);
}

.theme-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-toggle-thumb);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s;
}

.theme-toggle-track.light .theme-toggle-thumb {
  transform: translateX(16px);
  background: var(--color-accent);
}

.theme-toggle-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-muted);
}
</style>

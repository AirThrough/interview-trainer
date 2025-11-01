<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <RouterLink to="/docs" class="logo">Interview Trainer</RouterLink>
    <nav class="nav">
      <RouterLink to="/train" class="nav-link">Train</RouterLink>
      <RouterLink to="/docs" class="nav-link">Docs</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.logo {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
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
</style>

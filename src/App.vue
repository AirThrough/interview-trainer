<script setup lang="ts">
import { RouterView } from 'vue-router'

import { AppHeader } from '@/widgets/header'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
}

.main {
  display: flex;
  flex: 1;
  min-height: 0;
}

.main > * {
  flex: 1;
  min-width: 0;
}
</style>

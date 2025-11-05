<template>
  <svg
    class="logo-mark"
    viewBox="0 0 132 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <text class="logo-text" x="0" y="16">
      <tspan class="logo-name">drill</tspan>
      <tspan class="logo-mid">(j)(s)</tspan>
      <tspan class="logo-ext">.ts</tspan>
    </text>
  </svg>
</template>

<style scoped>
.logo-mark {
  display: block;
}

.logo-text {
  font-family:
    ui-monospace,
    'SF Mono',
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.logo-name {
  fill: currentColor;
}

.logo-mid {
  fill: var(--color-text-muted);
  font-weight: 500;
}

.logo-ext {
  fill: var(--color-accent);
  font-weight: 600;
}
</style>

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import App from '../App.vue'
import router from '@/app/router'

describe('App', () => {
  it('mounts and renders header navigation', async () => {
    await router.push('/docs')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('drill(j)(s).ts')
    expect(wrapper.text()).toContain('Train')
    expect(wrapper.text()).toContain('Docs')
  })
})

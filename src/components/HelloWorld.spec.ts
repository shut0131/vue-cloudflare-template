import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.text()).toContain('Hello from Vue 3!')
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mount(HelloWorld)
    const button = wrapper.find('button')
    
    expect(button.text()).toBe('Count is: 0')
    
    await button.trigger('click')
    expect(button.text()).toBe('Count is: 1')
    
    await button.trigger('click')
    expect(button.text()).toBe('Count is: 2')
  })

  it('displays the correct list items', () => {
    const wrapper = mount(HelloWorld)
    const listItems = wrapper.findAll('li')
    
    expect(listItems).toHaveLength(5)
    expect(listItems[0].text()).toContain('Vue 3 with Composition API')
    expect(listItems[1].text()).toContain('Cloudflare Workers deployment')
    expect(listItems[2].text()).toContain('D1 Database integration')
    expect(listItems[3].text()).toContain('Dark/Light theme support')
    expect(listItems[4].text()).toContain('User session management')
  })
})
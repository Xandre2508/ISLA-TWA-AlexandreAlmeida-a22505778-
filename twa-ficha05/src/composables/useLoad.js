import { ref, onMounted } from 'vue'

export function useLoad() {
  const items = ref([])
  const status = ref('loading') // 'loading', 'loaded', 'error'

  const load = async () => {
    status.value = 'loading'
    try {
      const res = await fetch('/items.json')
      if (res.ok) {
        items.value = await res.json()
        status.value = 'loaded'
      } else {
        status.value = 'error'
      }
    } catch (err) {
      status.value = 'error'
    }
  }

  // Substitui a chamada solta da Ficha 04
  onMounted(() => {
    load()
  })

  return { items, status, load }
}
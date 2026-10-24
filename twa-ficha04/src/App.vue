<script setup>
import { ref, computed } from 'vue'

// 1. Um ref por campo do estado
const items = ref([])
const status = ref('loading') // Estados: 'loading', 'loaded', 'error'
const search = ref('')
const category = ref('')
const sortAsc = ref(true)
const selectedId = ref(null)

// 2. load() com fetch + res.ok e os três estados a escrever nos refs
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
// Invocar a função (sem render() manual)
load()

// 3. Três computed properties (visible, cats, selected)
const cats = computed(() => {
  const categories = items.value.map(item => item.category)
  return [...new Set(categories)] // Remove duplicados
})

const visible = computed(() => {
  let filtered = items.value.filter(item =>
    item.title.toLowerCase().includes(search.value.toLowerCase()) &&
    (category.value === '' || item.category === category.value)
  )
  return filtered.sort((a, b) => {
    if (sortAsc.value) return a.price - b.price
    return b.price - a.price
  })
})

const selected = computed(() =>
  items.value.find(item => item.id === selectedId.value)
)
</script>

<template>
  <main class="container">
    <!-- Estados de carregamento com v-if / v-else-if / v-else -->
    <div v-if="status === 'loading'" class="msg">A carregar catálogo...</div>
    <div v-else-if="status === 'error'" class="msg error">Erro ao obter os dados!</div>
    
    <div v-else>
      <header class="filters">
        <!-- v-model na pesquisa e no select -->
        <input v-model="search" type="text" placeholder="Pesquisar itens..." />
        
        <select v-model="category">
          <option value="">Todas as categorias</option>
          <option v-for="cat in cats" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <!-- @click na ordenação -->
        <button @click="sortAsc = !sortAsc">
          Ordenar Preço ({{ sortAsc ? '▲' : '▼' }})
        </button>
      </header>

      <div class="content">
        <!-- Lista de itens com v-for + :key -->
        <ul class="item-list">
          <li 
            v-for="item in visible" 
            :key="item.id" 
            @click="selectedId = item.id"
            :class="{ active: selectedId === item.id }"
          >
            {{ item.title }} - {{ item.price }}€
          </li>
        </ul>

        <!-- Detalhe do item selecionado -->
        <div v-if="selected" class="item-detail">
          <h2>{{ selected.title }}</h2>
          <p><strong>Categoria:</strong> {{ selected.category }}</p>
          <p><strong>Preço:</strong> {{ selected.price }}€</p>
          <!-- Integração do check.js pode ser feita aqui, se aplicável aos dados -->
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}
.msg { padding: 2rem; text-align: center; }
.error { color: red; }
.filters { display: flex; gap: 1rem; margin-bottom: 2rem; }
.content { display: flex; gap: 2rem; }
.item-list { flex: 1; list-style: none; padding: 0; }
.item-list li { 
  padding: 0.5rem; 
  cursor: pointer; 
  border-bottom: 1px solid #eee;
}
.item-list li:hover { background-color: #f9f9f9; }
.item-list li.active { font-weight: bold; background-color: #e0f7fa; }
.item-detail { flex: 1; padding: 1rem; border: 1px solid #ccc; border-radius: 8px; }
</style>
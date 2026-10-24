<script setup>
import { ref, computed, watch } from 'vue'
import { useLoad } from './composables/useLoad'
import ItemList from './components/ItemList.vue'
import ItemDetail from './components/ItemDetail.vue'
import ItemForm from './components/ItemForm.vue'

// Extrair estados da API
const { items, status } = useLoad()

// Bónus: inicializar pesquisa via localStorage
const search = ref(localStorage.getItem('searchQuery') || '')
const category = ref('')
const selectedId = ref(null)

// Computed de categorias únicas e itens visíveis
const cats = computed(() => [...new Set(items.value.map(i => i.category))])
const visible = computed(() => {
  return items.value.filter(item =>
    item.title.toLowerCase().includes(search.value.toLowerCase()) &&
    (category.value === '' || item.category === category.value)
  )
})
const selected = computed(() => items.value.find(i => i.id === selectedId.value))

// Requisito: watch que limpa a seleção ao pesquisar
// Bónus: watch que guarda a pesquisa no localStorage
watch(search, (newVal) => {
  selectedId.value = null
  localStorage.setItem('searchQuery', newVal)
})

// Pai faz o push do novo item e gera ID
const handleSave = (newItem) => {
  const maxId = items.value.length > 0 ? Math.max(...items.value.map(i => i.id)) : 0
  newItem.id = maxId + 1
  items.value.push(newItem)
}
</script>

<template>
  <main class="container">
    <div v-if="status === 'loading'">A carregar catálogo...</div>
    <div v-else-if="status === 'error'">Erro ao carregar dados.</div>
    
    <div v-else>
      <header class="filters">
        <input v-model="search" type="text" placeholder="Pesquisar..." />
        <select v-model="category">
          <option value="">Todas</option>
          <option v-for="cat in cats" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </header>

      <div class="content">
        <div class="col">
          <ItemList :items="visible" :selectedId="selectedId" @select="id => selectedId = id" />
          <ItemForm @save="handleSave" />
        </div>
        
        <div class="col">
          <ItemDetail v-if="selected" :item="selected">
            <!-- Bónus: conteúdo renderizado dentro do <slot> -->
            <p style="color: gray; font-size: 0.8rem;">ID de Referência: {{ selected.id }}</p>
          </ItemDetail>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container { max-width: 900px; margin: 0 auto; font-family: sans-serif; }
.filters { display: flex; gap: 1rem; margin-bottom: 2rem; }
.content { display: flex; gap: 2rem; }
.col { flex: 1; }
</style>
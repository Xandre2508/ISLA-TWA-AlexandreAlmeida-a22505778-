<script setup>
import { reactive, computed } from 'vue'

const emit = defineEmits(['save'])

// Rascunho com reactive (dados mutáveis locais)
const draft = reactive({
  title: '',
  category: '',
  price: null
})

// Validações calculadas
const errors = computed(() => {
  const errs = []
  if (!draft.title || draft.title.length < 3) errs.push('Título deve ter pelo menos 3 letras.')
  if (!draft.price || draft.price <= 0) errs.push('Preço deve ser maior que 0.')
  if (!draft.category) errs.push('Escolhe uma categoria.')
  return errs
})

const isValid = computed(() => errors.value.length === 0)

const submit = () => {
  if (isValid.value) {
    // Passa uma cópia dos dados para não enviar a referência do reactive
    emit('save', { ...draft })
    // Limpar o formulário
    draft.title = ''
    draft.category = ''
    draft.price = null
  }
}
</script>

<template>
  <!-- @submit.prevent evita o reload da página -->
  <form @submit.prevent="submit" class="item-form">
    <h3>Novo Item</h3>
    
    <div>
      <label>Título: </label>
      <input v-model.trim="draft.title" type="text" required minlength="3" />
    </div>

    <div>
      <label>Categoria: </label>
      <select v-model="draft.category" required>
        <option value="" disabled>Selecionar...</option>
        <option value="Smartphones">Smartphones</option>
        <option value="Laptops">Laptops</option>
        <option value="Acessórios">Acessórios</option>
      </select>
    </div>

    <div>
      <label>Preço: </label>
      <input v-model.number="draft.price" type="number" step="0.01" min="0.01" required />
    </div>

    <ul v-if="!isValid" class="errors">
      <li v-for="err in errors" :key="err">{{ err }}</li>
    </ul>

    <button type="submit" :disabled="!isValid">Guardar Item</button>
  </form>
</template>

<style scoped>
.item-form { padding: 1rem; border: 1px dashed #999; margin-top: 1rem; }
.errors { color: red; font-size: 0.9em; }
</style>
<script setup>
// Props apenas de leitura; os dados pertencem ao pai (App.vue)
defineProps({
  items: {
    type: Array,
    required: true
  },
  selectedId: Number
})

const emit = defineEmits(['select'])
</script>

<template>
  <ul class="item-list">
    <li 
      v-for="item in items" 
      :key="item.id"
      :class="{ active: item.id === selectedId }"
      @click="emit('select', item.id)"
    >
      {{ item.title }} - {{ item.price }}€
    </li>
  </ul>
</template>

<style scoped>
.item-list { list-style: none; padding: 0; }
.item-list li { padding: 0.5rem; cursor: pointer; border-bottom: 1px solid #eee; }
.item-list li:hover { background-color: #f9f9f9; }
.item-list li.active { font-weight: bold; background-color: #e0f7fa; }
</style>
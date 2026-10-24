<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
// Bónus de slot implementado aqui: permite injetar conteúdo extra a partir do pai
</script>

<template>
  <div class="item-detail">
    <h2>{{ item.title }}</h2>
    <p><strong>Categoria:</strong> {{ item.category }}</p>
    <p><strong>Preço:</strong> {{ item.price }}€</p>
    <slot></slot>
  </div>
</template>

<style scoped>
.item-detail { padding: 1rem; border: 1px solid #ccc; border-radius: 8px; }
</style>
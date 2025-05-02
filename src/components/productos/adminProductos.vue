<!-- src/views/AdminProductos.vue -->
<template>
  <div class="admin-productos">
    <h1>Administración de Productos</h1>
    
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'lista' }" 
        @click="activeTab = 'lista'"
      >
        Lista de Productos
      </button>
      <button 
        :class="{ active: activeTab === 'agregar' }" 
        @click="activeTab = 'agregar'"
      >
        Agregar Producto
      </button>
    </div>
    
    <div v-if="activeTab === 'lista'">
      <!-- Aquí iría tu componente de lista de productos -->
      <ListaProductos />
    </div>
    
    <div v-else-if="activeTab === 'agregar'">
      <!-- Aquí va el formulario para agregar productos -->
      <AgregarProductoForm @producto-agregado="handleProductoAgregado" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import agregarProducto from './agregarProducto.vue';
import ProductosList from './ProductosList.vue';

const activeTab = ref('lista');

const handleProductoAgregado = () => {
  // Cambiar a la pestaña de lista después de agregar un producto
  activeTab.value = 'lista';
  // Refrescar la lista de productos si es necesario
}
</script>

<style scoped>
.admin-productos {
  padding: 20px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid #ccc;
  cursor: pointer;
}

.tabs button.active {
  border-bottom: 2px solid #42b883;
  color: #42b883;
}
</style>

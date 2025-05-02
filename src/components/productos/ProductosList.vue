<template>
  <div class="productos-container">
    <h1 class="title">Catálogo de Productos</h1>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando productos...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <i class="error-icon">⚠️</i>
      <p>{{ error }}</p>
      <button class="retry-button" @click="cargarProductos">Reintentar</button>
    </div>
    
    <div v-else>
      <div class="filtros">
        <input type="text" placeholder="Buscar productos..." class="search-input" />
        <select class="filter-select">
          <option value="">Todos los productos</option>
          <option value="electronica">Electrónica</option>
          <option value="ropa">Ropa</option>
          <option value="hogar">Hogar</option>
        </select>
      </div>
      
      <div v-if="productos.length === 0" class="empty-state">
        <i class="empty-icon">📦</i>
        <p>No hay productos disponibles</p>
      </div>
      
      <div v-else class="productos-grid">
        <div v-for="producto in productos" :key="producto.id" class="producto-card">
          <div class="producto-imagen">
            <div v-if="!producto.imagenURL" class="placeholder-image">
              <span>Sin imagen</span>
            </div>
            <img 
              v-else
              :src="producto.imagenURL" 
              :alt="producto.nombre"
              @error="onImageError($event, producto)"
            >
          </div>
          <div class="producto-info">
            <h3 class="producto-nombre">{{ producto.nombre }}</h3>
            <p class="producto-sku">SKU: {{ producto.sku }}</p>
            <p class="producto-descripcion">{{ producto.descripcion || 'Sin descripción disponible' }}</p>
            <div class="producto-footer">
              <p class="precio">€{{ producto.precio.toFixed(2) }}</p>
              <span class="stock" :class="{ 'low-stock': producto.stock && producto.stock < 5 }">
                {{ producto.stock ? `${producto.stock} disponibles` : 'Agotado' }}
              </span>
            </div>
            <button 
              class="add-to-cart-btn" 
              @click="agregarAlCarrito(producto)"
              :disabled="!producto.stock"
            >
              <i class="cart-icon">🛒</i> Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import productoService from '../../api/productoService'
import type { Producto } from '../../interfaces/Producto';

const productos = ref<Producto[]>([]);
const loading = ref(true);
const error = ref('');

// Manejador para errores de carga de imagen
const onImageError = (event: Event, producto: Producto) => {
  // Marcar la URL de la imagen como nula para mostrar el placeholder
  producto.imagenURL = '';
};

// Función para cargar los productos
const cargarProductos = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    let data = await productoService.getProductos();
    
    // Normalizar los datos para asegurarnos de que imagenURL esté correctamente definido
    productos.value = data.map(p => {
      const producto = {...p};
      
      // Asegurarse de que imagenURL esté definido correctamente
      if (!producto.imagenURL && (producto as any).imagenURl) {
        producto.imagenURL = (producto as any).imagenURl;
      }
      
      return producto;
    });
  } catch (err) {
    error.value = 'Error al cargar los productos';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarProductos();
});

const agregarAlCarrito = (producto: Producto) => {
  // Implementar lógica para agregar al carrito
  console.log('Agregando al carrito:', producto);
};
</script>

<style scoped>
.productos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.title:after {
  content: "";
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #42b883, #35495e);
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(66, 184, 131, 0.2);
  border-radius: 50%;
  border-top-color: #42b883;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error state */
.error-container {
  text-align: center;
  padding: 2rem;
  background-color: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fee2e2;
  color: #ef4444;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #dc2626;
}

/* Filters */
.filtros {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-input, .filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input {
  flex-grow: 1;
}

.search-input:focus, .filter-select:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #f8fafc;
  border-radius: 8px;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Products grid - Modificado para garantizar disposición horizontal */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Muestra 3 productos por fila */
  gap: 2rem;
  width: 100%;
}

.producto-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.producto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.producto-imagen {
  height: 250px; /* Altura fija para todas las imágenes */
  overflow: hidden;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Para mejor control del contenido */
}

.producto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.producto-card:hover .producto-imagen img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  color: #94a3b8;
  font-size: 1rem;
}

.placeholder-image span {
  padding: 1rem;
  text-align: center;
}

.producto-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Permite que la información ocupe todo el espacio disponible */
}

.producto-nombre {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.producto-sku {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.producto-descripcion {
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1; /* Permite que la descripción ocupe el espacio disponible */
}

.producto-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.precio {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.stock {
  font-size: 0.875rem;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.low-stock {
  color: #f59e0b;
  background-color: #fef3c7;
}

.add-to-cart-btn {
  width: 100%;
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  margin-top: auto; /* Empuja el botón hacia abajo */
}

.add-to-cart-btn:hover {
  background-color: #3aa876;
}

.add-to-cart-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.cart-icon {
  font-size: 1.25rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .productos-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 productos por fila en tablets */
  }
}

@media (max-width: 768px) {
  .productos-container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .filtros {
    flex-direction: column;
  }
  
  .productos-grid {
    grid-template-columns: 1fr; /* 1 producto por fila en móviles */
    gap: 1rem;
  }
}
</style>


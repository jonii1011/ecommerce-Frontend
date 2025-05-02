<script setup lang="ts">
import { ref, onMounted } from 'vue';
import productoService from '../api/productoService';
import { type Producto } from '../interfaces/Producto';
import { useRouter } from 'vue-router';

const router = useRouter();
const productosDestacados = ref<Producto[]>([]);
const loading = ref(true);
const error = ref('');

// Manejador para errores de carga de imagen
const onImageError = (event: Event, producto: Producto) => {
  producto.imagenURL = '';
};

// Función para cargar los productos destacados
const cargarProductosDestacados = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Obtenemos todos los productos
    const productos = await productoService.getProductos();
    
    // Normalizamos los datos
    const productosNormalizados = productos.map(p => {
      const producto = {...p};
      
      // Asegurarse de que imagenURL esté definido correctamente
      if (!producto.imagenURL && (producto as any).imagenURl) {
        producto.imagenURL = (producto as any).imagenURl;
      }
      
      return producto;
    });
    
    // Seleccionamos solo los primeros 3 productos (o los que quieras destacar)
    // Puedes implementar otra lógica para seleccionar productos destacados
    productosDestacados.value = productosNormalizados.slice(0, 3);
  } catch (err) {
    error.value = 'Error al cargar los productos destacados';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Navegar al detalle del producto
const verDetallesProducto = (productoId: number) => {
  router.push(`/productos/${productoId}`);
};

onMounted(() => {
  cargarProductosDestacados();
});
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <!-- Sección de productos destacados -->
      <section class="featured-products">
        <h2 class="section-title">Productos Destacados</h2>
        
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Cargando productos destacados...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <i class="error-icon">⚠️</i>
          <p>{{ error }}</p>
          <button class="retry-button" @click="cargarProductosDestacados">Reintentar</button>
        </div>
        
        <div v-else-if="productosDestacados.length === 0" class="empty-state">
          <i class="empty-icon">📦</i>
          <p>No hay productos destacados disponibles</p>
        </div>
        
        <div v-else class="products-grid">
          <div v-for="producto in productosDestacados" :key="producto.id" class="product-card">
            <div class="product-image-container">
              <div v-if="!producto.imagenURL" class="placeholder-image">
                <span>Sin imagen</span>
              </div>
              <img 
                v-else
                :src="producto.imagenURL" 
                :alt="producto.nombre"
                class="product-image"
                @error="onImageError($event, producto)"
              >
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ producto.nombre }}</h3>
              <p class="product-sku">SKU: {{ producto.sku }}</p>
              <p class="product-description">{{ producto.descripcion || 'Sin descripción disponible' }}</p>
              <p class="product-price">€{{ producto.precio.toFixed(2) }}</p>
              <span class="stock-info" :class="{ 'low-stock': producto.stock && producto.stock < 5 }">
                {{ producto.stock ? `${producto.stock} disponibles` : 'Agotado' }}
              </span>
              <button 
                class="btn-primary" 
                @click="verDetallesProducto(producto.id)"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Estilos para la sección de productos destacados */
.featured-products {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #8d8d8d;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background-color: #000000;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.product-image-container {
  height: 200px;
  overflow: hidden;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
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

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.product-sku {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
}

.stock-info {
  font-size: 0.875rem;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
}

.low-stock {
  color: #f59e0b;
  background-color: #fef3c7;
}

.btn-primary {
  background-color: #000000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  margin-top: auto;
  width: 100%;
}

.btn-primary:hover {
  background-color: #333333;
}

/* Estados de carga y error */
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
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #000000;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import productoService from '../../api/productoService';
import type { Producto } from '../../interfaces/Producto';

const route = useRoute();
const router = useRouter();
const producto = ref<Producto | null>(null);
const loading = ref(true);
const error = ref('');
const cantidad = ref(1);

// Obtener el ID del producto de los parámetros de la ruta
const productoId = computed(() => {
  const id = Number(route.params.id);
  return isNaN(id) ? null : id;
});

// Cargar los detalles del producto
const cargarProducto = async () => {
  if (!productoId.value) {
    error.value = 'ID de producto no válido';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const data = await productoService.getProducto(productoId.value);
    
    // Normalizar los datos
    if (!data.imagenURL && (data as any).imagenURl) {
      data.imagenURL = (data as any).imagenURl;
    }
    
    producto.value = data;
  } catch (err) {
    console.error('Error al cargar el producto:', err);
    error.value = 'No se pudo cargar la información del producto';
  } finally {
    loading.value = false;
  }
};

// Manejar error de carga de imagen
const onImageError = () => {
  if (producto.value) {
    producto.value.imagenURL = '';
  }
};

// Incrementar cantidad
const incrementarCantidad = () => {
  if (producto.value && cantidad.value < (producto.value.stock || 0)) {
    cantidad.value++;
  }
};

// Decrementar cantidad
const decrementarCantidad = () => {
  if (cantidad.value > 1) {
    cantidad.value--;
  }
};

// Agregar al carrito
const agregarAlCarrito = () => {
  if (!producto.value) return;
  
  // Aquí implementarías la lógica para agregar al carrito
  console.log(`Agregando ${cantidad.value} unidad(es) del producto ${producto.value.id} al carrito`);
  
  // Ejemplo de notificación (puedes implementar un sistema de notificaciones real)
  alert(`${cantidad.value} unidad(es) de ${producto.value.nombre} agregado(s) al carrito`);
};

// Volver a la página anterior
const volverAtras = () => {
  router.back();
};

onMounted(() => {
  cargarProducto();
});
</script>

<template>
  <div class="producto-detalle-container">
    <!-- Botón para volver atrás -->
    <button @click="volverAtras" class="back-button">
      ← Volver
    </button>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando detalles del producto...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <i class="error-icon">⚠️</i>
      <p>{{ error }}</p>
      <button class="retry-button" @click="cargarProducto">Reintentar</button>
    </div>
    
    <div v-else-if="!producto" class="not-found-container">
      <i class="not-found-icon">🔍</i>
      <h2>Producto no encontrado</h2>
      <p>El producto que buscas no existe o ha sido eliminado.</p>
      <button @click="volverAtras" class="btn-primary">Volver al catálogo</button>
    </div>
    
    <div v-else class="producto-content">
      <div class="producto-grid">
        <!-- Columna de la imagen -->
        <div class="producto-imagen-container">
          <div v-if="!producto.imagenURL" class="placeholder-image large">
            <span>Sin imagen disponible</span>
          </div>
          <img 
            v-else 
            :src="producto.imagenURL" 
            :alt="producto.nombre" 
            class="producto-imagen"
            @error="onImageError"
          >
        </div>
        
        <!-- Columna de la información -->
        <div class="producto-info">
          <h1 class="producto-nombre">{{ producto.nombre }}</h1>
          
          <div class="producto-meta">
            <span class="producto-sku">SKU: {{ producto.sku }}</span>
            <span 
              class="producto-stock" 
              :class="{ 
                'en-stock': producto.stock && producto.stock > 5,
                'bajo-stock': producto.stock && producto.stock <= 5,
                'sin-stock': !producto.stock
              }"
            >
              {{ producto.stock ? `${producto.stock} disponibles` : 'Agotado' }}
            </span>
          </div>
          
          <div class="producto-precio">
            <span class="precio-actual">€{{ producto.precio.toFixed(2) }}</span>
          </div>
          
          <div class="producto-descripcion">
            <h3>Descripción</h3>
            <p v-if="producto.descripcion">{{ producto.descripcion }}</p>
            <p v-else>No hay descripción disponible para este producto.</p>
          </div>
          
          <div class="producto-acciones">
            <div class="cantidad-selector" v-if="producto.stock">
              <button 
                @click="decrementarCantidad" 
                class="cantidad-btn"
                :disabled="cantidad <= 1"
              >
                −
              </button>
              <span class="cantidad">{{ cantidad }}</span>
              <button 
                @click="incrementarCantidad" 
                class="cantidad-btn"
                :disabled="cantidad >= producto.stock"
              >
                +
              </button>
            </div>
            
            <button 
              @click="agregarAlCarrito" 
              class="agregar-carrito-btn"
              :disabled="!producto.stock"
            >
              <i class="cart-icon">🛒</i>
              {{ producto.stock ? 'Agregar al carrito' : 'Producto agotado' }}
            </button>
          </div>
          
          <div class="producto-adicional">
            <div class="entrega-info">
              <i class="entrega-icon">🚚</i>
              <span>Envío gratuito en pedidos superiores a €50</span>
            </div>
            
            <div class="garantia-info">
              <i class="garantia-icon">🔄</i>
              <span>Garantía de devolución de 30 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.producto-detalle-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333333;
}

.back-button {
  background: none;
  border: none;
  color: #666666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.back-button:hover {
  color: #333333;
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
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #666666;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error state */
.error-container, .not-found-container {
  text-align: center;
  padding: 3rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.error-container {
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  color: #666666;
}

.not-found-container {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #666666;
}

.error-icon, .not-found-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.retry-button {
  background-color: #666666;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #444444;
}

/* Contenido del producto */
.producto-content {
  margin-top: 1rem;
}

.producto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* Columna de la imagen */
.producto-imagen-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
}

.producto-imagen {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder-image.large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999999;
  font-size: 1.25rem;
}

/* Columna de la información */
.producto-info {
  display: flex;
  flex-direction: column;
}

.producto-nombre {
  font-size: 2.25rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.producto-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.producto-sku {
  color: #777777;
  font-size: 0.875rem;
}

.producto-stock {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.en-stock {
  background-color: #f0f0f0;
  color: #444444;
}

.bajo-stock {
  background-color: #f0f0f0;
  color: #666666;
}

.sin-stock {
  background-color: #e0e0e0;
  color: #777777;
}

.producto-precio {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
}

.precio-actual {
  font-size: 2rem;
  font-weight: 700;
  color: #333333;
}

.precio-anterior {
  font-size: 1.25rem;
  color: #999999;
  text-decoration: line-through;
}

.producto-descripcion, .producto-caracteristicas {
  margin-bottom: 2rem;
}

.producto-descripcion h3, .producto-caracteristicas h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #444444;
}

.producto-descripcion p {
  color: #555555;
  line-height: 1.6;
  margin: 0;
}

.producto-caracteristicas ul {
  padding-left: 1.5rem;
  margin: 0;
}

.producto-caracteristicas li {
  color: #555555;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.producto-acciones {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cantidad-selector {
  display: flex;
  align-items: center;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  overflow: hidden;
}

.cantidad-btn {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #444444;
}

.cantidad-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.cantidad-btn:disabled {
  color: #cccccc;
  cursor: not-allowed;
}

.cantidad {
  width: 40px;
  text-align: center;
  font-weight: 500;
  color: #333333;
}

.agregar-carrito-btn {
  flex: 1;
  background-color: #444444;
  color: white;
  border: none;
  padding: 0 1.5rem;
  height: 40px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.agregar-carrito-btn:hover:not(:disabled) {
  background-color: #333333;
}

.agregar-carrito-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cart-icon {
  font-size: 1.25rem;
}

.producto-adicional {
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.entrega-info, .garantia-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #777777;
}

.entrega-icon, .garantia-icon {
  font-size: 1.25rem;
}

/* Botón primario para casos como "Volver al catálogo" */
.btn-primary {
  background-color: #777777;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #333333;
}

/* Responsive */
@media (max-width: 768px) {
  .producto-detalle-container {
    padding: 1rem;
  }
  
  .producto-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .producto-imagen-container {
    height: 350px;
  }
  
  .producto-nombre {
    font-size: 1.75rem;
  }
  
  .precio-actual {
    font-size: 1.5rem;
  }
  
  .producto-acciones {
    flex-direction: column;
    align-items: stretch;
  }
  
  .cantidad-selector {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
}
</style>


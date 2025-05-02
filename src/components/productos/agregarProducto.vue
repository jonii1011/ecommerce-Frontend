<template>
  <div class="form-container">
    <h2>Agregar Nuevo Producto</h2>
    
    <div v-if="successMessage" class="success-message">
      <p>{{ successMessage }}</p>
    </div>
    
    <form @submit.prevent="guardarProducto">
      <div class="form-row">
        <div class="form-group">
          <label for="nombre">Nombre del producto *</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="producto.nombre" 
            required
            placeholder="Nombre del producto"
          >
          <span v-if="errors.nombre" class="error">{{ errors.nombre }}</span>
        </div>
        
        <div class="form-group">
          <label for="sku">SKU *</label>
          <input 
            type="text" 
            id="sku" 
            v-model="producto.sku" 
            required
            placeholder="SKU"
          >
          <span v-if="errors.sku" class="error">{{ errors.sku }}</span>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="precio">Precio (€) *</label>
          <input 
            type="number" 
            id="precio" 
            v-model.number="producto.precio" 
            step="0.01"
            min="0"
            required
          >
          <span v-if="errors.precio" class="error">{{ errors.precio }}</span>
        </div>
        
        <div class="form-group">
          <label for="stock">Stock</label>
          <input 
            type="number" 
            id="stock" 
            v-model.number="producto.stock" 
            min="0"
          >
          <span v-if="errors.stock" class="error">{{ errors.stock }}</span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="categoria">Categoría</label>
        <select id="categoria" v-model="producto.categoria">
          <option value="">Seleccione una categoría</option>
          <option value="Electrónica">Electrónica</option>
          <option value="Ropa">Ropa</option>
          <option value="Hogar">Hogar</option>
          <option value="Deportes">Deportes</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="fechaElaboracion">Fecha de elaboración</label>
        <input 
          type="date" 
          id="fechaElaboracion" 
          v-model="fechaElaboracionStr"
        >
      </div>
      
      <div class="form-group">
        <label for="imagen">Imagen del producto</label>
        
        <div class="imagen-input-container">
          <!-- Opción para URL -->
          <div class="input-option">
            <input 
              type="radio" 
              id="urlOption" 
              name="imageSource" 
              value="url" 
              v-model="imageSource"
              checked
            >
            <label for="urlOption">URL de imagen</label>
          </div>
          
          <!-- Opción para subir archivo -->
          <div class="input-option">
            <input 
              type="radio" 
              id="fileOption" 
              name="imageSource" 
              value="file" 
              v-model="imageSource"
            >
            <label for="fileOption">Subir imagen</label>
          </div>
        </div>
        
        <!-- Campo para URL -->
        <div v-if="imageSource === 'url'" class="url-input">
          <input 
            type="url" 
            id="imagenURL" 
            v-model="producto.imagenURL"
            placeholder="https://ejemplo.com/imagen.jpg"
            class="form-control"
          >
        </div>
        
        <!-- Campo para subir archivo -->
        <div v-else class="file-input">
          <input 
            type="file" 
            id="imagenFile" 
            @change="handleImageUpload"
            accept="image/*"
            class="form-control"
          >
          <div v-if="isUploading" class="upload-status">
            <p>Subiendo imagen... {{ uploadProgress }}%</p>
          </div>
        </div>
        
        <!-- Vista previa de la imagen -->
        <div v-if="imagenPreview" class="imagen-preview">
          <img :src="imagenPreview" alt="Vista previa de la imagen" />
          <button type="button" class="btn-eliminar" @click="eliminarImagen">×</button>
        </div>
      </div>
      
      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea 
          id="descripcion" 
          v-model="producto.descripcion" 
          rows="4"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="limpiarFormulario">Cancelar</button>
        <button type="submit" :disabled="isSubmitting || isUploading">
          {{ isSubmitting ? 'Guardando...' : 'Guardar Producto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import productoService from '../../api/productoService';
import fileService from '../../api/fileService'; // Importar el servicio de archivos
import type { Producto } from '../../interfaces/Producto';
import axios from 'axios';

// Estado del formulario
const producto = ref<Producto>({
  nombre: '',
  sku: '',
  precio: 0,
  descripcion: '',
  stock: 0,
  imagenURL: '',
  categoria: '',
  fechaElaboracion: undefined,
  borrado: false
});

// Para manejar el tipo de entrada de imagen
const imageSource = ref('url');
const imagenPreview = ref('');
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const uploadProgress = ref(0);

// Vigilar cambios en la URL de la imagen
watch(() => producto.value.imagenURL, (newUrl) => {
  if (newUrl) {
    imagenPreview.value = newUrl;
  }
});

// Manejar la subida de archivos
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    selectedFile.value = file;
    
    // Crear una URL para la vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      imagenPreview.value = result;
      // No asignamos al producto.imagenURL aquí, lo haremos después de subir al servidor
    };
    reader.readAsDataURL(file);
  }
};

// Eliminar la imagen seleccionada
const eliminarImagen = () => {
  producto.value.imagenURL = '';
  imagenPreview.value = '';
  selectedFile.value = null;
  
  // Resetear el input file si es necesario
  const fileInput = document.getElementById('imagenFile') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

const fechaElaboracionStr = computed({
  get() {
    if (!producto.value.fechaElaboracion) return '';
    const fecha = new Date(producto.value.fechaElaboracion);
    return fecha.toISOString().split('T')[0];
  },
  set(value: string) {
    if (value) {
      producto.value.fechaElaboracion = new Date(value);
    } else {
      producto.value.fechaElaboracion = undefined;
    }
  }
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const successMessage = ref('');

// Validación del formulario
const validarFormulario = (): boolean => {
  errors.value = {};
  let isValid = true;
  
  if (!producto.value.nombre || producto.value.nombre.trim() === '') {
    errors.value.nombre = 'El nombre del producto es obligatorio';
    isValid = false;
  }
  
  if (!producto.value.sku || producto.value.sku.trim() === '') {
    errors.value.sku = 'El SKU es obligatorio';
    isValid = false;
  }
  
  if (producto.value.precio === undefined || producto.value.precio < 0) {
    errors.value.precio = 'El precio debe ser un valor positivo';
    isValid = false;
  }
  
  if (producto.value.stock !== undefined && producto.value.stock < 0) {
    errors.value.stock = 'El stock no puede ser negativo';
    isValid = false;
  }
  
  return isValid;
};

// Función para subir la imagen al servidor
const uploadImage = async (): Promise<string | null> => {
  if (!selectedFile.value) return null;
  
  isUploading.value = true;
  uploadProgress.value = 0;
  
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    
    const response = await axios.post('http://localhost:8080/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    });
    
    return response.data.url; // Devuelve la URL del servidor
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  } finally {
    isUploading.value = false;
  }
};

// Guardar producto
const guardarProducto = async () => {
  if (!validarFormulario()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Si es una imagen subida, primero la enviamos al servidor
    if (imageSource.value === 'file' && selectedFile.value) {
      const imageUrl = await uploadImage();
      if (imageUrl) {
        producto.value.imagenURL = imageUrl;
      }
    }
    
    const nuevoProducto = await productoService.createProducto(producto.value);
    successMessage.value = `Producto "${nuevoProducto.nombre}" agregado correctamente`;
    limpiarFormulario();
    
    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error: any) {
    console.error('Error al guardar el producto:', error);
    alert('Error al guardar el producto: ' + (error.message || 'Error desconocido'));
  } finally {
    isSubmitting.value = false;
  }
};

// Limpiar formulario
const limpiarFormulario = () => {
  producto.value = {
    nombre: '',
    sku: '',
    precio: 0,
    descripcion: '',
    stock: 0,
    imagenURL: '',
    categoria: '',
    fechaElaboracion: undefined,
    borrado: false
  };
  errors.value = {};
  imagenPreview.value = '';
  imageSource.value = 'url';
  selectedFile.value = null;
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.error {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #42b883;
  color: white;
}

button[type="button"] {
  background-color: #6c757d;
  color: white;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Estilos para el selector de imagen */
.imagen-input-container {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.input-option {
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 5px;
}

.imagen-preview {
  margin-top: 15px;
  position: relative;
  display: inline-block;
  max-width: 200px;
}

.imagen-preview img {
  max-width: 100%;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.btn-eliminar {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-eliminar:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>

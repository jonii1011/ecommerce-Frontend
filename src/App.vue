<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Estado de autenticación
const isLoggedIn = ref(false);
const userName = ref('');
const userRole = ref('');
const router = useRouter();

// Verificar si el usuario es admin
const isAdmin = computed(() => {
  return isLoggedIn.value && userRole.value === 'admin';
});

// Función para cerrar sesión
const logout = () => {
  // Eliminar información de sesión del localStorage
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  userName.value = '';
  userRole.value = '';
  
  // Redirigir al inicio
  router.push('/');
};

// Verificar si hay sesión al cargar la página
onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      isLoggedIn.value = true;
      userName.value = user.name;
      userRole.value = user.role || 'user';
    } catch (e) {
      console.error('Error al parsear datos de usuario:', e);
      localStorage.removeItem('user');
    }
  }
});
</script>

<template>
  <div class="app-container">
    <header class="main-header">
      <div class="header-content">
        <div class="logo-container">
          <img src="../src/assets/impp.jpg" alt="Logo" class="logo vue" />
        </div>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <router-link to="/productos" class="nav-link">Productos</router-link>
          <!-- Mostrar "Agregar Producto" solo si el usuario es admin -->
          <router-link v-if="isAdmin" to="/productos/agregar" class="nav-link">Agregar Producto</router-link>
          
          <!-- Enlaces de autenticación -->
          <div class="auth-section">
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="nav-link auth-link">Iniciar Sesión</router-link>
              <router-link to="/registro" class="nav-link auth-link register-btn">Registrarse</router-link>
            </template>
            <template v-else>
              <div class="user-menu">
                <span class="welcome-text">Hola, {{ userName }}</span>
                <button @click="logout" class="logout-btn">Cerrar Sesión</button>
              </div>
            </template>
          </div>
        </nav>
      </div>
    </header>
    <div class="content-wrapper">
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
/* Estilos globales para asegurar consistencia */
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 90px; /* Altura fija para el header */
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 80px;
  padding: 5px 5px 5px 0;
  will-change: filter;
  transition: filter 300ms;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #9e9e9e;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #000000;
}

.nav-link.router-link-active {
  color: #000000;
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000000;
}

/* Nuevos estilos para autenticación */
.auth-section {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.auth-link {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.register-btn {
  background-color: #000000;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.register-btn:hover {
  background-color: #333333;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  font-size: 0.9rem;
  color: #555;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid #ccc;
  color: #555;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #f0f0f0;
  border-color: #aaa;
}

.content-wrapper {
  padding-top: 90px; /* Mismo valor que la altura del header */
  width: 100%;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 1rem 2rem;
  }
  
  .main-nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .auth-section {
    margin-left: 0;
    margin-top: 0.5rem;
  }
  
  .user-menu {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .content-wrapper {
    padding-top: 140px; /* Ajustado para headers más altos en móviles */
  }
}
</style>







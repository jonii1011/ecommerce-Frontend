<template>
  <div class="app-container">
    <header class="main-header">
      <div class="header-content">
        <div class="logo-container">
          <!-- Usa la variable importada -->
          <img src="../src/assets/Import-tdf.jpg" alt="Logo" class="logo vue" />
        </div>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <router-link to="/productos" class="nav-link">Productos</router-link>
          <router-link to="/productos/agregar" class="nav-link">Agregar Producto</router-link>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* Los mismos estilos que te proporcioné antes */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 5em;
  padding: 0.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #42b883;
}

.nav-link.router-link-active {
  color: #42b883;
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #42b883;
}

.main-content {
  flex: 1;
  padding: 1rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>



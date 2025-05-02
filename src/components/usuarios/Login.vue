<template>
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required 
              placeholder="ejemplo@correo.com"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required 
              placeholder="Ingresa tu contraseña"
            >
          </div>
          
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe">
            <label for="remember">Recordarme</label>
          </div>
          
          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
        
        <div class="register-link">
          ¿No tienes una cuenta? 
          <router-link to="/registro">Regístrate aquí</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  const errorMessage = ref('');
  const isLoading = ref(false);
  
  const login = async () => {
    // Limpiar mensajes de error previos
    errorMessage.value = '';
    
    try {
      isLoading.value = true;
      
      // Aquí normalmente harías una llamada a una API para autenticar al usuario
      // Por ahora, simularemos un inicio de sesión
      
      // Simulación de tiempo de espera de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Para esta demo, haremos una validación simple
      // En un sistema real, esto se haría en el backend
      
      // Usuario admin para pruebas
      if (email.value === 'admin@example.com' && password.value === 'admin123') {
        const user = {
          name: 'Administrador',
          email: email.value,
          role: 'admin'
        };
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/');
        return;
      }
      
      // Usuario normal para pruebas
      if (email.value === 'user@example.com' && password.value === 'user123') {
        const user = {
          name: 'Usuario Normal',
          email: email.value,
          role: 'user'
        };
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/');
        return;
      }
      
      // Si llegamos aquí, las credenciales son incorrectas
      errorMessage.value = 'Correo electrónico o contraseña incorrectos';
      
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      errorMessage.value = 'Ocurrió un error durante el inicio de sesión. Inténtalo de nuevo.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
  }
  
  .login-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
    text-align: left;
  }
  
  input[type="email"],
  input[type="password"] {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .remember-me label {
    margin: 0;
  }
  
  .login-button {
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 0.5rem;
  }
  
  .login-button:hover:not(:disabled) {
    background-color: #3a7bc8;
  }
  
  .login-button:disabled {
    background-color: #a9c7eb;
    cursor: not-allowed;
  }
  
  .error-message {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 0.8rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .register-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .register-link a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
  </style>
  
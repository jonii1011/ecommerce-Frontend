<template>
    <div class="register-container">
      <div class="register-card">
        <h2>Crear Cuenta</h2>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="register" class="register-form">
          <div class="form-group">
            <label for="name">Nombre completo</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              required 
              placeholder="Ingresa tu nombre"
            >
          </div>
          
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
              placeholder="Mínimo 6 caracteres"
              minlength="6"
            >
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required 
              placeholder="Repite tu contraseña"
            >
          </div>
          
          <button type="submit" class="register-button" :disabled="isLoading">
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>
        
        <div class="login-link">
          ¿Ya tienes una cuenta? 
          <router-link to="/login">Inicia sesión aquí</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const errorMessage = ref('');
  const isLoading = ref(false);
  
  const register = async () => {
    // Limpiar mensajes de error previos
    errorMessage.value = '';
    
    // Validaciones básicas
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Las contraseñas no coinciden';
      return;
    }
    
    if (password.value.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    
    try {
      isLoading.value = true;
      
      // Aquí normalmente harías una llamada a una API para registrar al usuario
      // Por ahora, simularemos un registro exitoso
      
      // Simulación de tiempo de espera de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un caso real, aquí procesarías la respuesta de la API
      
      // Para esta demo, guardaremos el usuario en localStorage
      const newUser = {
        name: name.value,
        email: email.value,
        role: 'user', // Por defecto, los usuarios nuevos no son admin
      };
      
      // En un sistema real, guardarías los usuarios en una base de datos
      // y nunca almacenarías contraseñas en texto plano
      
      // También guardaríamos el usuario actual como "logged in"
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Redirigir al usuario a la página principal
      router.push('/');
      
    } catch (error) {
      console.error('Error durante el registro:', error);
      errorMessage.value = 'Ocurrió un error durante el registro. Inténtalo de nuevo.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
  }
  
  .register-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 450px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .register-form {
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
  
  input {
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
  
  .register-button {
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
  
  .register-button:hover:not(:disabled) {
    background-color: #3a7bc8;
  }
  
  .register-button:disabled {
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
  
  .login-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .login-link a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
  }
  
  .login-link a:hover {
    text-decoration: underline;
  }
  </style>
  
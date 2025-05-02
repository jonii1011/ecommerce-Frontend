import { defineStore } from 'pinia';
import AuthService from '../api/AuthService';
import type { Usuario, LoginCredentials } from '../interfaces/Usuario';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Usuario | null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token')
  }),
  
  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const token = await AuthService.login(credentials);
        this.token = token;
        this.isAuthenticated = true;
        // Aquí podrías decodificar el token para obtener info del usuario
        return true;
      } catch (error) {
        console.error('Error de login:', error);
        return false;
      }
    },
    
    async register(usuario: Usuario) {
      try {
        const newUser = await AuthService.register(usuario);
        return newUser;
      } catch (error) {
        console.error('Error de registro:', error);
        throw error;
      }
    },
    
    logout() {
      AuthService.logout();
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});

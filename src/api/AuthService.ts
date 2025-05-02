import apiClient from './config';
import type { Usuario, LoginCredentials } from '../interfaces/Usuario';

export default {
  login(credentials: LoginCredentials): Promise<string> {
    return apiClient.post('/usuarios/login', credentials)
      .then(response => {
        const token = response.data;
        localStorage.setItem('token', token);
        return token;
      });
  },
  
  register(usuario: Usuario): Promise<Usuario> {
    return apiClient.post('/usuarios/registro', usuario)
      .then(response => response.data);
  },
  
  logout(): void {
    localStorage.removeItem('token');
  },
  
  getUsuarios(): Promise<Usuario[]> {
    return apiClient.get('/usuarios')
      .then(response => response.data);
  },
  
  getUsuario(id: number): Promise<Usuario> {
    return apiClient.get(`/usuarios/${id}`)
      .then(response => response.data);
  },
  
  deleteUsuario(id: number): Promise<void> {
    return apiClient.delete(`/usuarios/${id}`);
  }
};

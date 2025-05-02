import apiClient from './config';
import type { Carrito } from '../interfaces/Carrito';

export default {
  getCarritos(): Promise<Carrito[]> {
    return apiClient.get('/carritos')
      .then(response => response.data);
  },
  
  getCarrito(id: number): Promise<Carrito> {
    return apiClient.get(`/carritos/${id}`)
      .then(response => response.data);
  },
  
  createCarrito(carrito: Carrito): Promise<Carrito> {
    return apiClient.post('/carritos', carrito)
      .then(response => response.data);
  },
  
  deleteCarrito(id: number): Promise<void> {
    return apiClient.delete(`/carritos/${id}`);
  }
};

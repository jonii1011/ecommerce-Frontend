import apiClient from './config';
import type { Producto } from '../interfaces/Producto';

export default {
  getProductos(): Promise<Producto[]> {
    return apiClient.get('/productos')
      .then(response => response.data);
  },
  
  getProducto(id: number): Promise<Producto> {
    return apiClient.get(`/productos/${id}`)
      .then(response => response.data);
  },
  
  createProducto(producto: Producto): Promise<Producto> {
    return apiClient.post('/productos', producto)
      .then(response => response.data);
  },
  
  deleteProducto(id: number): Promise<void> {
    return apiClient.delete(`/productos/${id}`);
  }
};

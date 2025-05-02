import apiClient from './config';
import type { ItemCarrito } from '../interfaces/ItemCarrito';

export default {
  getItemsCarrito(carritoId: number): Promise<ItemCarrito[]> {
    return apiClient.get(`/item-carrito/${carritoId}`)
      .then(response => response.data);
  },
  
  getItemCarrito(carritoId: number, itemId: number): Promise<ItemCarrito> {
    return apiClient.get(`/item-carrito/${carritoId}/item/${itemId}`)
      .then(response => response.data);
  },
  
  addItemCarrito(item: ItemCarrito): Promise<ItemCarrito> {
    return apiClient.post('/item-carrito', item)
      .then(response => response.data);
  },
  
  deleteItemCarrito(id: number): Promise<void> {
    return apiClient.delete(`/item-carrito/${id}`);
  }
};

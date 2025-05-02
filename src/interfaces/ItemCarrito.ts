import type { Carrito } from './Carrito';
import type { Producto } from './Producto';

export interface ItemCarrito {
  id?: number;
  carrito: Carrito;
  producto: Producto;
  cantidad: number;
}

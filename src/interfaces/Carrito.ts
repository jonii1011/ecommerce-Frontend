import type { Usuario } from './Usuario';
import type { ItemCarrito } from './ItemCarrito';

export interface Carrito {
  id?: number;
  usuario: Usuario;
  items?: ItemCarrito[];
}

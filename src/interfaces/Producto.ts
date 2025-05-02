export interface Producto {
    id?: number;
    nombre: string;
    sku: string;
    precio: number;
    descripcion?: string;
    stock?: number;
    imagenURL?: string;
    categoria?: string;
    fechaElaboracion?: Date;
    borrado?: boolean;
  }
  
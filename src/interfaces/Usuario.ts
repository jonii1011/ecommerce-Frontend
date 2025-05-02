export enum Rol {
    USER = "USER",
    ADMIN = "ADMIN"
  }
  
  export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    password?: string;
    rol: Rol;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
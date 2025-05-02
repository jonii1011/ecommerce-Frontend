import { createRouter, createWebHistory } from 'vue-router';
import ProductosList from '../components/productos/ProductosList.vue';
import agregarProducto from '../components/productos/agregarProducto.vue';
import HomeView from '../components/HomeView.vue';
import ProductoDetalle from '../components/productos/ProductoDetalle.vue';
import Login from '../components/usuarios/Login.vue';
import Registro from '../components/usuarios/Registro.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView  // Componente para la página de inicio
  },
  {
    path: '/productos',
    name: 'ProductosLista',
    component: ProductosList
  },
  {
    path: '/productos/agregar',
    name: 'AgregarProducto',
    component: agregarProducto
  },
  {
    path: '/productos/:id', // Nueva ruta para ver el detalle de un producto
    name: 'producto-detalle',
    component: ProductoDetalle
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/registro',
    name: 'registro',
    component: Registro
  },
  // otras rutas...
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

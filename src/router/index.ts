import { createRouter, createWebHistory } from 'vue-router';
import ProductosList from '../components/productos/ProductosList.vue';
import agregarProducto from '../components/productos/agregarProducto.vue';
import HomeView from '../components/HomeView.vue';

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
  // otras rutas...
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

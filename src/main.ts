import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Crear la instancia de la aplicación
const app = createApp(App);

// Registrar el router antes de montar
app.use(router);

// Montar la aplicación
app.mount('#app');


import { createSSRApp } from 'vue';
import App from './App.vue';
import { createWebHistory } from 'vue-router';
import createRouter from './router/index';

const app = createSSRApp(App);
const router = createRouter(createWebHistory(process.env.BASE_URL));

app.use(router);

router.isReady().then(() => {
    app.mount('#app');
});

import { createSSRApp } from 'vue';
import App from './App.vue';
import { createMemoryHistory } from 'vue-router';
import createRouter from './router/index';

export default function () {
    const app = createSSRApp(App);
    const router = createRouter(createMemoryHistory(process.env.BASE_URL));
    app.use(router);
    return { app, router };
}

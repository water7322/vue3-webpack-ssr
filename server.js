const path = require('path');
const fs = require('fs');
const koa = require('koa');
const koaStatic = require('koa-static');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');

const server = new koa();

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js']);
const createApp = require(appPath).default;

server.use(koaStatic(path.resolve(__dirname, './dist/client')));
server.use(async (cts, next) => {
    const { app, router } = createApp();

    await router.push(cts.url);
    await router.isReady();

    const appContent = await renderToString(app);

    fs.readFile(path.join(__dirname, './dist/client/index.html'), (err, html) => {
        if (err) throw err;
        html = html.toString().replace('<div id="app">', `<div id="app">${appContent}`);
        ctx.set('Content-Type', 'text/html');
        ctx.body = html;
    });
});

const port = 3001;
server.listen(port, () => {
    console.log(`You can navigate to http://localhost:${port}`);
});

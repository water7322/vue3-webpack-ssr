const path = require('path');
const fs = require('fs');
const express = require('express');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');

const server = express();

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js']);
const createApp = require(appPath).default;

server.use(express.static(path.resolve(__dirname, './dist/client')));
server.get('*', async (req, res) => {
    const { app, router } = createApp();

    await router.push(req.url);
    await router.isReady();

    const appContent = await renderToString(app);

    fs.readFile(path.join(__dirname, './dist/client/index.html'), (err, html) => {
        if (err) throw err;
        html = html.toString().replace('<div id="app">', `<div id="app">${appContent}`);
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
});

const port = 3002;
server.listen(port, () => {
    console.log(`You can navigate to http://localhost:${port}`);
});

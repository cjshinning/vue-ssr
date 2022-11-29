const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const static = require('koa-static');
const VueServerRenderer = require('vue-server-renderer');

const fs = require('fs');
const path = require('path');
const serverBundle = fs.readFileSync(path.resolve(__dirname, 'dist/server.bundle.js'), 'utf8');
const template = fs.readFileSync(path.resolve(__dirname, 'dist/server.html'), 'utf8');

const render = VueServerRenderer.createBundleRenderer(serverBundle, {
  template
});

router.get('/', async (ctx) => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString({ url: ctx.url }, (err, html) => { //如果想让css生效，就必须使用回调的方式
      if (err) reject(err);
      resolve(html)
    })
  })
  // const html = await render.renderToString();
  // console.log(html)
})

// 当用户访问一个不存在的服务端路径，我就返回首页，你通过前端js渲染的时候，会重新根据路径渲染组件
// 只要用户刷新就会向服务器发请求
router.get('/(.*)', async (ctx) => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString({ url: ctx.url }, (err, html) => { //通过服务端渲染，渲染后返回
      if (err && err.code == 404) resolve('not found');
      resolve(html)
    })
  })
})

// 当客户端发送请求时会先去dist目录下查找
app.use(static(path.resolve(__dirname, 'dist')));
app.use(router.routes());

// 保证先走自己定义的路由 在找静态文件
app.listen(3000);
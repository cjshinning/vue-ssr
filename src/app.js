import Vue from 'vue';
import App from './App.vue';
import createRouter from './router';

// 入口改装成了函数，目的是服务端渲染时，每次访问的时候都可以通过这个工厂函数返回一个全新的实例，保证每个人访问都可以拿到一个自己的实例
export default () => {
  let router = createRouter();
  const app = new Vue({
    router,
    render: h => h(App)
  })

  return { app, router };
}

// new Vue({
//   render: h => h(App)
// }).$mount('#app');

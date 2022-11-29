// 服务端入口

import createApp from './app.js';

// 服务端渲染可以返回一个函数
export default ({ url }) => { //服务端调用方法时会传入url
  // 此方法是在服务端调用的

  return new Promise((resolve, reject) => { //renderToString
    let { app, router } = createApp();
    router.push(url); //表示永远跳转/路径
    router.onReady(() => {  //等待路由跳转完毕，组件已经准备好了触发
      const matchComponents = router.getMatchedComponents();
      if (matchComponents.length == 0) {  //没有匹配到前端路由
        return reject({ code: 404 });
      } else {
        resolve(app)
      }
    })
  })

}

// 当用户访问bar的时候，我在服务端直接进行了服务端渲染，渲染后结果返回给了浏览器，浏览器根据路径加载了js脚本，又重新渲染了bar
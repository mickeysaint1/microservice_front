import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'

Vue.use(Router)

const routers = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    name: 'root',
    component: home
  },
  {
    path: '/home',
    name: 'home',
    component: home
  }
];

const router = new Router({
  routes:routers
});

/**
 * to:表示目标路由
 * from:表示来源路由
 * next:表示执行下一步操作
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') { // 当路由为login时就直接下一步操作
    next();
  } else { // 否则就需要判断
    if(sessionStorage.userData){  // 如果有用户名就进行下一步操作
      next()
    }else{
      next({path: '/login'})  // 没有用户名就跳转到login页面
    }
  }
})

export default router;

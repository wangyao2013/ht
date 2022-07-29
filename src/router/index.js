import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    redirect: "/index",
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }, {
    path: '/login',
    name: 'login',
    meta: {
      flag: false
    },
    component: () => import('../views/Login.vue')
  }, {
    path: '/index',
    name: 'index',
    component: () => import('../views/Index.vue'),
    children: [{
      path: '/Wel',
      name: 'Wel',
      component: () => import('../views/Wel.vue')
    }, {
      path: '/users',
      name: 'users',
      component: () => import('../views/Users.vue')
    }, {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/Roles.vue')
    }, {
      path: '/rights',
      name: 'rights',
      component: () => import('../views/Rights.vue')
    }, {
      path: '/goods',
      name: 'goods',
      component: () => import('../views/Goods.vue')
    }, {
      path: '/addGood',
      name: 'addGood',
      component: () => import('../views/AddGood.vue')
    }, {
      path: '/params',
      name: 'params',
      component: () => import('../views/Params.vue')
    }, {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/categories/index.vue')
    }, {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/reports/index.vue')
    }, {
      path: "/orders",
      name: 'orders',
      component: () => import('../views/orders/index.vue')
    }]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("token")
  if (to.path === "login") {
    next()
  } else {
    if (token !== null && to.path === "/login") {
      next("/users")
    }
    if (token === null && to.path !== "/login") {
      next("/login")
    } else {
      next()
    }
  }
})
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
export default router

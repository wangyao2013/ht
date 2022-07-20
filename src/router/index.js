import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }, {
    path: '/login',
    name: 'Login',
    meta: {
      flag: false
    },
    component: () => import('../views/Login.vue')
  }, {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    children: [{
      path: '/Wel',
      name: 'Wel',
      component: () => import('../views/Wel.vue')
    }, {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Users.vue')
    },{
      path: '/roles',
      name: 'Roles',
      component: () => import('../views/Roles.vue')
    }]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("token")
  if (to.path == "login") {
    next()
  } else {
    if (token != null && to.path == "/login") {
      next("/users")
    }
    if (token == null && to.path != "/login") {
      next("/login")
    } else {
      next()
    }
  }

})
export default router

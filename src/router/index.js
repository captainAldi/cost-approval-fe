import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index'

import Dashboard from '../views/Dashboard.vue'

import AdminBase from '../views/Admin/Base.vue'
import ApproverBase from '../views/Approver/Base.vue'
import UserBase from '../views/User/Base.vue'
import FinanceBase from '../views/Finance/Base.vue'


Vue.use(VueRouter)

const routes = [
   // Dashboard

  {
    path: '/',
    name: 'Dashboard',
    meta: {
      auth: true
    },
    component: Dashboard
  },

  // Admin

  {
    path: '/admin',
    name: 'Admin',
    component: AdminBase,
    meta: {
      auth: true,
      admin: true,
    },
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Admin/Dashboard.vue')
      },
      // Data Pengajuan
      {
        path: 'data/pengajuan',
        name: 'admin-data-pengajuan',
        component: () => import(/* webpackChunkName: "data-pengajuan-admin" */ '../views/Admin/Bill/Table.vue')
      },
    ]
  },

  // Approver

  {
    path: '/approver',
    name: 'Approver',
    component: ApproverBase,
    meta: {
      auth: true,
      approver: true,
    },
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Approver/Dashboard.vue')
      },
      // Data Pengajuan
      {
        path: 'data/pengajuan',
        name: 'approver-data-pengajuan',
        component: () => import(/* webpackChunkName: "data-pengajuan-approver" */ '../views/Approver/Bill/Table.vue')
      },
    ]
  },

  // Finance

  {
    path: '/finance',
    name: 'Finance',
    component: FinanceBase,
    meta: {
      auth: true,
      finance: true,
    },
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Finance/Dashboard.vue')
      },
      // Data Pengajuan
      {
        path: 'data/pengajuan',
        name: 'finance-data-pengajuan',
        component: () => import(/* webpackChunkName: "data-pengajuan-finance" */ '../views/Finance/Bill/Table.vue')
      },
    ]
  },

  // User

  {
    path: '/user',
    name: 'User',
    component: UserBase,
    meta: {
      auth: true,
      user: true
    },
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home-user" */ '../views/User/Dashboard.vue')
      },
      // Data Pengajuan
      {
        path: 'data/pengajuan',
        component: () => import(/* webpackChunkName: "data-pengajuan-user" */ '../views/User/Bill/Table.vue')
      },
    ]
  },

  // Auth

  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Login" */ '../views/Auth/Login.vue')
  },

  {
    path: '/oauth/google/callback',
    name: 'loginGoogle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "LoginGoogle" */ '../views/Auth/LoginGoogle.vue')
  },

  // Approve via Token
  {
    path: '/otr/bill/approve/:token',
    name: 'approve-token',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/BillApproveToken.vue')
  },

  // 404

  {
    path: '*',
    name: 'NotFound',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/NotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // jika routing ada meta auth-nya maka
  if (to.matched.some(record => record.meta.auth)) {
    // jika user adalah guest
    if (store.getters['auth/guest']) {
      // tampilkan pesan bahwa harus login dulu
      store.dispatch('alert/set', {
        status: true,
        text: 'Login first',
        color: 'error',
      })
      // catat link sebelum nya
      store.dispatch('prevUrl/setPrevUrl', to.path)

      //redirect ke form login
      next('/login')
    }
    // Jika Routing ada meta admin-nya maka
    else if (to.matched.some(record => record.meta.admin)) {
      // jika user bukan admin
      if (store.getters['auth/user'].user.role != 'admin') {
        // tampilkan pesan Unauthorized !
        store.dispatch('alert/set', {
          status: true,
          text: 'Bukan Admin!',
          color: 'error',
        })

        //redirect ke dashboard
        next('/')
      } 
      else {
        next()
      }
    }

    // Jika Routing ada meta Approver-nya maka
    else if (to.matched.some(record => record.meta.approver)) {
      // jika user bukan admin
      if (store.getters['auth/user'].user.role != 'approver') {
        // tampilkan pesan Unauthorized !
        store.dispatch('alert/set', {
          status: true,
          text: 'Bukan Approver !',
          color: 'error',
        })

        //redirect ke dashboard
        next('/')
      }
      else {
        next()
      }
    }

    // Jika Routing ada meta Finance-nya maka
    else if (to.matched.some(record => record.meta.finance)) {
      // jika user bukan admin
      if (store.getters['auth/user'].user.role != 'finance') {
        // tampilkan pesan Unauthorized !
        store.dispatch('alert/set', {
          status: true,
          text: 'Bukan Finance !',
          color: 'error',
        })

        //redirect ke dashboard
        next('/')
      }
      else {
        next()
      }
    }

    // Jika Routing ada meta user-nya maka
    else if (to.matched.some(record => record.meta.user)) {
      // jika user bukan admin
      if (store.getters['auth/user'].user.role != 'user') {
        // tampilkan pesan Unauthorized !
        store.dispatch('alert/set', {
          status: true,
          text: 'Wrong Path !',
          color: 'error',
        })

        //redirect ke dashboard
        next('/')
      }
      else {
        next()
      }
    }

    // Bukan auth dan admin lanjut
    else {
      next()
    }
  }
  // Bukan Auth
  else {
    next()
  }
})

export default router

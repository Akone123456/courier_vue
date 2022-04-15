import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "about" */ '../views/admin/Login.vue'),
      meta: {
        keepAlive: false
      }

    },
    {
      path: '/index',
      name: 'index',
      component: () => import(/* webpackChunkName: "about" */ '../views/admin/Login.vue'),
      meta: {
        keepAlive: false
      }

    },

    {
      path: '/Login',
      name: 'Login',
      component: () => import('../views/admin/Login.vue'),
      meta: {
        keepAlive: false
      }

    } ,
    {
      path: '/userLogin',
      name: 'userLogin',
      component: () => import('../views/userinfo/Login.vue'),
      meta: {
        keepAlive: false
      }

    } ,
    {
      path: '/MyCenter',
      name: 'MyCenter',
      component: () => import('../views/userinfo/MyCenter.vue'),
      meta: {
        keepAlive: true
      }

    } ,
    {
      path: '/AdminUsersList',
      name: 'AdminUsersList',
      component: () => import('../views/admin/UsersList.vue'),
      meta: {
        keepAlive: true
      }

    },
    {
      path: '/AdminOrderList',
      name: 'AdminOrderList',
      component: () => import('../views/Sender/OrderList.vue'),
      meta: {
        keepAlive: true
      }

    },
    {
      path: '/AdminSenderList',
      name: 'AdminSenderList',
      component: () => import('../views/admin/SenderList.vue'),
      meta: {
        keepAlive: true
      }

    },


    {
        path: '/AdminUpdatePass',
        name: 'AdminUpdatePass',
        component: () => import('../views/admin/UpdatePass.vue'),
        meta: {
            keepAlive: true
        }

    },

    {
      path: '/PersonCenter',
      name: 'PersonCenter',
      component: () => import('../views/userinfo/PersonCenter/PersonCenter.vue'),
      meta: {
        keepAlive: true
      }
    },

    {
      path: '/AdminCenter',
      name: 'AdminCenter',
      component: () => import('../views/admin/AdminCenter/AdminCenter.vue'),
      meta: {
        keepAlive: true
      }
    },

    {
      path: '/SenderCenter',
      name: 'SenderCenter',
      component: () => import('../views/Sender/SenderCenter/SenderCenter.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/AddressManger',
      name: 'AddressManger',
      component: () => import('../views/userinfo/AddressManger/AddressManger.vue'),
      meta: {
        keepAlive: true
      }
    },




  ],
  mode: 'history'
});
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}
export default router;

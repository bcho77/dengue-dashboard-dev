/**
Author: Jennifer Horstmann
**/

import Vue from "vue/dist/vue.js";
import Router from 'vue-router'
import DashboardLayout from '../layout/DashboardLayout.vue'
import AuthLayout from '../layout/AuthLayout.vue'
import store from '../../store/vuex_usage_utils'


Vue.use(Router)

const routes = [
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "chunk-login" */ "../views/Login.vue"),
        // prevent access to login page if user is logged in
        beforeEnter: (to, from, next) => {
          const token = localStorage.getItem("token");
          if (token) next("/dashboard");
          else next();
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "dashboard",
    component: DashboardLayout,
    children: [
                {
                    path: "/dashboard",
                    name: "dashboard",
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () =>
                        import(/* webpackChunkName: "chunk-dashboard" */ "../views/Dashboard.vue"),
                },
                {
                    path: "/settings",
                    name: "settings",
                    component: () =>
                        import(/* webpackChunkName: "chunk-profile" */ "../views/Settings.vue"),
                },
                {
                    path: "/tables",
                    name: "patient overview",
                    component: () =>
                        import(/* webpackChunkName: "chunk-tables" */ "../views/Tables.vue"),
                },
                {
                    path: "/licenses",
                    name: "licenses",
                    component: () =>
                        import(/* webpackChunkName: "chunk-licenses" */ "../views/Licenses.vue"),
                },
                {
                    path: "/patients/:id",
                    name: "patient report",
                    props: true,
                    component: () =>
                        import(/* webpackChunkName: "chunk-patients" */ "../views/SinglePatient.vue"),
                },
    ],
  },
];

const router = new Router({
  linkExactActiveClass: "active",
  routes,
});

//before every page access check for authorization
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (!token && to.path !== "/login") {
    next("/login");
  } else if(store.getters.token === token) {
    next();
  }
});

export default router;

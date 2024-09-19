// src/router/index.js

import Vue from "vue";
import Router from "vue-router";
import SignUp from "@/components/SignUp.vue";
import AppLogin from "@/components/AppLogin.vue";
import AppDashboard from "@/components/AppDashboard.vue";
import ApiTable from "@/components/ApiTable.vue";
import ProductCard from "@/components/ProductCard.vue";
import ViewDetails from "@/components/ViewDetails.vue"; // Importing the new ViewDetails component

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp,
      meta: { guest: true },
    },
    {
      path: "/login",
      name: "Login",
      component: AppLogin,
      meta: { guest: true },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: AppDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/api-table",
      name: "ApiTable",
      component: ApiTable,
      meta: { requiresAuth: true },
    },
    {
      path: "/product-cards", // Route for product listing
      name: "ProductCard", // The name used in the goBack method
      component: ProductCard,
      meta: { requiresAuth: true },
    },
    {
      path: "/product/:id", // ViewDetails route with dynamic ID
      name: "ViewDetails",
      component: ViewDetails,
      meta: { requiresAuth: true },
    },
    {
      path: "/view-cart",
      name: "ViewCart",
      component: () => import("@/components/ViewCart.vue"),
      props: true, // Pass cart as prop
    },
    {
      path: "/checkout",
      name: "CheckOut",
      component: () => import("@/components/CheckOut.vue"),
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: "/place-order", // New route for PlaceOrder
      name: "PlaceOrder",
      component: () => import("@/components/PlaceOrder.vue"), // Lazy-loaded
      meta: { requiresAuth: true }, // Protected route
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("user");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({ name: "Login" });
    }
  }

  if (to.matched.some((record) => record.meta.guest) && isAuthenticated) {
    if (to.name !== "Dashboard") {
      return next({ name: "Dashboard" });
    }
  }

  next();
});

export default router;

// src/store.js

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
    users: JSON.parse(localStorage.getItem("users")) || [],
    formEntries: [],
    cart: JSON.parse(localStorage.getItem("cart")) || [], // Cart data stored in localStorage
  },
  mutations: {
    // User Management
    SET_USER(state, user) {
      state.currentUser = user;
      localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
    },
    LOGOUT(state) {
      state.currentUser = null;
      localStorage.removeItem("user"); // Remove from localStorage
    },

    // Form Entries Management
    ADD_FORM_ENTRY(state, entry) {
      state.formEntries.push(entry);
    },
    DELETE_FORM_ENTRY(state, index) {
      state.formEntries.splice(index, 1);
    },

    // Cart Management
    ADD_TO_CART(state, product) {
      state.cart.push(product);
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Sync with localStorage
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter((p) => p.id !== productId);
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Sync with localStorage
    },
    CLEAR_CART(state) {
      state.cart = [];
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Sync with localStorage
    },
  },
  actions: {
    // User Actions
    login({ commit }, user) {
      commit("SET_USER", user); // Set user in Vuex
    },
    logout({ commit }) {
      commit("LOGOUT"); // Clear user in Vuex
    },

    // Form Entry Actions
    addFormEntry({ commit }, entry) {
      commit("ADD_FORM_ENTRY", entry);
    },
    deleteFormEntry({ commit }, index) {
      commit("DELETE_FORM_ENTRY", index);
    },

    // Cart Actions
    addToCart({ commit }, product) {
      commit("ADD_TO_CART", product); // Add product to cart
    },
    removeFromCart({ commit }, productId) {
      commit("REMOVE_FROM_CART", productId); // Remove product from cart
    },
    clearCart({ commit }) {
      commit("CLEAR_CART"); // Clear all products from cart
    },
  },
  getters: {
    isInCart: (state) => (productId) => {
      return state.cart.some((product) => product.id === productId);
    },
    cartItemCount: (state) => {
      return state.cart.length;
    },
    cartTotalPrice: (state) => {
      return state.cart.reduce((total, product) => total + product.price, 0);
    },
  },
});

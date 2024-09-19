<template>
  <v-container fluid class="cart-container">
    <!-- Navbar -->
    <v-app-bar color="primary" dark app dense>
      <!-- Back Button -->
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn text>Home</v-btn>

      <v-spacer></v-spacer>

      <!-- Cart Icon with Item Count -->
      <v-btn icon @click="goToCart" class="cart-icon">
        <v-icon>mdi-cart</v-icon>
        <span v-if="cart.length > 0" class="cart-count">{{ cart.length }}</span>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <div class="cart-content">
      <v-row>
        <!-- Cart Items Section -->
        <v-col cols="12" md="8">
          <h2 class="cart-title">Shopping Cart</h2>

          <!-- Cart Items -->
          <v-card
            v-for="(item, index) in cart"
            :key="item.id"
            class="mb-4 cart-item"
          >
            <v-row class="d-flex">
              <v-col cols="4" class="product-image-container">
                <v-img
                  :src="item.image"
                  class="product-image"
                  height="100px"
                  contain
                ></v-img>
              </v-col>
              <v-col cols="8">
                <v-card-title class="product-title">{{
                  item.title
                }}</v-card-title>
                <v-card-subtitle class="product-price"
                  >Price: {{ item.price | currency }}</v-card-subtitle
                >
                <!-- Quantity and Remove Button -->
                <v-card-actions class="cart-actions">
                  <div class="quantity-control">
                    <v-btn icon small @click="updateQuantity(item, index, -1)"
                      >-</v-btn
                    >
                    <span>{{ item.quantity }}</span>
                    <v-btn icon small @click="updateQuantity(item, index, 1)"
                      >+</v-btn
                    >
                  </div>
                  <v-btn
                    small
                    color="error"
                    @click="removeFromCart(item, index)"
                    >Remove</v-btn
                  >
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>

          <!-- Empty Cart Message -->
          <div v-if="cart.length === 0" class="empty-cart">
            <h3>Your cart is empty!</h3>
          </div>
        </v-col>

        <!-- Checkout Section -->
        <v-col cols="12" md="4">
          <v-card class="checkout-card">
            <v-card-text class="checkout-details">
              <h3>Total: {{ totalPrice | currency }}</h3>
              <v-btn
                block
                color="success"
                :disabled="cart.length === 0"
                @click="$router.push({ name: 'CheckOut' })"
              >
                Proceed to Checkout
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      cart: [], // Cart items (initialized as empty, will be loaded from localStorage)
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0; // Ensure price is a valid number
        const quantity = parseInt(item.quantity) || 1; // Ensure quantity is a valid number, default to 1
        return total + price * quantity;
      }, 0);
    },
  },
  methods: {
    goBack() {
      // Go back in history if possible, otherwise go to home
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    goToCart() {
      // Check if the user is already on the cart page
      if (this.$route.name !== "ViewCart") {
        this.$router.push({ name: "ViewCart" });
      }
    },
    loadCartFromLocalStorage() {
      // Load cart data from localStorage when the component is mounted
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        this.cart = JSON.parse(savedCart).map((item) => ({
          ...item,
          price: parseFloat(item.price) || 0, // Ensure price is a number
          quantity: parseInt(item.quantity) || 1, // Ensure quantity is set to 1 by default if not present
        }));
      }
    },
    updateQuantity(item, index, change) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        this.removeFromCart(item, index);
      } else {
        this.cart[index].quantity = newQuantity;
        this.saveCartToLocalStorage(); // Save updated cart to localStorage
      }
    },
    removeFromCart(item, index) {
      this.cart.splice(index, 1);
      this.saveCartToLocalStorage(); // Save updated cart to localStorage
    },
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart)); // Save the updated cart to localStorage
    },
    checkout() {
      alert("Proceeding to checkout...");
    },
  },
  mounted() {
    this.loadCartFromLocalStorage(); // Load cart data from localStorage when component is mounted
  },
  filters: {
    currency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
/* Container Styling */
.cart-container {
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  min-height: 100vh;
}

/* Navbar Styling */
.v-app-bar {
  box-shadow: none;
}

/* Cart Content */
.cart-content {
  padding: 20px;
}

/* Cart Title */
.cart-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: bold;
}

/* Cart Item Styling */
.cart-item {
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  display: flex;
}

/* Product Image */
.product-image-container {
  display: flex;
  align-items: center;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

/* Product Info */
.product-title {
  font-size: 1.2rem;
  font-weight: 500;
}

.product-price {
  font-size: 1rem;
  color: gray;
}

/* Quantity Control and Actions */
.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-control span {
  padding: 0 10px;
  font-weight: bold;
}

/* Checkout Section */
.checkout-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: sticky;
  top: 100px;
}

.checkout-details {
  text-align: center;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: gray;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-title {
    font-size: 1rem;
  }

  .product-price {
    font-size: 0.9rem;
  }

  .checkout-card {
    position: static;
    margin-top: 20px;
  }

  .v-app-bar {
    padding: 5px;
  }
}
</style>

<template>
  <v-container fluid class="checkout-container">
    <v-app-bar color="primary" dark app dense>
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn text>Shopping Cart</v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="goToCart" class="cart-icon">
        <v-icon>mdi-cart</v-icon>
        <span v-if="cart.length > 0" class="cart-count">{{ cart.length }}</span>
      </v-btn>
    </v-app-bar>

    <!-- Checkout Content -->
    <v-row>
      <v-col cols="12" md="8">
        <!-- Shipping Address -->
        <v-card class="mb-4">
          <v-card-title>Shipping Address</v-card-title>
          <v-card-text>
            <v-form ref="shippingForm">
              <v-text-field
                v-model="shippingAddress.name"
                label="Full Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="shippingAddress.email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="shippingAddress.address"
                label="Street Address"
                required
              ></v-text-field>
              <v-text-field
                v-model="shippingAddress.city"
                label="City"
                required
              ></v-text-field>
              <v-text-field
                v-model="shippingAddress.zip"
                label="Zip Code"
                required
              ></v-text-field>
              <v-text-field
                v-model="shippingAddress.country"
                label="Country"
                required
              ></v-text-field>
              <v-btn @click="saveAddress" color="primary">Save Address</v-btn>
              <v-btn @click="editAddress" color="warning" v-if="addressSaved">
                Edit Address
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Payment Method -->
        <v-card class="mb-4">
          <v-card-title>Payment Method</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="paymentDetails.cardNumber"
              label="Card Number"
              required
            ></v-text-field>
            <v-text-field
              v-model="paymentDetails.expiry"
              label="Expiry Date"
              required
            ></v-text-field>
            <v-text-field
              v-model="paymentDetails.cvc"
              label="CVC"
              required
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Order Summary -->
      <v-col cols="12" md="4">
        <v-card class="summary-card">
          <v-card-title>Order Summary</v-card-title>
          <v-card-text>
            <div v-for="item in cart" :key="item.id" class="summary-item">
              <v-img :src="item.image" height="50" width="50" contain></v-img>
              <div class="summary-details">
                <p class="item-title">{{ item.title }}</p>
                <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                <p class="item-price">Price: {{ item.price | currency }}</p>
              </div>
            </div>
            <hr />
            <h3>Total: {{ totalPrice | currency }}</h3>
            <v-btn block color="success" @click="placeOrder">
              Place your order
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      paymentDetails: {
        cardNumber: "",
        expiry: "",
        cvc: "",
      },
      shippingAddress: {
        name: "",
        email: "", // Added email field for order confirmation
        address: "",
        city: "",
        zip: "",
        country: "",
      },
      addressSaved: false, // Whether the address is saved
    };
  },
  computed: {
    ...mapState({
      cart: (state) => state.cart,
      totalPrice: (state) =>
        state.cart.reduce(
          (total, product) => total + product.price * (product.quantity || 1),
          0
        ),
    }),
  },
  methods: {
    ...mapActions(["clearCart", "addToCart", "removeFromCart"]),
    goBack() {
      this.$router.go(-1);
    },
    goToCart() {
      this.$router.push({ name: "ViewCart" });
    },
    saveAddress() {
      this.addressSaved = true;
    },
    editAddress() {
      this.addressSaved = false;
    },
    async placeOrder() {
      if (!this.addressSaved) {
        alert("Please save your shipping address.");
        return;
      }

      try {
        const paymentSuccess = await this.processPayment();
        if (paymentSuccess) {
          alert("Order placed successfully!");
          this.clearCart();
          // Pass email to PlaceOrder page
          this.$router.push({
            name: "PlaceOrder",
            params: { email: this.shippingAddress.email },
          });
        }
      } catch (error) {
        alert("Payment failed. Please try again.");
      }
    },
    async processPayment() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true); // Simulate successful payment
        }, 2000);
      });
    },
    loadCartFromLocalStorage() {
      const cart = JSON.parse(localStorage.getItem("cart"));
      if (cart) {
        this.$store.commit("SET_CART", cart); // Sync cart with Vuex
      }
    },
    syncCartBeforeRouteChange() {
      const cart = JSON.parse(localStorage.getItem("cart"));
      if (cart) {
        this.$store.commit("SET_CART", cart);
      }
    },
  },
  mounted() {
    this.loadCartFromLocalStorage(); // Load the cart from localStorage on mount
  },
  beforeRouteEnter(to, from, next) {
    next(() => {
      // Check if reload has been triggered for this navigation cycle
      if (!sessionStorage.getItem("hasReloaded")) {
        // If not, reload the page and set the flag
        sessionStorage.setItem("hasReloaded", "true");
        window.location.reload();
      } else {
        // After reload, clear the flag for future navigations
        sessionStorage.removeItem("hasReloaded");
      }
    });
  },

  beforeRouteUpdate(to, from, next) {
    this.syncCartBeforeRouteChange(); // Sync cart from localStorage before route updates
    next();
  },
  watch: {
    cart: {
      handler(newCart) {
        localStorage.setItem("cart", JSON.stringify(newCart)); // Update localStorage when the cart changes
      },
      deep: true, // Ensure changes to the cart's contents are detected
    },
  },
  filters: {
    currency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
/* Checkout Container */
.checkout-container {
  padding: 20px !important;
  background-color: #f9f9f9 !important;
  min-height: 100vh !important;
}

.summary-card {
  padding: 20px !important;
  background-color: white !important;
  border-radius: 8px !important;
}

.summary-item {
  display: flex !important;
  align-items: center !important;
  margin-bottom: 15px !important;
}

.summary-details {
  padding-left: 10px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  width: 100% !important; /* Take up available space */
}

.item-title {
  font-weight: bold !important;
  margin: 0 !important;
  white-space: normal !important; /* Text wraps if needed */
  word-wrap: break-word !important;
}

.item-quantity,
.item-price {
  margin: 0 !important;
}

v-img {
  min-width: 50px !important;
  max-width: 50px !important;
  height: auto !important;
}

/* Responsive Layout */
@media (max-width: 768px) {
  .summary-card {
    margin-top: 20px !important;
  }
}
</style>

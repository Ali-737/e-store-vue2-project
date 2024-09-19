<template>
  <v-container fluid class="place-order-container">
    <!-- App Bar for Order Confirmation -->
    <v-app-bar color="primary" dark app dense>
      <v-btn icon @click="goHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn text>Order Confirmation</v-btn>
    </v-app-bar>

    <!-- Order Summary Layout -->
    <v-row justify="center" class="order-summary-row">
      <v-col cols="12" md="8">
        <!-- Card for Order Details -->
        <v-card class="order-summary-card">
          <v-card-title class="order-title">Order Confirmation</v-card-title>
          <v-card-text>
            <!-- Thank You Message -->
            <h2 class="thank-you-text">
              Thank you for your purchase, {{ shippingAddress.name }}!
            </h2>
            <p class="order-number">Order Number: {{ orderNumber }}</p>

            <!-- Shipping Information -->
            <h3>Shipping to:</h3>
            <p>{{ shippingAddress.name }}</p>
            <p>{{ shippingAddress.address }}, {{ shippingAddress.city }}</p>
            <p>{{ shippingAddress.zip }}, {{ shippingAddress.country }}</p>
            <p>Email: {{ $route.params.email }}</p>

            <!-- Order Summary Information -->
            <h3>Order Summary:</h3>
            <v-list>
              <v-list-item
                v-for="item in cart"
                :key="item.id"
                class="order-item"
              >
                <v-img :src="item.image" height="50" width="50" contain></v-img>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                  <v-list-item-subtitle
                    >Quantity: {{ item.quantity }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >Price: {{ item.price | currency }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <h3 class="total-price">Total: {{ totalPrice | currency }}</h3>

            <!-- Confirm Order Button -->
            <v-btn block color="success" @click="confirmOrder"
              >Confirm Your Order</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import emailjs from "emailjs-com"; // Import EmailJS for email functionality

export default {
  data() {
    return {
      orderNumber: Math.floor(Math.random() * 1000000), // Simulated order number
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
      shippingAddress: (state) => state.shippingAddress, // Fetch shipping info from Vuex
    }),
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    confirmOrder() {
      // Prepare email parameters
      const userEmail = this.$route.params.email; // Get email from route params
      const emailParams = {
        name: this.shippingAddress.name,
        email: userEmail,
        order_number: this.orderNumber,
        order_details: this.cart
          .map(
            (item) =>
              `${item.title} (x${item.quantity}): $${
                item.price * item.quantity
              }`
          )
          .join("\n"),
        total: this.totalPrice,
        shipping_address: `${this.shippingAddress.address}, ${this.shippingAddress.city}, ${this.shippingAddress.zip}, ${this.shippingAddress.country}`,
      };

      // Send email via EmailJS
      emailjs
        .send(
          "YOUR_SERVICE_ID",
          "YOUR_TEMPLATE_ID",
          emailParams,
          "YOUR_USER_ID"
        )
        .then((response) => {
          alert("Email sent successfully!");
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          );
          this.goHome(); // Redirect to homepage after successful email
        })
        .catch((error) => {
          console.error("Failed to send email.", error);
          alert("Failed to send email. Please try again.");
        });
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
.place-order-container {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.order-summary-row {
  margin-top: 20px;
}

.order-summary-card {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
}

.order-title {
  font-size: 1.8rem;
  color: #4caf50;
}

.thank-you-text {
  font-size: 1.5rem;
  color: #4caf50;
  margin-bottom: 10px;
}

.order-number {
  font-size: 1.2rem;
  color: #000;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.total-price {
  font-size: 1.5rem;
  color: #ff5722;
  font-weight: bold;
}

.v-btn {
  margin-top: 20px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .order-title {
    font-size: 1.5rem;
  }

  .total-price {
    font-size: 1.3rem;
  }
}
</style>

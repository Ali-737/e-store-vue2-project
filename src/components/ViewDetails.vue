<template>
  <v-container class="py-5 animated-background" fluid>
    <v-row justify="center">
      <!-- Image slider with product image and details at the top center -->
      <v-col cols="12" md="6">
        <v-skeleton-loader
          v-if="loading"
          type="image"
          width="100%"
          height="350"
        ></v-skeleton-loader>

        <v-carousel v-else hide-delimiters height="350">
          <!-- Main Product Image with z-axis slide-up animation -->
          <v-carousel-item>
            <v-img :src="product.image" class="slide-up-z" height="350"></v-img>
            <div class="slider-details">
              <h3>Main Image</h3>
              <p>{{ product.title }}</p>
            </div>
          </v-carousel-item>

          <!-- Size Options -->
          <v-carousel-item>
            <v-img
              src="https://via.placeholder.com/600x400?text=Available+Sizes"
              class="slide-up-z"
              height="350"
            ></v-img>
            <div class="slider-details">
              <h3>Available Sizes</h3>
              <p>Small, Medium, Large, XL, XXL</p>
            </div>
          </v-carousel-item>

          <!-- Material & Colors -->
          <v-carousel-item>
            <v-img
              src="https://via.placeholder.com/600x400?text=Material+%26+Colors"
              class="slide-up-z"
              height="350"
            ></v-img>
            <div class="slider-details">
              <h3>Material & Colors</h3>
              <p>
                Material: 100% Organic Cotton<br />
                Colors: Black, Navy Blue, Olive Green, White
              </p>
            </div>
          </v-carousel-item>

          <!-- Care Instructions -->
          <v-carousel-item>
            <v-img
              src="https://via.placeholder.com/600x400?text=Care+Instructions"
              class="slide-up-z"
              height="350"
            ></v-img>
            <div class="slider-details">
              <h3>Care Instructions</h3>
              <p>
                Machine Wash Cold<br />
                Do Not Bleach<br />
                Tumble Dry Low
              </p>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <!-- Product details and review section below the image carousel -->
    <v-row justify="center" class="mt-5">
      <v-col cols="12" md="6">
        <v-skeleton-loader
          v-if="loading"
          type="text"
          width="80%"
          class="mb-4"
        ></v-skeleton-loader>

        <div v-if="!loading" class="product-details">
          <h1>{{ product.title }}</h1>
          <p>{{ product.description }}</p>
          <v-chip color="green darken-2" dark>{{ product.category }}</v-chip>
          <v-rating :value="product.rating.rate" readonly></v-rating>
          <p><strong>Price:</strong> {{ product.price | currency }}</p>
        </div>
      </v-col>
    </v-row>

    <!-- Back to Products button at the bottom -->
    <v-row justify="center" class="mt-4">
      <v-btn @click="goBack" color="white" outlined>Back to Products</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      product: null,
      loading: true,
    };
  },
  methods: {
    async fetchProductDetails() {
      try {
        const id = this.$route.params.id;
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        this.product = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    },
    goBack() {
      // Make sure this route matches the route for your product listing page
      this.$router.push({ name: "ProductCard" });
    },
  },
  mounted() {
    this.fetchProductDetails();
  },
  filters: {
    currency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
/* Gradient Background */
.animated-background {
  background: linear-gradient(135deg, #021526, #03346e, #6eacda, #e2e2b6);
  background-size: 300% 300%;
  animation: gradientAnimation 10s ease infinite;
  border-radius: 12px;
  padding: 20px;
  min-height: 100vh;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding-left: calc(50vw - 50%);
  padding-right: calc(50vw - 50%);
  color: white;
}

/* Animation for background gradient */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Z-Axis slide-up animation with scale increase and then return to original size */
@keyframes slideUpZ {
  0% {
    transform: scale(0.8) translateZ(-50px); /* Start small */
    opacity: 0;
  }
  50% {
    transform: scale(1.1) translateZ(0); /* Grow larger than original size */
    opacity: 1;
  }
  100% {
    transform: scale(1) translateZ(0); /* Settle back to original size */
    opacity: 1;
  }
}

/* Apply the z-axis slide-up animation */
.slide-up-z {
  animation: slideUpZ 1s ease-out; /* Adjusted duration for smoother animation */
}

h1 {
  color: #fff;
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  color: #f0f0f0;
  line-height: 1.6;
  font-size: 1.1rem;
}

.v-btn {
  margin-top: 20px;
  border-radius: 30px;
  font-weight: bold;
}

/* Overlay content directly inside slider */
.slider-details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
}

/* Carousel image styling */
.v-carousel-item img {
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 10px;
}

.v-carousel-item:hover img {
  transform: scale(1.05);
}

/* Margin for product details */
.product-details {
  margin-left: 20px;
  margin-right: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .v-container {
    padding: 20px;
    width: 100%;
  }

  .v-row {
    padding: 0 20px;
  }

  .v-btn {
    width: 100%;
  }

  h1,
  p {
    font-size: 1.2rem;
  }

  .v-carousel-item {
    height: auto;
  }

  .product-details {
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media (max-width: 1024px) {
  .v-col {
    padding: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }

  .product-details {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>

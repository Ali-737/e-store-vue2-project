<template>
  <v-container fluid>
    <!-- Custom Navbar Section -->
    <v-app-bar color="primary" dark app>
      <!-- Back Button -->
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn text>Home</v-btn>

      <v-spacer></v-spacer>

      <!-- Categories Dropdown -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" text> Select Category </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="category in categoryList"
            :key="category"
            @click="filterCategory(category)"
          >
            <v-list-item-title>{{ category }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Cart Icon with Number -->
      <v-btn icon @click="goToCart" class="mr-4">
        <v-icon>mdi-cart</v-icon>
        <span v-if="cart.length > 0" class="cart-count">{{ cart.length }}</span>
      </v-btn>
    </v-app-bar>

    <!-- Hero Carousel Section -->
    <v-carousel hide-delimiters height="300">
      <v-carousel-item v-for="(image, i) in carouselImages" :key="i">
        <v-img :src="image" class="fill-height"></v-img>
      </v-carousel-item>
    </v-carousel>

    <!-- Heading Section -->
    <v-container class="mt-5">
      <v-row align="center">
        <v-col>
          <h1 class="text-center">Featured Products</h1>
        </v-col>
      </v-row>
    </v-container>

    <!-- Main Content: 4 Cards per Row with Hover Effect -->
    <v-row>
      <v-col
        v-for="product in paginatedData"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <v-card class="mx-auto mb-4 card-fixed hover-card" max-width="344">
          <!-- Product Image -->
          <v-img
            :src="product.image"
            height="200px"
            alt="Product Image"
            class="product-image"
            :id="'product-img-' + product.id"
          ></v-img>

          <!-- Product Info -->
          <v-card-title class="product-title">{{ product.title }}</v-card-title>
          <v-card-subtitle
            >Price: {{ product.price | currency }}</v-card-subtitle
          >
          <v-card-text>
            Rating: {{ product.rating.rate }} ({{ product.rating.count }}
            reviews)
          </v-card-text>

          <!-- Always visible buttons -->
          <v-card-actions class="card-actions">
            <v-btn
              block
              text
              color="blue darken-1"
              @click="viewDetails(product.id)"
              >View Details</v-btn
            >
            <v-btn
              block
              :color="isInCart(product) ? 'error' : 'success'"
              @click="toggleCart(product)"
            >
              {{ isInCart(product) ? "Remove from Cart" : "Add to Cart" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination Controls -->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @input="fetchData"
      class="mt-4"
    ></v-pagination>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 12, // Adjusted for 4 cards per row
      totalEntries: 0,
      isMobile: window.innerWidth <= 768, // Check for mobile
      cart: [], // Cart array to store added products
      selectedCategory: null, // Track selected category
      filteredProducts: [], // Products filtered by category
      carouselImages: [
        "https://picsum.photos/1600/300?random=1",
        "https://picsum.photos/1600/300?random=2",
        "https://picsum.photos/1600/300?random=3",
      ],
      categoryList: [
        "All",
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Books",
        "Sports",
      ], // Categories
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalEntries / this.itemsPerPage);
    },
    paginatedData() {
      const data =
        this.filteredProducts.length > 0
          ? this.filteredProducts
          : this.products;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return data.slice(start, end);
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        this.products = response.data;
        this.filteredProducts = response.data; // Initially, show all products
        this.totalEntries = this.products.length;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    viewDetails(productId) {
      setTimeout(() => {
        this.$router.push({ name: "ViewDetails", params: { id: productId } });
      }, 100); // Adds a slight delay for the navigation
    },
    toggleCart(product) {
      if (this.isInCart(product)) {
        this.removeFromCart(product);
      } else {
        this.addToCart(product);
      }
    },
    isInCart(product) {
      return this.cart.some((p) => p.id === product.id);
    },
    addToCart(product) {
      this.cart.push(product);
      this.saveCartToLocalStorage(); // Save updated cart to local storage
      this.animateImageToCart(product.id);
    },
    removeFromCart(product) {
      this.cart = this.cart.filter((p) => p.id !== product.id);
      this.saveCartToLocalStorage(); // Save updated cart to local storage
    },
    animateImageToCart(productId) {
      const imgElement = document.getElementById(`product-img-${productId}`);
      const cartIcon = document.querySelector(".mdi-cart");

      if (imgElement && cartIcon) {
        const imgClone = imgElement.cloneNode(true);
        const imgRect = imgElement.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        imgClone.style.position = "fixed";
        imgClone.style.zIndex = "9999";
        imgClone.style.opacity = "0.7";
        imgClone.style.top = `${imgRect.top}px`;
        imgClone.style.left = `${imgRect.left}px`;
        imgClone.style.height = "200px";
        imgClone.style.width = "200px";
        document.body.appendChild(imgClone);

        imgClone.style.transition = "all 1s ease";
        setTimeout(() => {
          imgClone.style.top = `${cartRect.top}px`;
          imgClone.style.left = `${cartRect.left}px`;
          imgClone.style.height = "40px";
          imgClone.style.width = "40px";
          imgClone.style.opacity = "0";
        }, 50);

        setTimeout(() => {
          document.body.removeChild(imgClone);
        }, 1000);
      }
    },
    filterCategory(category) {
      if (category === "All") {
        this.filteredProducts = this.products;
      } else {
        this.filteredProducts = this.products.filter((product) =>
          product.category.toLowerCase().includes(category.toLowerCase())
        );
      }
      this.currentPage = 1; // Reset to the first page after filtering
      this.totalEntries = this.filteredProducts.length; // Update total entries count
    },
    goBack() {
      this.$router.push({ name: "Dashboard" });
    },
    goToCart() {
      this.$router.push({ name: "ViewCart" }); // Navigates to ViewCart page
    },
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    loadCartFromLocalStorage() {
      const savedCart = localStorage.getItem("cart");
      this.cart = savedCart ? JSON.parse(savedCart) : [];
    },
  },
  mounted() {
    this.fetchData();
    this.loadCartFromLocalStorage(); // Load cart from local storage when component is mounted
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth <= 768; // Update the isMobile flag on resize
    });
  },
  filters: {
    currency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
/* Overall Layout */
.v-container {
  padding-top: 20px;
}

/* Navbar Styling */
.v-app-bar {
  height: 64px;
}

/* Carousel Styling */
.v-carousel-item img {
  object-fit: cover;
}

/* Cart Count Style */
.cart-count {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 14px;
  position: absolute;
  top: 12px;
  right: -10px;
  transform: translate(50%, -50%);
}

/* Cards Styling */
.v-card {
  transition: all 0.3s ease;
  position: relative;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Ensure uniform card size */
.card-fixed {
  height: 450px;
  background-color: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.card-fixed:hover {
  background-color: #e0e4ff;
  transform: scale(1.03);
}

/* Product Title Styling */
.product-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  color: #333;
}

/* Full-Width Button Styling */
.card-actions {
  display: flex;
  flex-direction: column;
}

.card-actions .v-btn {
  margin-bottom: 10px;
}

.card-actions .v-btn.color-success {
  background-color: #28a745;
}

.card-actions .v-btn.text {
  color: #1976d2;
}

/* Floating Image to Cart Animation */
.product-image {
  transition: transform 0.3s ease;
}

.product-image.animate {
  transform: translateZ(50px);
}

/* Utility Classes */
.mt-4 {
  margin-top: 16px;
}

.mt-5 {
  margin-top: 40px;
}

.my-4 {
  margin: 16px 0;
}

h1 {
  font-size: 2rem;
  color: #5a5a5a;
  font-weight: bold;
}

/* Pagination Styling */
.v-pagination {
  justify-content: center;
}

/* Accent Colors */
.v-card-subtitle {
  color: #ff7043;
}

/* Cart Count Positioning */
.cart-count {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 12px;
  position: absolute;
  top: -8px;
  right: -10px;
}

/* Animation for floating image */
@keyframes floatToCart {
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(200px, -200px) scale(0.2);
  }
}
</style>

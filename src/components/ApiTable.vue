<template>
  <div class="api-table-container">
    <!-- Back Button to Go to the Dashboard -->
    <button @click="goBack" class="btn btn-secondary back-button">Back</button>

    <!-- Table for Displaying API Data -->
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Price</th>
          <th>Category</th>
          <th>Rating</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedData" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.title }}</td>
          <td>{{ product.price | currency }}</td>
          <td>{{ product.category }}</td>
          <td>
            {{ product.rating.rate }} ({{ product.rating.count }} reviews)
          </td>
          <td>
            <img
              :src="product.image"
              alt="Product Image"
              class="product-image"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="btn btn-primary"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        class="btn"
        :class="{ 'btn-active': currentPage === page }"
      >
        {{ page }}
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-primary"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [], // Holds the API data
      currentPage: 1, // Current page number
      itemsPerPage: 10, // Number of rows per page
      totalEntries: 0, // Total number of entries from the API
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalEntries / this.itemsPerPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        this.products = response.data;
        this.totalEntries = this.products.length;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    goBack() {
      this.$router.push({ name: "Dashboard" });
    },
  },
  created() {
    this.fetchData(); // Fetch the API data when component is mounted
  },
  filters: {
    currency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
.api-table-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.table {
  width: 100%;
  background-color: #fff;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th,
.table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.product-image {
  width: 50px;
  height: 50px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  margin: 0 5px;
}

.pagination span {
  font-size: 16px;
}

.btn-active {
  font-weight: bold;
  background-color: #007bff;
  color: white;
}
</style>

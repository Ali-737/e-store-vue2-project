<template>
  <div class="dashboard">
    <nav class="navbar">
      <div class="navbar-left">
        <h2 v-if="currentUser">Welcome, {{ currentUser.firstName }}!</h2>
      </div>
      <div class="navbar-right">
        <button @click="handleLogout" class="btn btn-danger">Logout</button>
      </div>
    </nav>

    <div class="dashboard-content">
      <!-- Column 1: Users and Forms Buttons (20% width) -->
      <div class="column col1">
        <button @click="toggleUsers" class="btn btn-primary btn-large">
          Users
        </button>
        <button @click="toggleForms" class="btn btn-secondary btn-large">
          Forms
        </button>
        <button
          @click="$router.push({ name: 'ApiTable' })"
          class="btn btn-primary btn-large"
        >
          View API Table
        </button>
        <button
          @click="$router.push({ name: 'ProductCard' })"
          class="btn btn-primary btn-large"
        >
          View Product Cards
        </button>
      </div>

      <!-- Column 2: User List (30% width) with Navbar -->
      <div v-if="showUsers" class="column col2">
        <!-- Navbar inside Column 2 -->
        <div class="user-navbar">
          <h3 class="navbar-text">Signed-Up Users</h3>
        </div>

        <!-- Users List -->
        <ul class="user-list" v-if="users && users.length">
          <li v-for="user in users" :key="user.email" class="user-item">
            {{ user.firstName }} {{ user.lastName }}
          </li>
        </ul>
        <p v-else class="no-users-message">No users found</p>
      </div>

      <!-- Column 2: Form Card (centered) -->
      <div v-if="showForm" class="column col2">
        <div class="form-card">
          <h3>Fill the Form</h3>
          <form @submit.prevent="validateAndSubmit">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-user"></i
                ></span>
              </div>
              <input
                v-model="form.firstName"
                class="form-control form-input"
                placeholder="First Name"
              />
            </div>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-user"></i
                ></span>
              </div>
              <input
                v-model="form.lastName"
                class="form-control form-input"
                placeholder="Last Name"
              />
            </div>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-envelope"></i
                ></span>
              </div>
              <input
                v-model="form.email"
                class="form-control form-input"
                placeholder="Email"
                type="email"
              />
            </div>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-phone"></i
                ></span>
              </div>
              <input
                v-model="form.mobile"
                class="form-control form-input"
                placeholder="Mobile"
              />
            </div>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-sort-numeric-up"></i
                ></span>
              </div>
              <input
                v-model="form.age"
                class="form-control form-input"
                placeholder="Age"
                type="number"
              />
            </div>

            <button type="submit" class="btn btn-success btn-submit">
              Submit
            </button>
          </form>
        </div>
      </div>

      <!-- Column 3: Form Data Table (50% width) -->
      <div class="column table-col" v-if="showForm" style="width: 50%">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in formEntriesWithId" :key="index">
              <td>{{ entry.id }}</td>
              <td>{{ entry.firstName }}</td>
              <td>{{ entry.lastName }}</td>
              <td>{{ entry.age }}</td>
              <td>{{ entry.mobile }}</td>
              <td>{{ entry.email }}</td>
              <td>
                <button
                  @click="deleteEntry(index)"
                  class="btn btn-danger btn-small"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      showUsers: false,
      showForm: false,
      form: {
        firstName: "",
        lastName: "",
        age: "",
        mobile: "",
        email: "",
      },
    };
  },
  computed: {
    ...mapState(["currentUser", "users", "formEntries"]),
    formEntriesWithId() {
      return this.formEntries.map((entry, index) => ({
        ...entry,
        id: index + 1,
      }));
    },
  },
  methods: {
    ...mapActions(["logout", "addFormEntry", "deleteFormEntry"]),
    toggleUsers() {
      this.showUsers = !this.showUsers;
      this.showForm = false;
    },
    toggleForms() {
      this.showForm = !this.showForm;
      this.showUsers = false;
    },
    validateAndSubmit() {
      const { firstName, lastName, age, mobile, email } = this.form;
      if (!firstName || !lastName || !age || !mobile || !email) {
        alert("Please fill in all the fields.");
        return;
      }
      this.addFormEntry({ ...this.form });
      this.form = {
        firstName: "",
        lastName: "",
        age: "",
        mobile: "",
        email: "",
      };
    },
    deleteEntry(index) {
      this.deleteFormEntry(index);
    },
    handleLogout() {
      this.logout();
      this.$router.push({ name: "Login" });
    },
  },
  watch: {
    currentUser(newValue) {
      if (!newValue) {
        this.$router.push({ name: "Login" });
      }
    },
  },
};
</script>
<!-- Global Styles -->
<style>
/* Define Color Variables Globally */
:root {
  --color1: #6482ad;
  --color2: #7fa1c3;
  --color3: #e2dad6;
  --color4: #f5eded;
}

.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color4); /* Base background color */
}

.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: var(--color2);
  color: white;
}

.dashboard-content {
  display: flex;
  flex-grow: 1;
}

.column {
  padding: 20px;
  border-right: 1px solid var(--color2);
}

.col1 {
  width: 20%;
  display: flex;
  flex-direction: column;
  background-color: var(--color1); /* Background for Col1 */
}

.col1 button {
  width: 100%;
  color: white;
  background-color: var(--color2);
}

.btn-large {
  height: 20%;
  margin-bottom: 10px;
  color: var(--color4);
}

/* Column 2 with Navbar and User List */
.col2 {
  width: 30%;
  padding: 0;
}

/* Navbar inside Column 2 */
.user-navbar {
  width: 100%;
  background-color: var(--color1);
  padding: 10px;
}

.navbar-text {
  color: white;
  text-align: center;
  margin: 0;
}

.user-list {
  margin-top: 20px;
  padding-left: 0;
  list-style: none;
}

.user-item {
  background-color: var(--color3);
  color: black;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  text-align: center;
}

.no-users-message {
  text-align: center;
  margin-top: 20px;
  color: var(--color1);
}

.table-col {
  background-color: var(--color4);
  overflow-x: auto;
}

.button {
  margin: 5px;
}

.btn-small {
  padding: 5px 10px;
  font-size: 14px;
}

/* Center form submit button */
.form-card {
  background-color: var(--color4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form-input {
  margin-bottom: 10px;
  height: 40px;
  font-size: 14px;
}

/* Center submit button at bottom */
.btn-submit {
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  align-self: center;
  width: 50%;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group-prepend .input-group-text {
  background-color: var(--color3);
  border: none;
  color: white;
  font-size: 16px;
}

.users-list {
  background-color: var(--color3);
  color: var(--color1);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 30%; /* Ensure Col2 is 30% */
}
</style>

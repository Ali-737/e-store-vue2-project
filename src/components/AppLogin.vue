<!-- src/components/AppLogin.vue -->
<template>
  <div class="wrapper">
    <div class="form-wrapper">
      <!-- Original Login Form Card -->
      <div class="form-container">
        <h1>Login</h1>
        <p class="success-message" v-if="successMessage">
          {{ successMessage }}
        </p>
        <p class="error-message" v-if="errors.length">
          {{ errors.join(". ") }}
        </p>
        <form @submit.prevent="loginUser">
          <div v-for="(input, index) in inputs" :key="index" class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i :class="input.icon"></i>
                </span>
              </div>
              <input
                :type="input.type"
                class="form-control"
                :placeholder="input.placeholder"
                v-model="input.value"
              />
            </div>
          </div>
          <button type="submit" class="btn btn-success">Login</button>
        </form>

        <!-- Links for new users -->
        <p class="account-link">
          New here?
          <router-link to="/signup" class="underline-link">
            Create an Account
          </router-link>
        </p>

        <!-- Social Media Buttons Inline -->
        <div class="social-login">
          <button class="btn btn-social btn-facebook">
            <i class="fab fa-facebook-f"></i> Facebook
          </button>
          <button class="btn btn-social btn-google">
            <i class="fab fa-google"></i> Google
          </button>
          <button class="btn btn-social btn-github">
            <i class="fab fa-github"></i> GitHub
          </button>
        </div>
      </div>

      <!-- New Attached Card with Gradient Background -->
      <div class="info-card">
        <!-- <h2>Welcome Back!</h2>
        <p>Log in to access your account.</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      inputs: [
        {
          type: "email",
          placeholder: "Email",
          value: "",
          icon: "fas fa-envelope",
        },
        {
          type: "password",
          placeholder: "Password",
          value: "",
          icon: "fas fa-lock",
        },
      ],
      errors: [],
      successMessage: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    loginUser() {
      this.errors = [];

      const emailInput = this.inputs.find(
        (input) => input.type === "email"
      ).value;
      const passwordInput = this.inputs.find(
        (input) => input.type === "password"
      ).value;

      if (!this.isValidEmail(emailInput)) {
        this.errors.push("Invalid email format");
      }
      if (!passwordInput) {
        this.errors.push("Password is required");
      }

      if (!this.errors.length) {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const user = storedUsers.find(
          (user) => user.email === emailInput && user.password === passwordInput
        );

        if (user) {
          this.login(user); // Store user in Vuex
          this.$router.push({ name: "Dashboard" }); // Navigate to dashboard after login
        } else {
          this.errors.push("Invalid email or password");
        }
      }
    },
    isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },
  },
};
</script>

<style scoped>
/* Original styles for AppLogin.vue */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0;
  margin: 0;
  background: linear-gradient(135deg, #ffeac5, #ffdbb5, #6c4e31, #603f26);
  background-size: 300% 300%;
  animation: gradientAnimation 10s ease infinite;
}

.form-wrapper {
  display: flex;
  width: 80%;
  max-width: 800px;
}

.form-container,
.info-card {
  flex: 1;
  padding: 30px;
  border-radius: 10px 0px 0px 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-container {
  background: white;
}

.info-card {
  background-image: url(/src/assets/pexels-josh-hild-1270765-13907290.jpg);
  background-size: cover;
  background-position: right;
  overflow: hidden;
  color: black;
  border-radius: 0px 10px 10px 0px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: 0;
}

.form-control {
  border-left: 0;
}

.form-control:focus {
  border-color: #80bdff;
  outline: none;
}

.error-message {
  color: #e3342f;
  margin-bottom: 20px;
}

.success-message {
  color: #28a745;
  margin-bottom: 20px;
}

.btn-success {
  color: #fff;
  background: linear-gradient(135deg, #af8260, #c19b78, #d2b191, #f2d7ba);
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.btn-success:hover {
  background: linear-gradient(135deg, #c19b78, #af8260);
}

/* Account link styles */
.account-link {
  margin-top: 15px;
}

.underline-link {
  text-decoration: none;
  color: #227b94;
  font-weight: bold;
  border-bottom: 2px solid transparent;
}

.underline-link:hover {
  border-bottom: 2px solid #227b94;
}

/* Social media login buttons (inline) */
.social-login {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  margin: 0 5px;
}

.btn-social i {
  margin-right: 8px;
}

.btn-facebook {
  background: #3b5998;
}

.btn-facebook:hover {
  background: #2d4373;
}

.btn-google {
  background: #db4437;
}

.btn-google:hover {
  background: #c33d2f;
}

.btn-github {
  background: #333;
}

.btn-github:hover {
  background: #24292e;
}

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
</style>

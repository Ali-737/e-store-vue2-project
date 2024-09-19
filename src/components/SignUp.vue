<template>
  <div class="wrapper">
    <div class="form-wrapper">
      <!-- Original Sign Up Form Card -->
      <div class="form-container">
        <h1>Signup</h1>
        <p class="success-message" v-if="successMessage">
          {{ successMessage }}
        </p>
        <p class="error-message" v-if="errors.length">
          {{ errors.join(". ") }}
        </p>
        <form @submit.prevent="registerUser">
          <div v-for="(input, index) in inputs" :key="index" class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i :class="input.icon"></i
                ></span>
              </div>
              <input
                :type="input.type"
                class="form-control"
                :placeholder="input.placeholder"
                v-model="input.value"
              />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>

        <!-- Links for existing users -->
        <p class="account-link">
          Already have an Account?
          <router-link to="/login" class="underline-link">Login</router-link>
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
        <h2>Welcome!</h2>
        <p>Create an account to explore amazing features.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputs: [
        {
          type: "text",
          placeholder: "First Name",
          value: "",
          icon: "fas fa-user",
        },
        {
          type: "text",
          placeholder: "Last Name",
          value: "",
          icon: "fas fa-user",
        },
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
    registerUser() {
      this.errors = [];

      this.inputs.forEach((input) => {
        if (!input.value.trim()) {
          this.errors.push(`${input.placeholder} is required`);
        }
      });

      const emailInput = this.inputs.find(
        (input) => input.type === "email"
      ).value;
      const passwordInput = this.inputs.find(
        (input) => input.type === "password"
      ).value;

      if (emailInput && !this.isValidEmail(emailInput)) {
        this.errors.push("Invalid email format");
      }

      if (passwordInput.length < 8) {
        this.errors.push("Password must be at least 8 characters");
      }

      if (!this.errors.length) {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = storedUsers.some(
          (user) => user.email === emailInput
        );

        if (userExists) {
          this.errors.push("User with this email already exists");
        } else {
          const newUser = {
            firstName: this.inputs.find(
              (input) => input.placeholder === "First Name"
            ).value,
            lastName: this.inputs.find(
              (input) => input.placeholder === "Last Name"
            ).value,
            email: emailInput,
            password: passwordInput,
          };

          storedUsers.push(newUser);
          localStorage.setItem("users", JSON.stringify(storedUsers));

          this.successMessage =
            "Registration Successful! Redirecting to login...";
          setTimeout(() => this.$router.push({ name: "Login" }), 2000);
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
  width: 80%; /* Adjust width as needed */
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
  /* background: linear-gradient(
    135deg,
    #af8260,
    #c19b78,
    #d2b191,
    #f2d7ba
  );  */
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

.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #af8260, #c19b78, #d2b191, #f2d7ba);
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.btn-primary:hover {
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

<template>
  <div class="register">
    <div class="register-container">
      <h2 class="register-title">注册</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <input
            type="text"
            v-model="username"
            placeholder="用户名"
            required
            autocomplete="username"
            class="register-input"
        />
        <input
            type="password"
            v-model="password"
            placeholder="密码"
            required
            autocomplete="current-password"
            class="register-input"
        />
        <button type="submit" class="register-btn">注册</button>
      </form>
      <p class="register-footer">
        已有账号？<a @click="goToLogin" class="login-link">去登录</a>
      </p>
    </div>

    <!-- Success popup -->
    <div v-if="showSuccessPopup" class="success-popup">
      <div class="popup-content">
        <p>注册成功！请前往登录。</p>
        <button @click="goToLogin">前往登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      showSuccessPopup: false // Flag for showing success popup
    };
  },
  methods: {
    async handleRegister() {
      console.log("注册信息:", this.username, this.password); // Check data
      try {
        const response = await axios.post("http://localhost:3000/api/register", {
          username: this.username,
          password: this.password
        });
        console.log("注册成功:", response.data);

        // Show success popup
        this.showSuccessPopup = true;

        // Clear input fields
        this.username = "";
        this.password = "";

        // Wait for a moment and redirect to login
        setTimeout(() => {
          this.goToLogin();
        }, 2000); // Wait 2 seconds before redirect
      } catch (error) {
        console.error("注册失败:", error.response?.data || error.message);
        alert(error.response?.data || "注册失败，请稍后再试");
      }
    },
    goToLogin() {
      // Emit an event or directly navigate to the login page
      this.$emit("go-to-login");
      this.$router.push({ name: "Login" }); // Assuming the login route is named "Login"
    }
  }
};
</script>

<style scoped>
/* Register page background and container */
.register {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #ffafcc, #b6e2d3, #d3c0e1, #ffd6e4);
  z-index: 1000;
}

.register-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 2px dashed #ffb3d9;
}

/* Title styling */
.register-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ff80ab;
  font-family: 'Comic Sans MS', sans-serif;
}

/* Form styling */
.register-form {
  display: flex;
  flex-direction: column;
}

.register-input {
  padding: 15px;
  margin-bottom: 20px;
  border: 2px dashed #ffb3d9;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  font-family: 'Comic Sans MS', sans-serif;
}

.register-input:focus {
  border-color: #ff80ab;
}

/* Button styling */
.register-btn {
  padding: 15px;
  background: linear-gradient(135deg, #ff80ab, #d3c0e1);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-family: 'Comic Sans MS', sans-serif;
}

.register-btn:hover {
  background: linear-gradient(135deg, #ff64a3, #d3c0e1);
  transform: translateY(-2px);
}

.register-btn:active {
  background: linear-gradient(135deg, #ffafcc, #ffd6e4);
}

/* Footer text and link styling */
.register-footer {
  margin-top: 20px;
  font-size: 1rem;
  color: #666;
}

.login-link {
  color: #ff80ab;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}

/* Success popup styling */
.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.popup-content button {
  padding: 10px 20px;
  background-color: #ff80ab;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup-content button:hover {
  background-color: #ff64a3;
}
</style>

<template>
  <div class="register">
    <div class="register-container">
      <h2 class="register-title">注册</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <input type="text" v-model="username" placeholder="用户名" required autocomplete="username" class="register-input" />
        <input type="password" v-model="password" placeholder="密码" required autocomplete="current-password" class="register-input" />
        <button type="submit" class="register-btn">注册</button>
      </form>
      <p class="register-footer">
        已有账号？<a @click="goToLogin" class="login-link">去登录</a>
      </p>
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
      password: ""
    };
  },
  methods: {
    async handleRegister() {
      console.log("注册信息:", this.username, this.password); // 检查是否有数据
      try {
        const response = await axios.post("http://localhost:3000/api/register", {
          username: this.username,
          password: this.password
        });
        console.log("注册成功:", response.data);
        this.$emit("register-success");
      } catch (error) {
        console.error("注册失败:", error.response?.data || error.message);
        alert(error.response?.data || "注册失败，请稍后再试");
      }
    },
    goToLogin() {
      // 发出去登录的事件
      this.$emit("go-to-login");
    }
  }
};
</script>

<style scoped>
/* 注册页面的背景和容器 */
.register {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #ff7eb3 0%, #ff758c 50%, #ff6b72 100%);
  font-family: 'Arial', sans-serif;
  z-index: 1000; /* 确保在所有内容之上 */
}

.register-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* 标题样式 */
.register-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ff6b72;
}

/* 表单样式 */
.register-form {
  display: flex;
  flex-direction: column;
}

.register-input {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.register-input:focus {
  border-color: #ff758c;
}

/* 按钮样式 */
.register-btn {
  padding: 15px;
  background: #ff758c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.register-btn:hover {
  background: #ff6b72;
  transform: translateY(-2px);
}

/* 底部文字和链接样式 */
.register-footer {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
}

.login-link {
  color: #ff758c;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}
</style>

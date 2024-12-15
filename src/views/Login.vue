<template>
  <div class="login">
    <div class="login-container">
      <h2 class="login-title">登录</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <input type="text" v-model="username" placeholder="用户名" required autocomplete="username" class="login-input" />
        <input type="password" v-model="password" placeholder="密码" required autocomplete="current-password" class="login-input" />
        <div class="login-options">
          <label>
            <input type="checkbox" v-model="rememberMe" /> 记住我
          </label>
        </div>
        <button type="submit" class="login-btn">登录</button>
      </form>
      <p class="login-footer">
        没有账号？<a @click="goToRegister" class="register-link">去注册</a>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false // 是否记住登录状态
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          username: this.username,
          password: this.password
        });

        if (response.data) {
          if (this.rememberMe) {
            // 存储登录状态和用户信息
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("user", JSON.stringify({ username: this.username }));
          }
          this.$emit("login-success", userData); // 向父组件传递用户数据
        }
      } catch (error) {
        alert("登录失败，请稍后再试");
      }
    },

    goToRegister() {
      this.$emit("go-to-register");
    }
  },
  mounted() {
    // 检查 localStorage 中的登录状态
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      // 恢复用户信息
      const user = JSON.parse(localStorage.getItem("user"));
      this.username = user ? user.username : "";
    }
  }

};
</script>

<style scoped>
/* 登录页面的背景和容器 */
.login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #36a9da, #2c8db3, #f1f1f1);
  z-index: 1000; /* 确保在所有内容之上 */
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* 标题样式 */
.login-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #36a9da;
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
}

.login-input {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.login-input:focus {
  border-color: #2c8db3;
}

/* 按钮样式 */
.login-btn {
  padding: 15px;
  background: #36a9da;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.login-btn:hover {
  background: #2c8db3;
  transform: translateY(-2px);
}

/* 底部文字和链接样式 */
.login-footer {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
}

.register-link {
  color: #36a9da;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}

.register-link:hover {
  text-decoration: underline;
}
</style>

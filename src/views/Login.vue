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
      console.log("登录方法被触发了");
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          username: this.username,
          password: this.password
        });

        if (response.data) {
          const userData = response.data; // 假设返回的数据包含用户信息
          if (this.rememberMe) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify({ username: this.username }));
          }

          // 设置首次访问标志为 false
          localStorage.setItem('isFirstVisit', 'false');

          // 触发父组件的 login-success 事件，并传递用户数据
          this.$emit("login-success", userData);

        }
      } catch (error) {
        console.log(error);
        alert("登录失败，请稍后再试");
      }
    },

    goToRegister() {
      this.$emit('go-to-register'); // 触发事件，通知父组件显示注册页面
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
  background: linear-gradient(120deg, #f7b0d2, #ffb6c1, #f1f1f1); /* 甜美的渐变背景 */
  z-index: 1000;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 20px; /* 更圆润的边角 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* 轻柔的阴影效果 */
  text-align: center;
  border: 2px dashed #ff80ab; /* 使用粉色虚线边框 */
}

/* 标题样式 */
.login-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ff80ab; /* 可爱的粉色 */
  font-family: 'Comic Sans MS', sans-serif; /* 轻松愉快的字体 */
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
}

.login-input {
  padding: 15px;
  margin-bottom: 20px;
  border: 2px dashed #ff80ab; /* 虚线边框 */
  border-radius: 12px; /* 更圆滑的边角 */
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  font-family: 'Comic Sans MS', sans-serif;
}

.login-input:focus {
  border-color: #ff64a3; /* 聚焦时更鲜明的粉色 */
}

/* 按钮样式 */
.login-btn {
  padding: 15px;
  background: #ff80ab; /* 甜美的粉色 */
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-family: 'Comic Sans MS', sans-serif;
}

.login-btn:hover {
  background: #ff64a3; /* 更亮眼的粉色 */
  transform: translateY(-2px);
}

.login-btn:active {
  background: #f06292; /* 按钮点击时的颜色 */
}

/* 底部文字和链接样式 */
.login-footer {
  margin-top: 20px;
  font-size: 1rem;
  color: #666;
}

.register-link {
  color: #ff80ab;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}

.register-link:hover {
  text-decoration: underline;
}

</style>

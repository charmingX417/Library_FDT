<template>
  <div id="app">
    <!-- 如果未登录，显示登录页面 -->
    <Login v-if="!isLoggedIn && !showRegister" @login-success="handleLoginSuccess" @go-to-register="showRegisterPage" />

    <!-- 如果显示注册页面 -->
    <Register v-if="showRegister && !isLoggedIn" @go-to-login="showLoginPage" />

    <!-- 如果已登录，显示主应用内容 -->
    <el-container v-if="isLoggedIn" style="height: 100vh;">
      <el-header v-if="isLoggedIn" class="topbar">
        <div class="navbar-title">
          <img src="@/assets/atri.png" alt="Logo" class="navbar-logo" />
          <span class="navbar-text">2200311015林健波</span>
        </div>

        <el-menu :default-active="activeNav" mode="horizontal" @select="handleNavChange" class="navbar-menu">
          <el-menu-item class="navbar-item" v-for="item in menuItems" :key="item.index" :index="item.index">
            <div class="menu-item-content">
              <img :src="activeNav === item.index ? item.iconActive : item.iconDefault" class="menu-icon" alt="icon" />
              <span>{{ item.name }}</span>
            </div>
          </el-menu-item>

          <!-- 用户信息菜单项 -->
          <el-menu-item class="navbar-item user-info-item" index="user">
            <el-dropdown
                trigger="hover"
                placement="bottom-end"
                ref="userDropdown"
                @visible-change="handleDropdownVisibility"
            >
              <template #default>
                <div class="user-info">
                  <img :src="userAvatar" class="navbar-avatar" alt="用户头像" />
                  <span class="username">{{ username }}</span>
                </div>
              </template>
              <!-- 下拉菜单 -->
              <template #dropdown>
                <el-dropdown-menu :inert="!isDropdownVisible">
                  <el-dropdown-item @click="viewProfile">查看个人信息</el-dropdown-item>
                  <el-dropdown-item @click="logout">注销账户</el-dropdown-item>
                  <el-dropdown-item @click="exitLogin">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
      </el-header>

      <el-container style="height: calc(100vh - 60px);">
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { ref, computed,watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Sidebar from "@/components/Sidebar.vue"; // 保留 Sidebar 组件
import axios from "axios";

import homeDefault from "@/assets/icons/home0.png";
import homeActive from "@/assets/icons/home1.png";
import LibraryDefault from "@/assets/icons/library.png";
import LibraryActive from "@/assets/icons/library1.png";
import AboutDefault from "@/assets/icons/about0.png";
import AboutActive from "@/assets/icons/about1.png";
import user_img from "@/assets/user222.png";

export default {
  name: "App",
  components: {
    Login,
    Register,
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute(); // 使用 useRoute 获取当前路由信息
    const isLoggedIn = ref(false);
    const showRegister = ref(false);
    const activeNav = ref("1");
    const isLoginRestored = ref(false);
    const isDropdownVisible = ref(false);

    const userAvatar = ref(user_img); // 本地头像图片

    // 根据当前路由是否为 /book-management 决定是否显示侧边栏
    const showSidebar = computed(() => route.path === "/book-management");

    const menuItems = ref([
      { index: "1", name: "首页", iconDefault: homeDefault, iconActive: homeActive },
      { index: "2", name: "功能页面", iconDefault: LibraryDefault, iconActive: LibraryActive },
      { index: "3", name: "关于我们", iconDefault: AboutDefault, iconActive: AboutActive },
    ]);

    // 恢复登录状态和用户信息
    const restoreLoginStatus = () => {
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
      if (storedIsLoggedIn === "true") {
        isLoggedIn.value = true;
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          username.value = user.username; // 恢复用户名
          userAvatar.value = user.avatar || user_img; // 恢复头像，如果没有头像则使用默认头像
          // 登录成功后跳转到首页
          watch(
              isLoggedIn,
              (newVal) => {
                if (newVal) {
                  console.log("恢复登录状态，跳转到首页");
                  router.push("/home");
                }
              },
              { immediate: true } // 确保初始状态也执行
          );
          isLoginRestored.value = true; //标记恢复完成
        }
      }
    };

    const username = ref(""); // 新增状态，存储用户名
    const handleLoginSuccess = async (loginData) => {
      console.log("接收到的登录数据:", loginData); // 检查是否接收到参数
      if (!loginData || !loginData.username || !loginData.password) {
        console.error("登录数据缺失");
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/api/login', loginData);
        console.log("服务器响应：", response); // 打印服务器返回的响应
        const user = response.data.user;
        username.value = user.username; // 保存用户名
        userAvatar.value = user.avatar || user_img; // 保存用户头像
        isLoggedIn.value = true;
        // 将用户信息和登录状态存储到 localStorage
        if (loginData.rememberMe) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify({ username: user.username, avatar: user.avatar }));
        }

        await router.push("/home");
      } catch (error) {
        console.error("登录失败", error);
        alert("登录失败，请检查用户名和密码");
      }
    };

    const showRegisterPage = () => {
      showRegister.value = true;
    };

    const showLoginPage = () => {
      showRegister.value = false;
    };

    const handleNavChange = (key) => {
      activeNav.value = key;
      if (key === "1") {
        router.push("/home");
      } else if (key === "2") {
        router.push("/book-management");
      } else if (key === "3") {
        router.push("/about");
      }
    };

    const viewProfile = () => {
      alert("查看个人信息功能待实现");
    };

    const logout = () => {
      alert("注销账户功能待实现");
    };

    const exitLogin = () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      isLoggedIn.value = false;
      router.push("/"); // 跳转到登录页面
    };

    const handleDropdownVisibility = (visible) => {
      isDropdownVisible.value = visible;
    };
    // 页面加载时恢复登录状态
    onMounted(() => {
      restoreLoginStatus(); // 在组件挂载后调用恢复登录状态逻辑
    });

    return {
      isLoggedIn,
      showRegister,
      activeNav,
      menuItems,
      showSidebar,
      username,
      userAvatar,
      isLoginRestored,
      isDropdownVisible,
      handleDropdownVisibility,
      handleLoginSuccess,
      showRegisterPage,
      showLoginPage,
      handleNavChange,
      viewProfile,
      logout,
      exitLogin,
    };
  },
};
</script>



<style scoped>
#app {
  height: 100vh;
}

/* 顶部导航栏样式 */
.topbar {
  background-color: #36a9da;
  color: white;
  line-height: 60px;
  padding: 0 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;                /* 让导航栏宽度填充整个容器 */
  box-sizing: border-box;     /* 确保 padding 也被计入宽度 */
}

/* 菜单栏样式 */
.navbar-menu {
  background-color: #fa9ce7;
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  padding: 0 10px;
}

/* 导航栏标题部分 */
.navbar-title {
  display: flex;
  align-items: center; /* 确保 Logo 和文字在垂直方向居中 */
}

.navbar-text {
  font-size: 18px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #ffffff; /* 文字颜色 */
}

.menu-item-content {
  display: flex;
  align-items: center;
}

.menu-icon {
  margin-right: 8px;
  width: 30px;
  height: 30px;
}

.navbar-item.el-menu-item {
  background-color: #efb1dd;
  color: #000000;
  border-radius: 0px;
  padding: 0 20px;
  height: 60px;
  transition: all 0.3s ease;
}

.navbar-item.el-menu-item:hover {
  background-color: #071233;
  color: white;
}

.navbar-item.el-menu-item.is-active {
  background-color: #fa9ce7;
  color: #000000;
  font-weight: bold;
}

.main-content {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}
.navbar-logo{
  display: flex;
  height: 40px; /* 调整大小 */
  width: 40px;
  border-radius: 50%; /* 设置圆形 */
}

/* 让头像按钮更适配菜单栏的样式 */
.navbar-avatar img {
  width: 32px; /* 调整为统一尺寸 */
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
}

.user-info-item {
  position: absolute;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: transparent;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer; /* 添加鼠标悬停效果 */
  outline: none;
}
.user-info:focus {
  outline: none;
  box-shadow: none;
}

.username {
  color: white;
}

.el-dropdown-menu {
  min-width: 150px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.el-dropdown-item {
  color: #333;
}
.el-dropdown-item:hover {
  background-color: #f5f5f5;
}
.navbar-item.is-active {
  background-color: #fa9ce7;
  color: #000000;
  font-weight: bold;
}

.user-info-item:hover {
  background-color: transparent;
}
</style>


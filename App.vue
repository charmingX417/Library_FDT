<template>
  <div id="app">

    <!-- 加载动画组件 -->
    <Loading v-if="isLoading" class="loading-spinner" />
    <!-- 全局背景图片 -->
    <div id="global-background"></div>
    <!-- 樱花特效的 Canvas -->
    <canvas id="sakura-canvas"></canvas>

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
                  <img :src="userAvatar" class="navbar-avatar" alt="用户头像"
                       :style="{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }"
                  />
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

          <!-- 关于我们菜单项 -->
          <el-menu-item class="navbar-item">
            <el-dropdown trigger="hover" placement="bottom-end">
              <template #default>
                <div class="menu-item-content">
                  <img src="/me.png" class="menu-icon" alt="关于我" />
                  <span>关于我</span>
                </div>
              </template>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToGithub">GitHub</el-dropdown-item>
                  <el-dropdown-item @click="goToBilibili">Bilibili</el-dropdown-item>
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
import Loading from "@/components/Loading.vue";  // 引入加载动画组件

import homeDefault from "@/assets/icons/home0.png";
import homeActive from "@/assets/icons/home1.png";
import LibraryDefault from "@/assets/icons/library.png";
import LibraryActive from "@/assets/icons/library1.png";
import AiDefault from "@/assets/icons/ai.png";
import AiActive from "@/assets/icons/ai1.png";
import mqttimg from "@/assets/icons/mqtt.png";
import mqttimg1 from "@/assets/icons/mqtt1.png";
import user_img from "@/assets/xuejie.jpg";
import * as assert from "node:assert";


export default {
  name: "App",
  methods: {},
  components: {
    Login,
    Register,
    Sidebar,
    Loading
  },
  setup() {
    const router = useRouter();
    const route = useRoute(); // 使用 useRoute 获取当前路由信息
    const isLoading = ref(true); // 控制加载动画显示
    const isLoggedIn = ref(false);
    const showRegister = ref(false);
    const activeNav = ref("1");
    const isLoginRestored = ref(false);
    const isFirstVisit = ref(false);     // 用于标记是否为首次访问
    const isDropdownVisible = ref(false);

    const userAvatar = ref(user_img); // 本地头像图片

    // 根据当前路由是否为 /book-management 决定是否显示侧边栏
    const showSidebar = computed(() => route.path === "/book-management");

    const menuItems = ref([
      { index: "1", name: "首页", iconDefault: homeDefault, iconActive: homeActive },
      { index: "2", name: "功能页面", iconDefault: LibraryDefault, iconActive: LibraryActive },
      { index: "3", name: "MQTT硬件通信", iconDefault: mqttimg, iconActive: mqttimg1 },
      { index: "4", name: "高性能", iconDefault: AiDefault, iconActive: AiActive }

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
          isLoginRestored.value = true; //标记恢复完成
        }

        // 只在首次恢复登录状态后跳转到首页
        if (isLoginRestored.value && !isFirstVisit.value) {
          isFirstVisit.value = true;  // 标记首次访问
          router.push("/home");  // 跳转到首页
        }
      }
    };


    const username = ref(""); // 新增状态，存储用户名
    const handleLoginSuccess = (userData) => {
      console.log("接收到的登录数据:", userData);
      // 保存用户数据
      username.value = userData.username;
      userAvatar.value = userData.avatar || user_img;
      isLoggedIn.value = true;

      // 存储登录信息
      if (userData.rememberMe) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify({ username: userData.username, avatar: userData.avatar }));
      }

      // 跳转到首页
      router.push("/home");
    };


    const goToGithub = () => {
      window.open("https://github.com/charmingX417?tab=repositories", "_blank");
    };

    const goToBilibili = () => {
      window.open("https://space.bilibili.com/26633214?spm_id_from=333.33.0.0", "_blank");
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
      } else if (key === "4") {
        router.push("/ai-qa");
      } else if (key === "3") {
        router.push("/Mqtt-connected"); // 新增路由跳转
      }
    };

    const viewProfile = () => {
      router.push("/profile"); // 跳转到个人信息页面
    };

    const logout = async () => {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        alert("用户未登录或无法获取用户 ID");
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/api/deleteUser", { userId });
        alert(response.data); // 弹出注销成功信息

        // 清除本地存储，退出登录
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        await router.push("/"); // 跳转回登录页面
      } catch (error) {
        console.error("注销失败:", error);
        // 如果服务器返回未归还书籍提示，则显示具体错误信息
        if (error.response?.status === 400 && error.response.data.includes("未归还")) {
          alert(error.response.data); // 显示未归还书籍提示
        } else {
          alert("注销失败，请稍后再试");
        }
      }
    };



    const exitLogin = () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("hasSeenAnimation"); // 清除加载动画标志
      isLoggedIn.value = false;
      router.push("/"); // 跳转到登录页面
    };

    const handleDropdownVisibility = (visible) => {
      isDropdownVisible.value = visible;
    };

    onMounted(() => {
      console.log("加载动画状态初始化:", isLoading.value);

      // 检查是否已经显示过加载动画
      const hasSeenAnimation = localStorage.getItem("hasSeenAnimation");

      if (!hasSeenAnimation) {
        console.log("首次打开，显示加载动画");
        setTimeout(() => {
          isLoading.value = false; // 隐藏加载动画
          console.log("加载动画状态结束:", isLoading.value);

          // 设置标志，记录动画已显示
          localStorage.setItem("hasSeenAnimation", "true");

          // 根据登录状态跳转
          if (isLoggedIn.value) {
            router.push("/home"); // 如果已登录，跳转到首页
          } else {
            router.push("/"); // 如果未登录，跳转到登录页
          }
        }, 5000); // 设置加载动画的延时为5秒
      } else {
        console.log("非首次打开，跳过加载动画");
        isLoading.value = false; // 直接关闭加载动画
        if (isLoggedIn.value) {
          router.push("/home"); // 如果已登录，跳转到首页
        } else {
          router.push("/"); // 如果未登录，跳转到登录页
        }
      }

      // 恢复登录状态
      restoreLoginStatus();
    });


    return {
      isLoading,
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
      goToBilibili,
      goToGithub,
    };
  },
};
</script>
<style scoped>
#app {
  height: 100vh;
}
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 全局背景图片 */
#global-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/1350953.jpg"); /* 替换为你的背景图片路径 */
  background-size: cover;
  background-position: center;
  z-index: -2; /* 置于最底层 */
}
/* 樱花特效 Canvas */
#sakura-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 避免影响页面交互 */
  z-index: -1; /* 在背景图片之上，内容之下 */
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
  width: 38px;
  height: 38px;
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
  /* 半透明背景效果 */
  background-color: rgba(255, 255, 255, 0.01); /* 半透明白色背景 */
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
  max-width: 100%; /* 确保不会超出容器 */
  max-height: 100%; /* 确保不会超出容器 */
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

.user-info-item:hover {
  background-color: transparent;
}
.menu-icon:focus {
  outline: none;  /* 去除聚焦时的黑框 */
  border: none;   /* 去除可能的边框 */
}
</style>

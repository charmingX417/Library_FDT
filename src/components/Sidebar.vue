<template>
  <el-aside width="200px" :class="['sidebar', theme]">
    <!-- 侧边栏标题 -->
    <div class="sidebar-header" :class="theme">
      图书管理系统
    </div>
    <!-- 侧边栏菜单 -->
    <el-menu
        router
        :default-active="activeIndex"
        class="el-menu-vertical"
        :background-color="menuBackgroundColor"
        :text-color="menuTextColor"
        :active-text-color="menuActiveTextColor"
    >
      <el-menu-item
          index="/home"
          @mouseover="hover = 'home'"
          @mouseleave="hover = null"
          :style="getItemStyle('home', activeIndex === '/home')"
          @click="handleMenuClick('/home')"
      >首页</el-menu-item>
      <el-menu-item
          index="/book-management"
          @mouseover="hover = 'book-management'"
          @mouseleave="hover = null"
          :style="getItemStyle('book-management', activeIndex === '/book-management')"
          @click="handleMenuClick('/book-management')"
      >图书管理</el-menu-item>
      <el-menu-item
          index="/borrow-management"
          @mouseover="hover = 'borrow-management'"
          @mouseleave="hover = null"
          :style="getItemStyle('borrow-management', activeIndex === '/borrow-management')"
          @click="handleMenuClick('/borrow-management')"
      >借书管理</el-menu-item>
      <el-menu-item
          index="/return-management"
          @mouseover="hover = 'return-management'"
          @mouseleave="hover = null"
          :style="getItemStyle('return-management', activeIndex === '/return-management')"
          @click="handleMenuClick('/return-management')"
      >还书管理</el-menu-item>
      <el-menu-item
          index="/search"
          @mouseover="hover = 'search'"
          @mouseleave="hover = null"
          :style="getItemStyle('search', activeIndex === '/search')"
          @click="handleMenuClick('/search')"
      >图书查询</el-menu-item>
      <el-menu-item
          index="/backup-restore"
          @mouseover="hover = 'backup-restore'"
          @mouseleave="hover = null"
          :style="getItemStyle('backup-restore', activeIndex === '/backup-restore')"
          @click="handleMenuClick('/backup-restore')"
      >数据备份与恢复</el-menu-item>
    </el-menu>
    <!-- 主题切换按钮 -->
    <el-button class="theme-toggle" @click="toggleTheme">切换主题</el-button>
  </el-aside>
</template>

<script>
export default {
  name: "Sidebar", // 组件名称
  data() {
    return {
      activeIndex: "home", // 当前活动的菜单项
      hover: null, // 鼠标悬停的菜单项索引
      theme: 'dark', // 当前主题
    };
  },
  computed: {
    // 动态菜单和标题的背景颜色和文本颜色
    menuBackgroundColor() {
      return this.theme === 'dark' ? '#304156' : '#c5ec9e';
    },
    menuTextColor() {
      return this.theme === 'dark' ? '#ffffff' : '#000000';
    },
    menuActiveTextColor() {
      return this.theme === 'dark' ? '#ffd04b' : '#2c3e50';
    }
  },
  methods: {
    // 根据鼠标悬停状态和选中状态动态计算菜单项的样式
    getItemStyle(index, isActive) {
      if (isActive) {
        // 选中时的蓝色高光状态 前面背景色后面文字色
        return this.theme === 'dark'
            ? { backgroundColor: '#267ce7', color: '#ffffff' }
            : { backgroundColor: '#bbe1fa', color: '#000000' };
      }
      if (this.hover === index) {
        // 悬停时的背景和文字颜色
        return this.theme === 'dark'
            ? { backgroundColor: '#2c3e50', color: '#ffd04b' }
            : { backgroundColor: '#ddd', color: '#2c3e50' };
      }
      return {};
    },
    // 点击菜单项时更新活动状态并切换路由
    handleMenuClick(index) {
      this.activeIndex = index; // 更新当前活动的菜单项
      this.$router.push(index); // 切换路由
    },
    // 切换主题样式
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'; // 切换主题状态
    },
  },
};
</script>

<style>
/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s; /* 添加过渡效果 */
}

.sidebar.dark {
  background-color: #304156; /* 暗主题背景色 */
  color: #fff; /* 暗主题文字颜色 */
}

.sidebar.light {
  background-color: #c5ec9e; /* 明主题背景色 */
  color: #000; /* 明主题文字颜色 */
}

/* 侧边栏标题样式 */
.sidebar-header {
  padding: 20px; /* 内边距 */
  text-align: center; /* 文本居中 */
  font-size: 18px; /* 字体大小 */
  font-weight: bold; /* 字体粗细 */
  border-bottom: 1px solid #3a4a5a; /* 下边框 */
}

.sidebar-header.dark {
  background-color: #263238; /* 暗主题标题背景 */
  color: #ffd04b; /* 暗主题标题文字颜色 */
}

.sidebar-header.light {
  background-color: #2ed116; /* 明主题标题背景 */
  color: #000; /* 明主题标题文字颜色 */
}

/* 菜单项样式 */
.el-menu-vertical {
  border-right: none; /* 去掉右侧边框 */
}

.el-menu-item {
  transition: background-color 0.3s, color 0.3s; /* 添加过渡效果 */
}

.el-menu-item:hover {
  cursor: pointer; /* 鼠标悬停时显示手形光标 */
}

/* 主题切换按钮样式 */
.theme-toggle {
  margin: 20px auto; /* 居中按钮 */
  display: block;
}
</style>

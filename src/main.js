import { createApp } from "vue";
import App from "../App.vue";
import router from "./router";
import Store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/assets/styles/global.css";
import store from "./store"; // 全局样式
// 引入 Element Plus 图标库
import * as Icons from "@element-plus/icons-vue"; // 确保正确导入
import { startSakura, stopp } from "./utils/Sakura"; // 引入 Sakura.js
const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component);
}

// 在应用启动时，恢复登录状态
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const isFirstVisit = localStorage.getItem('isFirstVisit') === 'true';  // 获取首次访问标志

// 如果登录了且不是首次访问，则跳转到首页
if (isLoggedIn && !isFirstVisit) {
    router.push('/home');
}

app.use(router);
app.use(store);
app.use(ElementPlus);
startSakura();

app.mount("#app");

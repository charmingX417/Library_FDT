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

const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component);
}

app.use(router);
app.use(store);
app.use(ElementPlus);

app.mount("#app");

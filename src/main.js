import { createApp } from "vue";
import App from "../App.vue";
import router from "./router";
import Store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/assets/styles/global.css";
import store from "./store"; // 全局样式

const app = createApp(App);

app.use(router);
app.use(store);
app.use(ElementPlus);

app.mount("#app");

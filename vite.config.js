import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": "/src", // 别名配置
        },
    },
    server: {
        port: 3001, // 前端服务端口
        proxy: {
            "/api": {
                target: "http://localhost:3000", // 后端服务地址
                changeOrigin: true, // 跨域设置
            },
        },
    },
});

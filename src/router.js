// 导入 Vue 和 vue-router 中的相关方法
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import BookManagement from './views/BookManagement.vue';
import BorrowManagement from './views/BorrowManagement.vue';
import ReturnManagement from './views/ReturnManagement.vue';
import SearchPage from './views/SearchPage.vue';
import BackupRestorePage from './views/BackupRestorePage.vue';
import Sidebar from "@/components/Sidebar.vue";

// 创建路由实例并配置路由
const routes = [
    { path: "/", redirect: "/home" },
    { path: '/home', component: Home },
    { path: '/book-management', component: BookManagement },
    { path: '/borrow-management', component: BorrowManagement },
    { path: '/return-management', component: ReturnManagement },
    { path: '/search', component: SearchPage },
    { path: '/backup-restore', component: BackupRestorePage }
];

// 创建并导出路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

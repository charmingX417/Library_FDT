import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import BookManagement from './views/BookManagement.vue';
import BorrowManagement from './views/BorrowManagement.vue';
import ReturnManagement from './views/ReturnManagement.vue';
import SearchPage from './views/SearchPage.vue';
import BackupRestorePage from './views/BackupRestorePage.vue';

const routes = [
    { path: "/", redirect: "/home" },
    { path: '/home', component: Home },
    { path: '/book-management', component: BookManagement },
    { path: '/borrow-management', component: BorrowManagement },
    { path: '/return-management', component: ReturnManagement },
    { path: '/search', component: SearchPage },
    { path: '/backup-restore', component: BackupRestorePage }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 在路由守卫中显示加载动画
router.beforeEach((to, from, next) => {
    // 这里我们不再使用 document.querySelector 操作 DOM，而是通过 app 组件中的 isLoading 来控制
    next();
});

router.afterEach(() => {
    // 页面导航完成时隐藏加载动画
    // 可以考虑在这里设置 `isLoading.value = false;` 或类似逻辑
});

export default router;

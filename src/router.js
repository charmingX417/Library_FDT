import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import BookManagement from './views/BookManagement.vue';
import BorrowManagement from './views/BorrowManagement.vue';
import ReturnManagement from './views/ReturnManagement.vue';
import SearchPage from './views/SearchPage.vue';
import BackupRestorePage from './views/BackupRestorePage.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';  // 注册页面引入

const routes = [
    { path: "/", redirect: "/login" },
    { path: '/login', component: Login },
    { path: '/register', component: Register }, // 注册页面
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

router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (to.path === '/login' || to.path === '/register') {
        next();
        return;
    }

    if (!isLoggedIn) {
        next('/login'); // 未登录，跳转到登录页
    } else {
        next(); // 已登录，正常跳转
    }
});

router.afterEach(() => {
    // 页面导航完成后执行的操作（如隐藏加载动画等）
});

export default router;

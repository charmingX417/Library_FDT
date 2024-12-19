import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import BookManagement from './views/BookManagement.vue';
import BorrowManagement from './views/BorrowManagement.vue';
import ReturnManagement from './views/ReturnManagement.vue';
import SearchPage from './views/SearchPage.vue';
import MqttConnected from './views/MqttConnected.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';  // 注册页面引入
import UserProfile from "@/views/UserProfile.vue";
import AiPage from "@/views/AiPage.vue";
const isFirstVisit = localStorage.getItem('isFirstVisit') === 'true';  // 是否首次访问

const routes = [
    { path: "/", redirect: "/login" },
    { path: '/login', component: Login,name: 'Login' },
    { path: '/register', component: Register,name: 'Register'}, // 注册页面
    { path: '/home', component: Home },
    { path: '/book-management', component: BookManagement },
    { path: '/borrow-management', component: BorrowManagement },
    { path: '/return-management', component: ReturnManagement },
    { path: '/search', component: SearchPage },
    { path: '/Mqtt-connected', component: MqttConnected },
    { path: "/profile", component: UserProfile }, // 新增个人信息页面
    { path: '/ai-qa', component: AiPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isFirstVisit = localStorage.getItem('isFirstVisit') === 'true';

    // 如果访问的是登录或注册页面，允许跳转
    if (to.path === '/login' || to.path === '/register') {
        // 如果已登录，跳转到首页，避免循环重定向
        if (isLoggedIn) {
            next('/home');
        } else {
            next(); // 允许继续访问登录页
        }
        return;
    }

    // 如果用户没有登录，跳转到登录页
    if (!isLoggedIn) {
        next('/login');
    } else {
        // 如果是首次访问且已登录，跳转到首页
        if (isFirstVisit) {
            localStorage.setItem('isFirstVisit', 'false'); // 设置为非首次访问
            next('/home'); // 跳转到首页
        } else {
            next(); // 已登录且非首次访问，正常访问目标路由
        }
    }
});

router.afterEach(() => {
    // 页面导航完成后执行的操作（如隐藏加载动画等）
});

export default router;

export default {
    // Vuex 的 state 对象，存储组件的状态
    state: {
        users: [] // 初始化一个空数组，用于存储用户数据
    },
    // Vuex 的 mutations 对象，用于同步更新 state 中的状态
    mutations: {
        // 定义一个名为 ADD_USER 的 mutation，接受 state 和 user 参数
        ADD_USER(state, user) {
            state.users.push(user); // 将新的用户添加到 users 数组中
        },
        // 定义一个名为 SET_USERS 的 mutation，接受 state 和 users 参数
        SET_USERS(state, users) {
            state.users = users; // 将传递的用户数组赋值给 state.users
        }
    },
    // Vuex 的 actions 对象，用于处理异步操作
    actions: {
        // 定义一个名为 fetchUsers 的 action，用于模拟从 API 获取用户数据
        fetchUsers({ commit }) {
            // 模拟 API 请求，实际应用中应替换为真实的 API 调用
            const users = [{ name: "Alice", cardNumber: "U001" }]; // 示例用户数据
            commit("SET_USERS", users); // 调用 SET_USERS mutation，将用户数据提交给它
        },
        // 定义一个名为 addUser 的 action，用于添加用户
        addUser({ commit }, user) {
            commit("ADD_USER", user); // 调用 ADD_USER mutation，将用户数据提交给它
        }
    },
    // Vuex 的 getters 对象，用于派发和计算 state 的数据
    getters: {
        // 定义一个名为 allUsers 的 getter，返回所有用户的数据
        allUsers: (state) => state.users
    }
};

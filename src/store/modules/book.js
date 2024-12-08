export default {
    // Vuex 的 state 对象，存储组件的状态
    state: {
        books: [] // 初始化一个空数组，用于存储书籍数据
    },
    // Vuex 的 mutations 对象，用于同步更新 state 中的状态
    mutations: {
        // 定义一个名为 SET_BOOKS 的 mutation，接受 state 和 books 参数
        SET_BOOKS(state, books) {
            state.books = books; // 将传递的 books 数据赋值给 state.books
        }
    },
    // Vuex 的 actions 对象，用于处理异步操作
    actions: {
        // 定义一个名为 fetchBooks 的 action，接受一个上下文对象作为参数
        fetchBooks({ commit }) {
            // 模拟一个 API 请求，实际使用中可以替换为真实的 API 调用
            commit('SET_BOOKS', [/* 书籍数据 */]); // 调用 SET_BOOKS mutation，将书籍数据传递给它
        }
    },
    // Vuex 的 getters 对象，用于派发和计算 state 的数据
    getters: {
        // 定义一个名为 allBooks 的 getter，返回所有书籍的数据
        allBooks: state => state.books
    }
};

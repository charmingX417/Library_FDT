export default {
    // Vuex 的 state 对象，存储组件的状态
    state: {
        borrowRecords: [] // 初始化一个空数组，用于存储借书记录
    },
    // Vuex 的 mutations 对象，用于同步更新 state 中的状态
    mutations: {
        // 定义一个名为 ADD_RECORD 的 mutation，接受 state 和 record 参数
        ADD_RECORD(state, record) {
            state.borrowRecords.push(record); // 将新的借书记录添加到 borrowRecords 数组中
        }
    },
    // Vuex 的 actions 对象，用于处理异步操作
    actions: {
        // 定义一个名为 addBorrowRecord 的 action，接受上下文对象和 record 参数
        addBorrowRecord({ commit }, record) {
            commit("ADD_RECORD", record); // 调用 ADD_RECORD mutation，将新的借书记录传递给它
        }
    },
    // Vuex 的 getters 对象，用于派发和计算 state 的数据
    getters: {
        // 定义一个名为 allBorrowRecords 的 getter，返回所有借书记录的数据
        allBorrowRecords: (state) => state.borrowRecords
    }
};

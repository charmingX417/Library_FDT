import { createStore } from "vuex";
import user from "./modules/user";
import record from "./modules/record";

export default createStore({
    modules: {
        user,
        record,
    },
});

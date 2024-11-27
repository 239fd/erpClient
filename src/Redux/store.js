import { configureStore } from "@reduxjs/toolkit";

import { AuthReducer } from "./Slies/authSlice";
// import { WorkerReducer } from "./Slies/workerSlice";
// import { DirectorReducer } from "./Slies/directorSlice";
// import { AccountantReducer } from "./Slies/accountantSlice";
// import { ManagerReducer } from "./Slies/managerSlice";

const store = new configureStore({
    reducer: {
        auth: AuthReducer,

    },
});

export default store;
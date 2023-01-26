import { configureStore } from "@reduxjs/toolkit";
import Userslice from "./slices/Userslice";
import activeChatSlice from "./slices/activeChatSlice";

export default configureStore({
  reducer: {
    userLoginInfo: Userslice,
    activeChat: activeChatSlice,
  },
});

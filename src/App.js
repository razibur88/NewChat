import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import RootLayout from "./pages/root/RootLayout";
import Register from "./pages/registration/Register";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Forgot from "./pages/forgot/Forgot";
import Message from "./pages/message/Message";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot" element={<Forgot />}></Route>
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

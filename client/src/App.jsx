import Post from "./pages/Posts";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import CreatePost from "./pages/CreatePost";
import PostDetailsPage from "./pages/PostDetailsPage";
import { Provider } from "react-redux";
import store from "./store/store";
import EditPost from "./pages/EditPost";
import UserProfile from "./pages/UserProfile";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <> 
       <Toaster />
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Post />} />
            <Route path={"/signup"} element={<SignUp />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/create"} element={<CreatePost />} />
            <Route path={"/postdetails/:id"} element={<PostDetailsPage/>}/>
            <Route path={"/editpost/:id"} element={<EditPost/>}/>
            <Route path={"/updateuser/:id"} element={<UserProfile/>}/>
          </Route>
        </Routes>
      </Provider>
    </>
  );
}

export default App;

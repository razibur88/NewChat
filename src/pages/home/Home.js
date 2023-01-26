import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Search from "../../components/Search";
import Slidebar from "../../components/Slidebar";
import FriendGropu from "../../components/FriendGropu";
import FriendRequest from "../../components/FriendRequest";
import Friends from "../../components/Friends";
import MyGroup from "../../components/MyGroup";
import Userlist from "../../components/Userlist";
import BlockUser from "../../components/BlockUser";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/Userslice";

const Home = () => {
  const auth = getAuth();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [verify, setVerify] = useState(false);
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
      setVerify(true);
      dispatch(userLoginInfo(user));
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  });
  return (
    <div className="flex justify-between flex-wrap">
      {verify ? (
        <>
          <div className="w-[10%]">
            <Slidebar active="home" />
          </div>
          <div className="w-[29%]">
            <Search />
            <FriendGropu />
            <FriendRequest />
          </div>
          <div className="w-[29%]">
            <Friends />
            <MyGroup />
          </div>
          <div className="w-[29%]">
            <Userlist />
            <BlockUser />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen w-full">
          <h2 className="bg-[#5F35F5] text-white p-5">
            Please Verify Your Email
          </h2>
        </div>
      )}
    </div>
  );
};

export default Home;

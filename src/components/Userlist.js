import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
const Userlist = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [userdata, setUserdata] = useState([]);
  const [friendrequestlist, setFriendrequestlist] = useState([]);
  const [friendlist, setFriendlist] = useState([]);
  const [userfilter, setUserfilter] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.key) {
          arr.push({ ...item.val(), userid: item.key });
        }
      });
      setUserdata(arr);
    });
  }, []);

  let handlefriendrequest = (item) => {
    set(push(ref(db, "friendrequest/")), {
      sendername: data.displayName,
      senderid: data.uid,
      receivername: item.username,
      receiverid: item.userid,
    });
  };

  useEffect(() => {
    const starCountRef = ref(db, "friendrequest/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverid + item.val().senderid);
      });
      setFriendrequestlist(arr);
    });
  }, []);

  useEffect(() => {
    const fCountRef = ref(db, "friend/");
    onValue(fCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverid + item.val().senderid);
      });
      setFriendlist(arr);
    });
  }, []);

  let handlesearch = (e) => {
    let arr = [];
    if (e.target.value.length == 0) {
      setUserfilter(arr);
    } else {
      userdata.filter((item) => {
        if (
          item.username.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          arr.push(item);
        }
        setUserfilter(arr);
      });
    }
  };

  return (
    <>
      <div className="relative px-5 mt-[80px]">
        <h2>User List</h2>
        <BiDotsVerticalRounded className="absolute top-[30%] right-[26px]" />
        <input
          onChange={handlesearch}
          placeholder="search"
          className="w-96 border border-spacing-10 py-1.5 pl-2"
        />
      </div>
      <div className="h-[320px] overflow-scroll">
        {userfilter.length > 0
          ? userfilter.map((item) => (
              <div className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
                <div className="w-[25%] text-center pl-5">
                  <div className="w-[100px] h-[100px] rounded-full">
                    <img
                      className="w-[100px] h-[100px] rounded-full"
                      src={data.photoURL}
                    />
                  </div>
                </div>
                <div className="w-[50%] pl-4">
                  <h3>{item.username}</h3>
                  <p>{item.email}</p>
                </div>
                <div className="w-[25%]">
                  <div className="h-[40px] w-[40px] bg-[#5F35F5] ml-[50px]">
                    {friendlist.includes(item.userid + data.uid) ||
                    friendlist.includes(data.uid + item.userid) ? (
                      <p className="text-white text-[20px] text-center">F</p>
                    ) : friendrequestlist.includes(item.userid + data.uid) ||
                      friendrequestlist.includes(data.uid + item.userid) ? (
                      <p className="text-white text-[20px] text-center">p</p>
                    ) : (
                      <p
                        onClick={() => handlefriendrequest(item)}
                        className="text-white text-[20px] text-center"
                      >
                        +
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          : userdata.map((item) => (
              <div className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
                <div className="w-[25%] text-center pl-5">
                  <div className="w-[100px] h-[100px] rounded-full">
                    <img
                      className="w-[100px] h-[100px] rounded-full"
                      src={data.photoURL}
                    />
                  </div>
                </div>
                <div className="w-[50%] pl-4">
                  <h3>{item.username}</h3>
                  <p>{item.email}</p>
                </div>
                <div className="w-[25%]">
                  <div className="h-[40px] w-[40px] bg-[#5F35F5] ml-[50px]">
                    {friendlist.includes(item.userid + data.uid) ||
                    friendlist.includes(data.uid + item.userid) ? (
                      <p className="text-white text-[20px] text-center">F</p>
                    ) : friendrequestlist.includes(item.userid + data.uid) ||
                      friendrequestlist.includes(data.uid + item.userid) ? (
                      <p className="text-white text-[20px] text-center">p</p>
                    ) : (
                      <p
                        onClick={() => handlefriendrequest(item)}
                        className="text-white text-[20px] text-center"
                      >
                        +
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default Userlist;

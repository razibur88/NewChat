import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { activeChat } from "../slices/activeChatSlice";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
const Friends = () => {
  const [friends, setFriends] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  let dispatch = useDispatch();
  useEffect(() => {
    const fCountRef = ref(db, "friend/");
    onValue(fCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid === item.val().receiverid || item.val().senderid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriends(arr);
    });
  }, []);

  let handleblock = (item) => {
    if (data.uid == item.senderid) {
      set(push(ref(db, "block")), {
        block: item.receivername,
        blockid: item.receiverid,
        blockbyname: item.sendername,
        blockbyid: item.senderid,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.sendername,
        blockid: item.senderid,
        blockbyname: item.receivername,
        blockbyid: item.receiverid,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    }
  };

  let handleActiveChat = (item) => {
    if (item.receiverid == data.uid) {
      dispatch(
        activeChat({
          status: "single",
          id: item.senderid,
          name: item.sendername,
        })
      );
    } else {
      dispatch(
        activeChat({
          status: "single",
          id: item.receiverid,
          name: item.receivername,
        })
      );
    }
  };

  return (
    <>
      <div className="relative px-5 mt-[80px]">
        <h2>Friend</h2>
        <BiDotsVerticalRounded className="absolute top-[30%] right-[26px]" />
      </div>
      <div className="h-[290px] overflow-scroll">
        {friends.map((item) => (
          <div
            onClick={() => handleActiveChat(item)}
            className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]"
          >
            <div className="w-[25%] text-center pl-5">
              <img src="images/user.png" />
            </div>
            <div className="w-[50%]">
              <h3>
                {data.uid == item.senderid
                  ? item.receivername
                  : item.sendername}
              </h3>
              <p>Hi Guys, Wassup!</p>
            </div>
            <div className="w-[25%]">
              <button
                onClick={() => handleblock(item)}
                className="p-3 bg-[#5F35F5] text-[#fff] rounded"
              >
                block
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Friends;

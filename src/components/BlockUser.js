import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
const BlockUser = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [blocklist, setBlocklist] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "block");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().blockbyid == data.uid) {
          arr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
          });
        } else {
          arr.push({
            id: item.key,
            blockby: item.val().blockby,
            blockbyname: item.val().blockbyname,
          });
        }
      });
      setBlocklist(arr);
    });
  }, []);

  let handleUnblock = (item) => {
    set(push(ref(db, "friend")), {
      sendername: item.block,
      senderid: item.blockid,
      receivername: data.displayName,
      receiverid: data.uid,
    }).then(() => {
      remove(ref(db, "block/" + item.id));
    });
  };

  return (
    <>
      <div className="relative px-5 mt-5">
        <h2>Block List</h2>
        <BiDotsVerticalRounded className="absolute top-[30%] right-[26px]" />
      </div>
      <div className="h-[290px] overflow-scroll">
        {blocklist.map((item) => (
          <div className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
            <div className="w-[25%] text-center pl-5">
              <img src="images/user.png" />
            </div>
            <div className="w-[50%]">
              <h3>{item.block}</h3>
              <h3>{item.blockbyname}</h3>
              <p>Hi Guys, Wassup!</p>
            </div>

            <div className="w-[25%]">
              {item.blockid && (
                <button
                  onClick={() => handleUnblock(item)}
                  className="p-3 bg-[#5F35F5] text-[#fff] rounded"
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlockUser;

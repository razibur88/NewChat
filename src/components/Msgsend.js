import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const Msgsend = () => {
  const db = getDatabase();
  let [show, setShow] = useState(false);
  let [group, setGroup] = useState("");
  let [grouplist, setGrouplist] = useState([]);
  let [tagline, setTagline] = useState("");
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  let handleGrouprequest = () => {
    setShow(!show);
  };

  let handlegroupRequest = () => {
    set(push(ref(db, "group")), {
      group: group,
      grouptagline: tagline,
      adminmame: data.displayName,
      adminid: data.uid,
    }).then(() => {
      setShow(false);
    });
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });
      setGrouplist(arr);
    });
  }, []);

  return (
    <>
      <div className="relative px-5 mt-5">
        <h2>Groups Request</h2>
      </div>
      <div className="h-[290px] overflow-scroll">
        {grouplist.map((item) => (
          <div className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
            <div className="w-[25%] text-center pl-5">
              <img src="images/user.png" />
            </div>
            <div className="w-[50%]">
              <h3>admin:{item.adminmame}</h3>
              <h3>{item.group}</h3>
              <p>Hi Guys, Wassup!</p>
            </div>
            <div className="w-[25%]">
              <button className="p-3 bg-[#5F35F5] text-[#fff] rounded">
                join
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Msgsend;

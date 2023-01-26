import React, { useState, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
const MyGroup = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  let [grouplist, setGrouplist] = useState([]);
  let [groupreqlist, setGroupreqlist] = useState([]);
  let [show, setShow] = useState(false);
  let [showgroup, setShowgroup] = useState(false);
  let [showgroupmembers, setShowgroupmembers] = useState([]);

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGrouplist(arr);
    });
  }, []);

  let handlerequestsubmit = (gitem) => {
    setShow(true);
    const groupreqRef = ref(db, "groupjoinrequest");
    onValue(groupreqRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminid && item.val().groupid == gitem.key) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupreqlist(arr);
    });
  };

  let handlegroupaccept = (item) => {
    set(push(ref(db, "groupmembers")), {
      groupid: item.groupid,
      adminid: item.adminid,
      userid: item.userid,
      adminmame: item.adminmame,
      groupname: item.groupname,
      username: item.username,
    }).then(() => {
      remove(ref(db, "groupjoinrequest/" + item.key));
    });
  };

  let handlegroupreqdelete = (item) => {
    remove(ref(db, "groupjoinrequest/" + item.key));
  };

  let hnadlegroupinfo = (itemg) => {
    const groupRef = ref(db, "groupmembers");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == itemg.adminid && itemg.key == item.val().groupid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setShowgroupmembers(arr);
      setShowgroup(true);
    });
  };
  return (
    <>
      <div className="relative px-5 mt-5">
        <h2>My Groups</h2>
        {show && (
          <button
            onClick={() => setShow(false)}
            className="absolute top-[30%] right-[26px] p-1 bg-[#5F35F5] text-[#fff] rounded"
          >
            go Back
          </button>
        )}
        {showgroup && (
          <button
            onClick={() => setShowgroup(false)}
            className="absolute top-[30%] right-[26px] p-1 bg-[#5F35F5] text-[#fff] rounded"
          >
            go Back
          </button>
        )}
      </div>
      <div className="h-[290px] overflow-scroll">
        {grouplist.length == 0 ? (
          <p className="bg-[red] text-white p-2.5">no data avaiable</p>
        ) : (
          grouplist.map((item) =>
            show ? (
              groupreqlist.map((gitem) => (
                <div className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
                  <div className="w-[25%] text-center pl-5">
                    <img src="images/user.png" />
                  </div>
                  <div className="w-[40%]">
                    <h3>{gitem.username}</h3>
                  </div>
                  <div className="w-[35%]">
                    <button
                      onClick={() => handlegroupaccept(gitem)}
                      className="p-1 bg-[#5F35F5] text-[#fff] rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handlegroupreqdelete(gitem)}
                      className="p-1 bg-[#5F35F5] text-[#fff] rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : showgroup ? (
              showgroupmembers.map((gitem) => (
                <div className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
                  <div className="w-[25%] text-center pl-5">
                    <img src="images/user.png" />
                  </div>
                  <div className="w-[40%]">
                    <h3>{gitem.username}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
                <div className="w-[25%] text-center pl-5">
                  <img src="images/user.png" />
                </div>
                <div className="w-[40%]">
                  <h3>admin:{item.adminmame}</h3>
                  <h3>{item.group}</h3>
                  <p>Hi Guys, Wassup!</p>
                </div>
                <div className="w-[35%]">
                  <button
                    onClick={() => hnadlegroupinfo(item)}
                    className="p-1 bg-[#5F35F5] text-[#fff] rounded"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => handlerequestsubmit(item)}
                    className="p-1 bg-[#5F35F5] text-[#fff] rounded"
                  >
                    Request
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </>
  );
};

export default MyGroup;

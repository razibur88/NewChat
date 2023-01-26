import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const FriendGropu = () => {
  const db = getDatabase();
  let [show, setShow] = useState(false);
  let [group, setGroup] = useState("");
  let [grouplist, setGrouplist] = useState([]);
  let [tagline, setTagline] = useState("");
  let [grouperr, setGrouperr] = useState("");
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  let handleGrouprequest = () => {
    setShow(!show);
  };

  let handleGroup = (e) => {
    setGroup(e.target.value);
    setGrouperr("");
  };
  let handleTagline = (e) => {
    setTagline(e.target.value);
    setGrouperr("");
  };
  let handlegroupRequest = () => {
    if ((group, tagline)) {
      set(push(ref(db, "group")), {
        group: group,
        grouptagline: tagline,
        adminmame: data.displayName,
        adminid: data.uid,
      }).then(() => {
        setShow(false);
      });
    } else {
      setGrouperr("Please Create Group");
    }
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.val().adminid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGrouplist(arr);
    });
  }, []);

  let handlejoinrequest = (item) => {
    set(push(ref(db, "groupjoinrequest")), {
      groupid: item.key,
      groupname: item.group,
      grouptag: item.grouptagline,
      adminmame: item.adminmame,
      adminid: item.adminid,
      userid: data.uid,
      username: data.displayName,
    });
  };
  return (
    <>
      <div className="relative px-5 mt-5">
        <h2>Groups Request</h2>
        {show ? (
          <button
            onClick={handleGrouprequest}
            className="absolute top-[0%] right-[26px] p-2 bg-[#5F35F5] text-[#fff] rounded"
          >
            Go back
          </button>
        ) : (
          <button
            onClick={handleGrouprequest}
            className="absolute top-[0%] right-[26px] p-2 bg-[#5F35F5] text-[#fff] rounded"
          >
            Create Group
          </button>
        )}
      </div>
      <p className="text-[red] pl-5">{grouperr}</p>
      <div className="h-[290px] overflow-scroll">
        {show ? (
          <div className="ml-[10%]">
            <input
              onChange={handleGroup}
              placeholder="Group Name"
              className="border border-secondary w-[90%] py-2 px-2 rounded-xl mt-7"
            />
            <input
              onChange={handleTagline}
              placeholder="Tagline"
              className="border border-secondary w-[90%] py-2 px-2 rounded-xl mt-3 mb-3"
            />
            <button
              onClick={handlegroupRequest}
              type="submit"
              className="bg-bg w-[90%]  py-2 rounded-[50px] text-[#fff]"
            >
              Submit
            </button>
          </div>
        ) : (
          grouplist.map((item) => (
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
                <button
                  onClick={() => handlejoinrequest(item)}
                  className="p-3 bg-[#5F35F5] text-[#fff] rounded"
                >
                  join
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FriendGropu;

import React from "react";
import Slidebar from "../../components/Slidebar";
import Search from "../../components/Search";
import Msgsend from "../../components/Msgsend";
import Friends from "../../components/Friends";
import Chart from "../../components/Chart";

const Message = () => {
  return (
    <div className="flex justify-between flex-wrap">
      <div className="w-[10%]">
        <Slidebar active="msg" />
      </div>
      <div className="w-[29%]">
        <Search />
        <Msgsend />
        <Friends />
      </div>
      <div className="w-[61%]">
        <Chart />
      </div>
    </div>
  );
};

export default Message;

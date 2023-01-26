import React from "react";
import { BiSearchAlt2, BiDotsVerticalRounded } from "react-icons/bi";

const Search = () => {
  return (
    <div className="relative text-center mt-5">
      <div className="ml-3 mr-3 relative">
        <BiSearchAlt2 className="absolute top-[35%] left-[15px] z-10" />
        <input
          type="text"
          placeholder="Search"
          className="w-full h-10 rounded-[30px] pl-10 drop-shadow-lg"
        />
        <BiDotsVerticalRounded className="absolute top-[30%] right-[15px]" />
      </div>
    </div>
  );
};

export default Search;

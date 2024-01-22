import React from "react";
import { useDispatch } from "react-redux";
import { listSearchCustomer } from "../../actions/customer";

const SearchBarChatPopup = () => {
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    console.log("search = ", e.target.value);
    if (e.target.value.length > 1) {
      dispatch(listSearchCustomer(1, 1000, e.target.value));
    } else {
      dispatch(listSearchCustomer(1, 1000, ""));
    }
  };

  return (
    <>
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        onChange={handleSearch}
      />
      <div className="searchIcon">
        <img src="./assets/icons/Search.svg" alt="" />
      </div>
    </>
  );
};

export default SearchBarChatPopup;

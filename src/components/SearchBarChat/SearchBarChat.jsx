import React from "react";
import * as api from "../../api/index";

const SearchBarChat = ({ setDropdownData, setDropdownGroup }) => {
  const handleSearch = async (e) => {
    console.log("search = ", e.target.value);
    if (e.target.value.length > 1) {
      const { data } = await api.fetchSearchUserNGroup(1, 1000, e.target.value);
      setDropdownData(data?.data?.data); // Set the dropdown data to users from the search result
      setDropdownGroup(data?.data?.groupData);
      console.log("Dropdown data = ", data);
    } else {
      setDropdownData(null);
      setDropdownGroup(null);
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

export default SearchBarChat;

import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
const baseURL = process.env.REACT_APP_BASEURL;

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;
const header = {
  headers: {
    Authorization: loginToken,
  },
};

const SearchBar = ({ setDropdownData }) => {
  const [typedWord, setTypedWord] = useState(null);
  const [searchData, setSearchData] = useState(null);

  const handleSearch = async (e) => {
    console.log("search = ", e.target.value);
    setTypedWord(e.target.value);
    if (e.target.value.length >= 1) {
      const { data } = await axios.get(
        `${baseURL}/user/globalSearch?search=${e.target.value}`,
        header
      );
      setSearchData(data?.data);
      setDropdownData(data?.data); // Set the dropdown data to users from the search result
      console.log("typedWord -- ", typedWord);
      console.log("searchResult = ", searchData);
    } else {
      setSearchData(null);
      setDropdownData(null);
    }
  };

  const handleSearchclick = () => {
    console.log("--", typedWord);
  };

  return (
    <div className="searchBox mt-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        onChange={handleSearch}
        // onBlur={() => setDropdownData([])}
      />
      <div className="searchIcon" onClick={handleSearchclick}>
        <img src="./assets/icons/Search.svg" alt="" />
      </div>
    </div>
  );
};

export default SearchBar;

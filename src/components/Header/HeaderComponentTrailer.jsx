import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import searchIcon from "../../assets/icons/Search.svg";
import headerImg from "../../assets/hefson.svg";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { list, listSearch } from "../../actions/trailer";
import { listShipment, listShipmentSearch } from "../../actions/shipment";
import * as api from "../../api/index";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_BASEURL;

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;
const header = {
  headers: {
    Authorization: loginToken,
  },
};
let limit = 20;

const loginRole = Cookies.get("role") ? JSON.parse(Cookies.get("role")) : null;

const HeaderComponentTrailer = ({ titleProp, searching, shipment, driver }) => {
  const [typedWord, setTypedWord] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0); // Initial count
  const [notificationLoader, setNotificationLoader] = useState(false);

  const [notificationData, setNotificationData] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    getNotificationData();
  }, []);

  const getNotificationData = async () => {
    setNotificationLoader(true);
    const { data } = await api.fetchNotificationList(page, limit);
    console.log("second data -- ", data);
    if (data) {
      console.log("dataaaa  - ", data);
      setNotificationCount(data?.data?.unReadCount);
      setNotificationData(data?.data?.data);
    }
    setNotificationLoader(false);
  };

  const loadMore = async (e) => {
    e.preventDefault();
    limit = limit + 20;

    const { data } = await api.fetchNotificationList(page, limit);
    console.log("noti length -- ", data?.data?.data?.length);
    if (data?.data?.data?.length === 0) {
      limit = limit - 2;
      return;
    } else {
      console.log("notification dropdown  - ", data);
      setNotificationCount(data?.data?.unReadCount);
      setNotificationData(data?.data?.data);
    }
  };

  const clearHandler = async (e) => {
    e.preventDefault();
    const { data } = await api.clearNotification();
    console.log("Clear notification", data);
    if (data?.data === true) {
      // toast(data?.message);
      setNotificationData([]);
      setNotificationCount(0);
    } else {
      toast("Something went wrong! Try again");
    }
  };

  // console.log("notificationData -- ", notificationData);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    setTypedWord(e.target.value);
    if (driver === true) {
      if (e.target.value.length >= 1) {
        dispatch(listSearch(1, 10, e.target.value));
      } else {
        dispatch(list(1, 10));
      }
    }

    if (shipment === true) {
      if (e.target.value.length >= 1) {
        dispatch(listShipmentSearch(1, 10, "createdAt", -1, e.target.value));
      } else {
        dispatch(listShipment(1, 10, "createdAt", -1));
      }
    }
  };

  const redirectHandler = async (e, noti) => {
    e.preventDefault();

    let data = null;

    if (noti?.type === "expireTruck") {
      data = await api.readNotification(noti?._id);
      navigate(`/units-moreinfo/${noti?.truckData?.unitNumber}`);
    } else if (noti?.type === "expireTrailer") {
      await api.readNotification(noti?._id);
      navigate(`/trailers-moreinfo/${noti?.trailerId}`);
    } else if (noti?.type === "expireDriver") {
      await api.readNotification(noti?._id);
      navigate(`/driver-moreinfo/${noti?.driverData?.fullName}`);
    } else if (noti?.type === "service") {
      await api.readNotification(noti?._id);
      navigate(`/trailers-moreinfo/${noti?.trailerId}`);
    } else if (noti?.type === "shipment") {
      await api.readNotification(noti?._id);
      // navigate(`/Shipment-moreinfo/${noti?.shipmentId}`);
      navigate(`/alarm`);
    } else if (noti?.type === "alarm") {
      await api.readNotification(noti?._id);
      // navigate(`/Shipment-moreinfo/${noti?.shipmentId}`);
      navigate(`/alarm`);
    }
    getNotificationData();
  };

  // console.log(isDropdownOpen, "-- isDropdownOpen");

  return (
    <div className="header">
      {/* <div className="container-fluid">
        <div className="row py-3">
          <div className="col-12 text-center">
            <img src="./assets/hefson.png" alt="" />
          </div>
        </div>
      </div> */}
      <div className="container">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <div className="slider">
              <OwlCarousel
                autoplay={true}
                items={1}
                className="owl-theme"
                loop
                margin={8}
                dots={false}
              >
                {/* <div>
                  <img className="img" src={headerImg} alt="" />
                </div> */}
                {titleProp && (
                  <div>
                    <h2 className="text-capitalize">{titleProp}</h2>
                  </div>
                )}
              </OwlCarousel>

              {/* {titleProp ? (
                <h2 className="text-capitalize">{titleProp}</h2>
              ) : (
                <OwlCarousel
                  autoplay={true}
                  items={1}
                  className="owl-theme"
                  loop
                  margin={8}
                  dots={false}
                >
                  <div>
                    <img className="img" src="./assets/hefson.svg" alt="" />
                  </div>
                </OwlCarousel>
              )} */}
            </div>
          </div>

          {searching && (
            <div className="col-2 ">
              <div
                style={{
                  background: "white",
                  paddingRight: "10px",
                  borderRadius: "20px",
                  // width: "200px",
                }}
                className="search text-end cursor-pointer d-flex align-items-center"
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={handleSearch}
                  // onBlur={() => setDropdownData([])}
                />
                <img src={searchIcon} alt="" className="ms-2" />
              </div>
            </div>
          )}

          {/* {!searching && (
            <div className="icon col-2 text-end">
              {!notificationLoader && (
                <i
                  class="fa-solid fa-bell "
                  style={{ fontSize: "30px" }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ></i>
              )}
              {notificationCount > 0 && (
                <span className="notification-count">{notificationCount}</span>
              )}
            </div>
          )} */}

          {isDropdownOpen && (
            <div className="dropdown-content">
              <div className="dropdown-header">
                <h2 className="mb-0">Notification</h2>
              </div>
              {Object.keys(notificationData).length === 0 && (
                <div className="nonotification">
                  <h4>No Notification at the moment</h4>
                </div>
              )}
              <div className="dropdown-list">
                {/* Render your notificationData.text content here */}
                {notificationData &&
                  notificationData?.map((noti) => {
                    return (
                      <div
                        className={`${
                          loginRole === 1
                            ? "read"
                            : noti?.isRead === true
                            ? "read"
                            : "unread"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => redirectHandler(e, noti)}
                        key={noti?._id}
                      >
                        {noti.text}
                      </div>
                    );
                  })}
              </div>
              <div className="dropdown-footer-buttons">
                <button onClick={clearHandler}>Clear</button>
                <button onClick={loadMore}>More</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponentTrailer;

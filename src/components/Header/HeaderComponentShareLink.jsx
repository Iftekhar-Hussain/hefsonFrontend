import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import searchIcon from "../../assets/icons/Search.svg";
import headerImg from "../../assets/hefson.svg";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { list, listSearch } from "../../actions/driver";
import { listShipment, listShipmentSearch } from "../../actions/shipment";
import * as api from "../../api/index";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// const baseURL = process.env.REACT_APP_BASEURL;

// const loginToken = Cookies.get("loginToken")
//   ? JSON.parse(Cookies.get("loginToken"))
//   : null;
// const header = {
//   headers: {
//     Authorization: loginToken,
//   },
// };

const loginRole = Cookies.get("role") ? JSON.parse(Cookies.get("role")) : null;

const HeaderComponentShareLink = ({
  titleProp,
  searching,
  temp,
  shipment,
  driver,
}) => {
  console.log("temp -- ", temp);
  const currentURL = window.location.href;
  const [typedWord, setTypedWord] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0); // Initial count
  const [notificationLoader, setNotificationLoader] = useState(false);

  const [notificationData, setNotificationData] = useState({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(40);

  let { id } = useParams();
  const [sendmail, setSendmail] = useState("");

  const handleSendMail = async (e) => {
    e.preventDefault();
    console.log("send mail", sendmail,temp);

    const { data } = await api.sendShipmentMail(id, sendmail, temp);
    console.log("send mail ", data);
    toast(data.message);
    if (data.status === 200) {
      clearSendMail();
    }
  };

  const clearSendMail = () => {
    setSendmail("");
  };

  const navigate = useNavigate();

  useEffect(() => {
    getNotificationData();
    return () => {
      setNotificationLoader(false);
    };
  }, []);

  const getNotificationData = async () => {
    try {
      const { data } = await api.fetchNotificationList(page, limit);
      console.log("second data -- ", data);
      if (data) {
        console.log("dataaaa  - ", data);
        setNotificationCount(data?.data?.unReadCount);
        setNotificationData(data?.data?.data);
        setNotificationLoader(false);
      } else {
        setNotificationLoader(true);
      }
    } catch (error) {
      setNotificationLoader(true);
      console.log("notification error", error);
    }
  };

  console.log("notificationLoader -- ", notificationLoader);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    setTypedWord(e.target.value);
    if (driver === true) {
      if (e.target.value.length >= 1) {
        dispatch(listSearch(1, 100, "createdAt", -1, e.target.value));
      } else {
        dispatch(list(1, 10, "createdAt", -1));
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
      navigate(`/Shipment-moreinfo/${noti?.shipmentId}`);
    } else if (noti?.type === "alarm") {
      await api.readNotification(noti?._id);
      navigate(`/Shipment-moreinfo/${noti?.shipmentId}`);
    }
    getNotificationData();
  };

  const clearHandler = async (e) => {
    e.preventDefault();
    const { data } = await api.clearNotification();
    console.log("Clear notification", data);
    if (data?.data === true) {
      toast(data?.message);
    } else {
      toast("Something went wrong! Try again");
    }
  };

  const loadMore = async (e) => {
    e.preventDefault();
    let pageNo = page + 1;
    let limitNo = limit + 40;
    setPage(pageNo);
    setLimit(limitNo);

    const { data } = await api.fetchNotificationList(pageNo, limitNo);
    if (data?.data?.data?.length === 0) {
      return;
    } else {
      console.log("notification dropdown  - ", data);
      setNotificationCount(data?.data?.unReadCount);
      setNotificationData(data?.data?.data);
    }
  };
  return (
    <div className="header">
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
                {titleProp && (
                  <div>
                    <h2 className="text-capitalize">{titleProp}</h2>
                  </div>
                )}
              </OwlCarousel>
            </div>
          </div>

          {searching && (
            <div className="col-2 ">
              <div
                style={{
                  background: "white",
                  paddingRight: "10px",
                  borderRadius: "20px",
                }}
                className="search text-end cursor-pointer d-flex align-items-center"
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={handleSearch}
                />
                <img src={searchIcon} alt="" className="ms-2" />
              </div>
            </div>
          )}

{
  !searching && (
    <div className="icon col-2 text-end">
      <i
        title="Send Link"
        className="fa-solid fa-paper-plane"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        style={{
          marginRight: "20px",
          fontSize: "25px",
          cursor: "pointer",
        }}
      ></i>

      {/* {notificationLoader === false && (
        <i
          title="Notifications"
          class="fa-solid fa-bell "
          style={{ fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        ></i>
      )}
      {notificationLoader === false && notificationCount > 0 && (
        <span className="notification-count">{notificationCount}</span>
      )} */}
    </div>
  )
}


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
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Send shipment link
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                // onClick={() => clear()}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-10 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      value={sendmail}
                      onChange={(e) => setSendmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-border me-3"
                    data-bs-dismiss="modal"
                    onClick={handleSendMail}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponentShareLink;

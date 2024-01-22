import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { list, listSearchDevice } from "../actions/device";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import TrailerMap from "../components/TrailerMap/TrailerMap";
import ToolBoxAdmin from "./ToolBoxAdmin";
import { PropagateLoader, ClipLoader } from "react-spinners";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const Devices = () => {
  const ref = useRef();
  const ref2 = useRef();
  const dispatch = useDispatch();
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    if (loginToken === null) {
      window.location.replace("/login");
    }
    dispatch(list(1, 10));
  }, []);

  const { loading, device } = useSelector((state) => state.deviceReducer);

  const titleProp = JSON.parse(Cookies.get("businessName"));

  //function to handle the geocoding request and retrieve the address
  function getAddressFromLatLng(lat, lng) {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject("No address found");
          }
        } else {
          reject("Geocoder failed due to: " + status);
        }
      });
    });
  }
  const [address, setAddress] = useState("");

  const handleGetAddress = async (lat, lng) => {
    try {
      const address = await getAddressFromLatLng(lat, lng);
      setAddress(address);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  handleGetAddress(
    sensor?.realTimeData?.FLatitude,
    sensor?.realTimeData?.FLongitude
  );

  const [reloadMap, setReloadMap] = useState(false); // State for triggering map reload
  const handleReloadMap = () => {
    setReloadMap(!reloadMap); // Toggle reloadMap state to trigger map reload
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = debounce(async (e) => {
    if (e.target.value.length >= 1) {
      dispatch(listSearchDevice(1, 20, e.target.value));
    } else {
      dispatch(list(1, 10));
    }
  }, 1000);

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} />
        <div className="row ms-sm-4 ms-0">
          <div className="col-md-5">
            <div className="row">
              <div className="col-12">
                <div className="searchcontent mt-2 mt-md-5 mw-100">
                  <div className="searchBox">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      onInput={handleSearch}
                    />
                    <div className="searchIcon">
                      <img src="./assets/icons/Search.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-30 viewallContainer">
              <div className="col-12 mb-3">
                <div className="spaceBetween">
                  <h5>Recent Devices</h5>
                  <Link
                    // to="/DeviceList"
                    to={
                      Cookies.get("role")
                        ? JSON.parse(Cookies.get("role")) === 1
                          ? "/admin-devicelist"
                          : "/DeviceList"
                        : ""
                    }
                  >
                    View All{" "}
                    <img src="./assets/icons/rightArrowBlue.svg" alt="" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="row siteOptions">
              <div className="col-12">
                <div className="homeNavigation">
                  {loading ? (
                    <div className="loader">
                      <PropagateLoader
                        cssOverride={override}
                        size={15}
                        color={"#000"}
                        loading={loading}
                      />
                    </div>
                  ) : device?.length === 0 ? (
                    <h5>No device to list. Please add some devices to show</h5>
                  ) : (
                    device &&
                    device.slice(0, 8).map((data) => (
                      <div className="navBtnBox">
                        <div className="navBtn">
                          {/* <div className="navTools">
                            <div
                              className="onlineDot"
                              data-bs-toggle="tooltip"
                            ></div>

                            <div className="editBox">
                              <i
                                class="fa-solid fa-pencil"
                                // data-bs-toggle="modal"
                                // data-bs-target="#exampleModal"
                                title="Edit"
                              ></i>
                              <i
                                class="fa-solid fa-trash-can"
                                title="Delete"
                              ></i>
                            </div>
                          </div> */}
                          <Link to={`/Devices-moreinfo/${data?._id}`}>
                            <img src="./assets/device.png" alt="" />
                          </Link>
                        </div>
                        <p className="mt-3">{data.FAssetID}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* </div> */}

              {JSON.parse(Cookies.get("role")) === 1 ? (
                <ToolBoxAdmin />
              ) : (
                <ToolBox />
              )}
            </div>
            {/* sensonr info */}
            <div className="row my-4">
              <div className="col-12">
                <div className="addressBox">
                  <div className="battery">
                    <h5>
                      {!sensor?.trailerData?.unitNumber
                        ? "Trailer NA"
                        : sensor?.trailerData?.unitNumber}
                    </h5>
                    <div className="icons">
                      <div className="iconBox">
                        <img src="./assets/icons/temperature.svg" alt="" />
                      </div>
                      <h6>{sensor?.realTimeData?.FTemperature1.toFixed(1)}</h6>

                      <div className="iconBox">
                        <img src="./assets/icons/battery.svg" alt="" />
                      </div>
                      <h6>{sensor?.realTimeData?.FBattery}%</h6>
                      <div className="locaion">
                        <img src="./assets/icons/gps.svg" alt="" />
                      </div>
                      <div className="back">
                        <Link
                          // to="/DeviceList"
                          to={`/Devices-moreinfo/${sensor?._id}`}
                        >
                          <img src="./assets/icons/rightArrow.svg" alt="" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="addresss mt-3">
                    <div className="icon">
                      <img src="./assets/icons/Calendar.svg" alt="" />
                    </div>
                    <div className="text">
                      <h6>
                        <Moment format="hh:mm A dddd  D, MMMM YYYY">
                          {sensor?.realTimeData?.FGPSTime}
                        </Moment>
                      </h6>
                    </div>
                  </div>
                  <div className="addresss mt-2">
                    <div className="icon">
                      <img src="./assets/icons/Location.svg" alt="" />
                    </div>
                    <div className="text">
                      <h6>{address}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7 mapSection">
            <div className="sideGradient"></div>
            <div className="topGradient"></div>
            <div className="rightGradient"></div>
            <div className="bottomGradient"></div>
            <div className="gpsButton" onClick={handleReloadMap}>
              <i class="fa-solid fa-location-crosshairs"></i>
            </div>
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target="#addtrailers"
            >
              Add New Devices
            </button>
            <TrailerMap
              device={device}
              reloadMap={reloadMap}
              setSensor={setSensor}
            />
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="addtrailers"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Device
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Unit Number"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Sensor ID"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Manufacturer"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Model Year"
                      ref={ref2}
                      onChange={(e) => console.log(e.target.value)}
                      onFocus={() => (ref2.current.type = "date")}
                      onBlur={() => (ref2.current.type = "text")}
                    />
                    <img
                      src="./assets/icons/CalendarDate.svg"
                      className="cal"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Number Plate"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Registration Expiry Date"
                      ref={ref}
                      onChange={(e) => console.log(e.target.value)}
                      onFocus={() => (ref.current.type = "date")}
                      onBlur={() => (ref.current.type = "text")}
                    />
                    <img
                      src="./assets/icons/CalendarDate.svg"
                      className="cal"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="State/Province"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <label htmlFor="uploadFile" className="uploadImages">
                      Upload Images
                      <input
                        type="file"
                        className="form-control"
                        placeholder="Upload Image"
                        id="uploadFile"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border"
                data-bs-dismiss="modal"
              >
                Back
              </button>
              <button type="button" className="btn">
                Add Device
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;

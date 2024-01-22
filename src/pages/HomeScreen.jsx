// import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { Link, useNavigate } from "react-router-dom";
import TrailerMap from "../components/TrailerMap/TrailerMap";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { listDevice } from "../actions/device";
import Moment from "react-moment";
import SearchBar from "../components/SearchBar/SearchBar";
import { socket } from "../socket";
import { toast } from "react-toastify";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [dropdownData, setDropdownData] = useState({});
  const [sensor, setSensor] = useState(null);
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    window.onload = function () {
      new window.google.maps.Geocoder();
    };
    if (loginToken === null) {
      window.location.replace("/login");
    }
    // socket.on("receiveMessage", (data) => {
    //   toast(`${data?.message} by ${data?.payload?.senderData?.fullName}`);
    //   // console.log("Received message:", data.message);
    //   // console.log("Received payload:", data.payload);
    // });

    dispatch(listDevice(1, 10));
    const getCurrentTime = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting("Good Morning!");
      } else if (currentHour < 18) {
        setGreeting("Good Afternoon!");
      } else {
        setGreeting("Good Evening!");
      }
    };
    getCurrentTime();
  }, []);

  const { device } = useSelector((state) => state.deviceReducer);
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

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} />
        <div className="row ms-sm-4 ms-0">
          <div className="col-md-4">
            <div className="d-flex">
              <div className="logoBox">
                <img
                  src={
                    Cookies.get("image")
                      ? JSON.parse(Cookies.get("image"))
                      : "./assets/logo.svg"
                  }
                  alt=""
                />
              </div>
              <div className="searchcontent">
                <h5 className="text-capitalize">
                  Hi {JSON.parse(Cookies.get("fullName"))},
                </h5>
                <div className="headingMain">
                  <div>
                    <h2>{greeting}</h2>
                  </div>
                </div>
                <SearchBar setDropdownData={setDropdownData} />
                {dropdownData && Object.keys(dropdownData).length > 0 && (
                  <div className="drop-result">
                    {dropdownData && dropdownData?.sensors?.length > 0 && (
                      <div className="dropdown">
                        <p>sensors</p>
                        {dropdownData?.sensors?.map((sensor) => (
                          <div
                            key={sensor._id}
                            className="dropdownItem"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/Devices-moreinfo/${sensor._id}`)
                            }
                          >
                            {sensor.FVehicleName}
                          </div>
                        ))}
                      </div>
                    )}
                    {dropdownData && dropdownData?.trailers?.length > 0 && (
                      <div className="dropdown">
                        <p>trailers</p>
                        {dropdownData?.trailers?.map((trailer) => (
                          <div
                            key={trailer._id}
                            className="dropdownItem"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/trailers-moreinfo/${trailer._id}`)
                            }
                          >
                            {trailer.unitNumber}
                          </div>
                        ))}
                      </div>
                    )}
                    {dropdownData && dropdownData?.trucks?.length > 0 && (
                      <div className="dropdown">
                        <p className="">trucks</p>
                        {dropdownData?.trucks?.map((truck) => (
                          <div
                            key={truck._id}
                            className="dropdownItem"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/units-moreinfo/${truck.unitNumber}`)
                            }
                          >
                            {truck.unitNumber}
                          </div>
                        ))}
                      </div>
                    )}
                    {dropdownData && dropdownData?.shipments?.length > 0 && (
                      <div className="dropdown">
                        <p>shipments</p>
                        {dropdownData?.shipments?.map((shipment) => (
                          <div
                            key={shipment._id}
                            className="dropdownItem"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/Shipment-moreinfo/${shipment._id}`)
                            }
                          >
                            {shipment.loadId}
                          </div>
                        ))}
                      </div>
                    )}
                    {dropdownData && dropdownData?.users?.length > 0 && (
                      <div className="dropdown">
                        <p>Users</p>
                        {dropdownData?.users?.map((user) => (
                          <div
                            key={user._id}
                            className="dropdownItem"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/driver-moreinfo/${user.fullName}`)
                            }
                          >
                            {user.fullName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* <div className="searchBox mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                  <div className="searchIcon">
                    <img src="./assets/icons/Search.svg" alt="" />
                  </div>
                </div> */}
              </div>
            </div>
            <div className="row mt-5 siteOptions">
              <div className="col-12 ms-auto">
                <div className="row">
                  <div className="col-12">
                    <div className="homeNavigation">
                      {/* <div className="navBtnBox">
                        <Link to="/devices">
                          <div className="homenavBtn">
                            <img src="./assets/Devices.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Devices</p>
                      </div>
                      <div className="navBtnBox">
                        <Link to="/units">
                          <div className="homenavBtn">
                            <img src="./assets/Units.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Units</p>
                      </div> */}
                      <div className="navBtnBox">
                        <Link to="/Trailers">
                          <div className="homenavBtn">
                            <img src="./assets/Trailers.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Trailers</p>
                      </div>
                      <div className="navBtnBox">
                        <Link to="/Alarm">
                          <div className="homenavBtn">
                            <img src="./assets/TempAlert.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Temp Alert</p>
                      </div>
                      <div className="navBtnBox">
                        <Link to="/driver">
                          <div className="homenavBtn">
                            <img src="./assets/Drivers.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Drivers</p>
                      </div>
                      <div className="navBtnBox">
                        <Link to="/completeshipment">
                          <div className="homenavBtn">
                            <img src="./assets/Completed.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Completed</p>
                      </div>
                      <div className="navBtnBox">
                        <Link to="/Shipment">
                          <div className="homenavBtn">
                            <img src="./assets/Active.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Active</p>
                      </div>
                      <div className="navBtnBox">
                        <Link to="/new-shipment">
                          <div className="homenavBtn">
                            <img src="./assets/CreateNew.png" alt="" />
                          </div>
                        </Link>
                        <p className="mt-3">Create New</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      <h6>{sensor?.realTimeData?.FTemperature1?.toFixed(1)}</h6>

                      <div className="iconBox">
                        <img src="./assets/icons/battery.svg" alt="" />
                      </div>
                      <h6>
                        {sensor?.realTimeData?.FBattery >= 100
                          ? 100
                          : sensor?.realTimeData?.FBattery}
                        %
                      </h6>
                      <div className="locaion">
                        <img src="./assets/icons/gps.svg" alt="" />
                      </div>
                      {!sensor?.trailerData?.unitNumber ? (
                        ""
                      ) : (
                        <div className="back" title="Trailer detail">
                          <Link
                            to={`/trailers-moreinfo/${sensor?.trailerData?._id}`}
                          >
                            <img src="./assets/icons/rightArrow.svg" alt="" />
                          </Link>
                        </div>
                      )}
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

          {device ? (
            <div className="col-md-8 mapSection">
              <div className="sideGradient"></div>
              <div className="topGradient"></div>
              <div className="rightGradient"></div>
              <div className="bottomGradient"></div>
              <div className="gpsButton" onClick={handleReloadMap}>
                <i class="fa-solid fa-location-crosshairs"></i>
              </div>
              <TrailerMap
                device={device}
                reloadMap={reloadMap}
                setSensor={setSensor}
              />
            </div>
          ) : (
            <h4>Sensor coordinates not available</h4>
          )}
        </div>
      </div>
      <ToolBox />
    </div>
  );
};

export default HomeScreen;

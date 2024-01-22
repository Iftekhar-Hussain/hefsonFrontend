import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/Header/HeaderComponent";
import { Link, useNavigate } from "react-router-dom";
import TrailerMap from "../components/TrailerMap/TrailerMap";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { listDevice } from "../actions/device";
import Moment from "react-moment";
import ToolBoxAdmin from "./ToolBoxAdmin";
import { getDashboard } from "../actions/dashboard";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    if (loginToken === null) {
      window.location.replace("/login");
    }
    dispatch(getDashboard());
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

  const { dashboard } = useSelector((state) => state.dashboardReducer);

  const { device } = useSelector((state) => state.deviceReducer);
  const [sensor, setSensor] = useState(null);

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

  console.log("sensor --- ", sensor);

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} />
        <div className="row ms-sm-4 ms-0">
          <div className="col-md-4">
            <div className="liveMonitoring">Live Monitoring</div>

            <div className="row mt-5 siteOptions">
              <div className="col-12 ms-auto">
                <div className="row">
                  <div className="col-12">
                    <div className="adminNavigation">
                      <div className="navBtnBox">
                        <div className="homenavBtn">
                          <p>Active</p>
                          <h3>{dashboard?.activeSensor}</h3>
                        </div>
                      </div>
                      <div className="navBtnBox">
                        <div className="homenavBtn">
                          <p>Alarm</p>
                          <h3>{dashboard?.alarm}</h3>
                        </div>
                      </div>
                      <div className="navBtnBox">
                        <div className="homenavBtn">
                          <p>Inactive</p>
                          <h3>{dashboard?.inActiveSensor}</h3>
                        </div>
                      </div>
                      <div className="navBtnBox">
                        <div className="homenavBtn">
                          <p>Total</p>
                          <h3>{dashboard?.totalSensor}</h3>
                        </div>
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
                            to={`/trailers-moreinfo-admin/${sensor?.trailerData?._id}`}
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
        </div>
      </div>
      <ToolBoxAdmin />
    </div>
  );
};

export default AdminDashboard;

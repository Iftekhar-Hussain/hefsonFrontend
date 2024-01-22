import React from "react";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { toast } from "react-toastify";
import { listNotifications } from "../actions/notifications";
import Moment from "react-moment";

const Notifications = () => {
  const titleProp = "Notifications";
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listNotifications(1, 20));
  }, []);

  const { loading, notifications, Length, unReadCount } = useSelector(
    (state) => state.notificationReducer
  );

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    async function fetchAddresses() {
      try {
        setIsLoading(true);
        const resolvedAddresses = [];

        for (const data of notifications) {
          let address;
          if (data?.type === "alarm") {
            address = await getAddressFromLatLng(
              data?.latitude,
              data?.longitude
            );
          }
          console.log("address -- ", address);
          resolvedAddresses.push(address);
        }

        setAddresses(resolvedAddresses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    }

    fetchAddresses();
  }, [notifications, pageNumber]);

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(20 * (pageNumber - 1))) {
        setHasMore(false);
        console.log("hasMore false");
      } else {
        setHasMore(true);
        dispatch(listNotifications(pageNumber, 20));
        setPageNumber((prev) => prev + 1);
        console.log("hasMore true");
      }
    } catch (error) {
      toast("Error fetching Posts!");
    }
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };
  const [activeTab, setActiveTab] = useState("alarm");

  const handleButtonClick = (e, data) => {
    let targetPath = "";
    switch (data?.type) {
      case "expireTrailer":
        targetPath = `/trailers-moreinfo/${data?.trailerData?._id}`;
        break;
      case "expireTruck":
        targetPath = `/units-moreinfo/${data?.truckData?.unitNumber}`;
        break;
      case "expireDriver":
        targetPath = `/driver-moreinfo/${data?.driverData?.fullName}`;
        break;
      case "shipment":
        targetPath = `/Shipment-moreinfo/${data?.shipmentData?._id}`;
        break;
      case "service":
        targetPath = `/trailers-moreinfo/${data?.trailerData?._id}`;
        break;
      case "alarm":
        targetPath = `/Shipment-moreinfo/${data?.shipmentData?._id}`;
        break;
      default:
        targetPath = "/alarm";
        break;
    }

    navigate(targetPath);
  };

  return (
    <div className="Notifications">
      <div className="container-fluid">
        <HeaderComponent
          titleProp={titleProp}
          searching={false}
          shipment={true}
          driver={false}
        />
        <div className="row ms-4">
          <div className="col-12">
            <div class="tab-content">
              <div
                className={`tab-pane ${
                  activeTab === "alarm" ? "active" : "fade"
                }`}
                id="home"
              >
                <div className="row">
                  {loading === false && Length === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      No Notification to display
                    </div>
                  ) : null}

                  {loading && notifications?.length === 0 ? (
                    <div className="loader">
                      <PropagateLoader
                        cssOverride={override}
                        size={15}
                        color={"#000"}
                        loading={loading}
                      />
                    </div>
                  ) : (
                    <InfiniteScroll
                      dataLength={notifications?.length}
                      hasMore={hasMore}
                      next={() => fetchDataOnScroll()}
                      loader={
                        <div className="loader">
                          <ClipLoader size={30} color={"#000"} loading={true} />
                        </div>
                      }
                      endMessage={
                        <div className="row mt-4">
                          <div className="col text-center">
                            <p style={{ textAlign: "center" }}>
                              <b>
                                {notifications?.length === 0
                                  ? ""
                                  : "Yay! You have seen it all"}
                              </b>
                            </p>
                          </div>
                        </div>
                      }
                      style={{ display: "flex", flexWrap: "wrap" }}
                      className="row"
                    >
                      {notifications &&
                        notifications.map((data, index) => (
                          <div className="col-md-6 mt-3" key={index}>
                            <div className="alarmBox">
                              <div className="spaceBetween">
                                <button
                                  className="btn"
                                  onClick={(e) => handleButtonClick(e, data)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {data?.type === "expireTrailer"
                                    ? data?.trailerData?.unitNumber
                                    : data?.type === "expireTruck"
                                    ? data?.truckData?.unitNumber
                                    : data?.type === "expireDriver"
                                    ? data?.driverData?.id
                                    : data?.type === "shipment"
                                    ? data?.shipmentData?.loadId
                                    : data?.type === "service"
                                    ? data?.trailerData?.unitNumber
                                    : data?.type === "alarm"
                                    ? data?.shipmentData?.loadId
                                    : "Not available"}
                                </button>
                              </div>
                              <div className="location">
                                <div className="data">
                                  <p className="mb-0 fw-bold">
                                    {data?.text}
                                    {data?.type === "alarm" &&
                                      `( ${data?.temperature} F)`}
                                  </p>
                                  <div className="date">
                                    <Moment format="D,MMM YYYY HH:mm:ss">
                                      {data?.createdAt}
                                    </Moment>
                                  </div>
                                </div>
                              </div>
                              <p className="mb-0">
                                {isLoading ? (
                                  <p>Loading address...</p>
                                ) : (
                                  <p className="mb-0">
                                    {data?.type === "alarm" && (
                                      <i
                                        class="fa-solid fa-location-dot"
                                        style={{ margin: "5px" }}
                                      ></i>
                                    )}

                                    {data?.latitude &&
                                      data?.longitude &&
                                      addresses[index]}
                                  </p>
                                )}
                                {/* {data?.shipmentData?.shipper[0]?.pickupAddress}{" "}
                                -{" "}
                                {
                                  data?.shipmentData?.receiver[0]
                                    ?.deliveryAddress
                                } */}
                              </p>
                            </div>
                          </div>
                        ))}
                    </InfiniteScroll>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToolBox />
    </div>
  );
};

export default Notifications;

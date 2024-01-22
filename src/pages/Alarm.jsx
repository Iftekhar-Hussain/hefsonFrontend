import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listAlarm, listAlarmPast } from "../actions/alarm";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { toast } from "react-toastify";
import { alarmEventData, eventData } from "../utils/alarmEvent";
import Moment from "react-moment";

const Alarm = () => {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [pageNumberPast, setPageNumberPast] = useState(2);

  useEffect(() => {
    dispatch(listAlarmPast(1, 20, "past"));
    dispatch(listAlarm(1, 20, "current")); //need to set status current
  }, []);

  const { loading, alarm, alarmPast, Length, LengthPast } = useSelector(
    (state) => state.alarmReducer
  );

  const fetchDataOnScrollPast = async () => {
    try {
      if (Number(LengthPast) <= Number(20 * (pageNumberPast - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listAlarmPast(pageNumberPast, 20, "past"));
        setPageNumberPast((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };
  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(20 * (pageNumber - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listAlarmPast(pageNumber, 20, "past"));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };
  const [activeTab, setActiveTab] = useState("alarm");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

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

        if (activeTab === "alarm") {
          for (const data of alarm) {
            const address = await getAddressFromLatLng(
              data?.FLatitude,
              data?.FLongitude
            );
            console.log("address -- ", address);
            resolvedAddresses.push(address);
          }
        } else {
          for (const data of alarmPast) {
            const address = await getAddressFromLatLng(
              data?.FLatitude,
              data?.FLongitude
            );
            console.log("address -- ", address);
            resolvedAddresses.push(address);
          }
        }

        setAddresses(resolvedAddresses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    }

    fetchAddresses();
  }, [activeTab, alarm, alarmPast, pageNumber]);

  return (
    <div className="Alarm">
      <div className="container-fluid">
        <HeaderComponent />
        <div className="row ms-4">
          <div className="col-12">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <div
                  className={`nav-link ${
                    activeTab === "alarm" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("alarm")}
                  style={{ cursor: "pointer" }}
                >
                  Alarm
                </div>
              </li>
              <li class="nav-item">
                <div
                  className={`nav-link ${
                    activeTab === "past-alarm" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("past-alarm")}
                  style={{ cursor: "pointer" }}
                >
                  Past Alarm{" "}
                </div>
              </li>
            </ul>

            <div class="tab-content">
              <div
                className={`tab-pane ${
                  activeTab === "alarm" ? "active" : "fade"
                }`}
                id="home"
              >
                <div className="row">
                  {/* alarm */}
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
                      No alarm to display
                    </div>
                  ) : null}

                  {loading && alarm.length === 0 ? (
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
                      dataLength={alarm?.length}
                      hasMore={hasMore}
                      next={() => fetchDataOnScroll()}
                      loader={
                        (loading && alarm?.length === 0) ||
                        alarm?.length === Length ? (
                          <div className="loader">
                            <ClipLoader
                              size={30}
                              color={"#000"}
                              loading={loading}
                            />
                          </div>
                        ) : null
                      }
                      endMessage={
                        <div className="row mt-4">
                          <div className="col text-center">
                            <p style={{ textAlign: "center" }}>
                              <b>
                                {alarm?.length === 0
                                  ? ""
                                  : "Yay! You have seen it all"}
                              </b>
                            </p>
                          </div>
                        </div>
                      }
                      style={{ display: "flex", flexWrap: "wrap" }} //define style here
                      className="row"
                    >
                      {alarm &&
                        alarm.map((data, index) => (
                          <div className="col-md-6 mt-3" key={index}>
                            <div className="alarmBox">
                              <div className="spaceBetween">
                                <button className="btn">
                                  {data?.ShipmentData?.loadId}
                                </button>
                                <Link
                                  to={`/Shipment-moreinfo/${data?.ShipmentData?._id}`}
                                >
                                  More info{" "}
                                  <i class="fa-solid fa-arrow-right"></i>
                                </Link>
                              </div>
                              <div className="location">
                                <div className="data">
                                  <i class="fa-solid fa-location-dot"></i>
                                  {/* <p className="mb-0 fw-bold">
                                    {`${
                                      data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                        ","
                                      )[0]
                                    }, ${
                                      data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                        ","
                                      )[
                                        data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                          ","
                                        ).length - 2
                                      ]
                                        ? data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                            ","
                                          )[
                                            data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                              ","
                                            ).length - 2
                                          ]
                                        : ""
                                    }`}{" "}
                                    -{" "}
                                    {`${
                                      data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                        ","
                                      )[0]
                                    }, ${
                                      data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                        ","
                                      )[
                                        data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                          ","
                                        ).length - 2
                                      ]
                                        ? data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                            ","
                                          )[
                                            data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                              ","
                                            ).length - 2
                                          ]
                                        : ""
                                    }`}
                                  </p> */}
                                  <p className="mb-0 fw-bold">
                                    {isLoading ? (
                                      <p>Loading address...</p>
                                    ) : (
                                      <p className="mb-0">
                                        {data?.FLatitude &&
                                          data?.FLongitude &&
                                          addresses[index]}
                                      </p>
                                    )}
                                  </p>

                                  <div className="date">
                                    <Moment format="D,MMM YYYY HH:mm:ss">
                                      {data?.FGPSTime}
                                    </Moment>
                                  </div>
                                </div>
                                <div className="description">
                                  <p className="mb-0">
                                    {data?.type === 1
                                      ? ` ${
                                          data?.FTemperature1 <
                                          data?.ShipmentData?.temperature?.min
                                            ? "Low "
                                            : data?.FTemperature1 >
                                              data?.ShipmentData?.temperature
                                                ?.max
                                            ? "High"
                                            : ""
                                        } Temperature Alert ( ${
                                          data?.FTemperature1
                                        } F)`
                                      : "Door Alert"}

                                    {/* {
                                      alarmEventData?.find(
                                        (event) =>
                                          event.eventType ===
                                          JSON.parse(data?.FDescribeJSON)?.T
                                      ).eventName
                                    } */}

                                    {/* -{JSON.parse(data?.FDescribeJSON)?.N} */}
                                    {/* {
                                      eventData.find(
                                        (event) =>
                                          event.eventType === data.FDataType
                                      ).eventName
                                    } */}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </InfiniteScroll>
                  )}
                </div>
              </div>
              <div
                className={`tab-pane ${
                  activeTab === "past-alarm" ? "active" : "fade"
                }`}
                id="menu1"
              >
                <div className="row">
                  {/* past alarm */}
                  {loading === false && LengthPast === 0 ? (
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
                      No past alarm to display
                    </div>
                  ) : null}

                  {loading && alarmPast.length === 0 ? (
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
                      dataLength={alarmPast?.length}
                      hasMore={hasMore}
                      next={() => fetchDataOnScrollPast()}
                      loader={
                        (loading && alarmPast?.length === 0) ||
                        alarmPast?.length === LengthPast ? (
                          <div className="loader">
                            <ClipLoader
                              size={30}
                              color={"#000"}
                              loading={loading}
                            />
                          </div>
                        ) : null
                      }
                      endMessage={
                        <div className="row mt-4">
                          <div className="col text-center">
                            <p style={{ textAlign: "center" }}>
                              <b>
                                {alarmPast?.length === 0
                                  ? ""
                                  : "Yay! You have seen it all"}
                              </b>
                            </p>
                          </div>
                        </div>
                      }
                      style={{ display: "flex", flexWrap: "wrap" }} //define style here
                      className="row"
                    >
                      {alarmPast &&
                        alarmPast.map((data, index) => (
                          <div className="col-md-6 mt-3" key={index}>
                            <div className="alarmBox">
                              <div className="spaceBetween">
                                <button className="btn">
                                  {data?.ShipmentData?.loadId}
                                </button>
                                <Link
                                  to={`/Shipment-moreinfo/${data?.ShipmentData?._id}`}
                                >
                                  More info{" "}
                                  <i class="fa-solid fa-arrow-right"></i>
                                </Link>
                              </div>
                              <div className="location">
                                <div className="data">
                                  <i class="fa-solid fa-location-dot"></i>
                                  {/* <p className="mb-0 fw-bold">
                                    {`${
                                      data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                        ","
                                      )[0]
                                    }, ${
                                      data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                        ","
                                      )[
                                        data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                          ","
                                        ).length - 2
                                      ]
                                        ? data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                            ","
                                          )[
                                            data?.ShipmentData?.shipper[0]?.pickupAddress.split(
                                              ","
                                            ).length - 2
                                          ]
                                        : ""
                                    }`}{" "}
                                    -{" "}
                                    {`${
                                      data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                        ","
                                      )[0]
                                    }, ${
                                      data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                        ","
                                      )[
                                        data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                          ","
                                        ).length - 2
                                      ]
                                        ? data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                            ","
                                          )[
                                            data?.ShipmentData?.receiver[0]?.deliveryAddress.split(
                                              ","
                                            ).length - 2
                                          ]
                                        : ""
                                    }`}
                                  </p> */}
                                  <p className="mb-0 fw-bold">
                                    {isLoading ? (
                                      <p>Loading address...</p>
                                    ) : (
                                      <p className="mb-0">
                                        {data?.FLatitude &&
                                          data?.FLongitude &&
                                          addresses[index]}
                                      </p>
                                    )}
                                  </p>

                                  <div className="date">
                                    <Moment format="D,MMM YYYY HH:mm:ss">
                                      {data?.FGPSTime}
                                    </Moment>
                                  </div>
                                </div>
                                <div className="description">
                                  <p className="mb-0">
                                    {data?.type === 1
                                      ? ` ${
                                          data?.FTemperature1 <
                                          data?.ShipmentData?.temperature?.min
                                            ? "Low "
                                            : data?.FTemperature1 >
                                              data?.ShipmentData?.temperature
                                                ?.max
                                            ? "High"
                                            : ""
                                        } Temperature Alert`
                                      : "Door Alert"}{" "}
                                    &#40; {data?.FTemperature1.toFixed(2)} &#41;
                                    {/* {data?.FDescribeJSON &&
                                      alarmEventData?.find(
                                        (event) =>
                                          event.eventType ===
                                          JSON.parse(data?.FDescribeJSON)?.T
                                      ).eventName}
                                    -
                                    {data?.FDescribeJSON &&
                                      JSON.parse(data?.FDescribeJSON)?.N} */}
                                    {/* {
                                      eventData.find(
                                        (event) =>
                                          event.eventType === data.FDataType
                                      ).eventName
                                    } */}
                                    {/* {JSON.parse(data?.FDescribeJSON)?.T} */}
                                  </p>
                                </div>
                              </div>
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
        <ToolBox />
      </div>
    </div>
  );
};

export default Alarm;

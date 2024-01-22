import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ShipmentMap from "../components/ShipmentMap/ShipmentMap";
import { useDispatch, useSelector } from "react-redux";
import { listShipmentCancel, listShipmentComplete } from "../actions/shipment";
import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { PropagateLoader, ClipLoader } from "react-spinners";
import GeocodingComponent from "../components/GeocodingComponent/GeocodingComponent";
import TempChart from "../components/TempChart/TempChart";
import * as api from "../api/index";

const CompleteShipment = () => {
  const dispatch = useDispatch();

  const titleProp = "Complete Shipment";

  const [toggle, setToggle] = useState(true);
  const [currentId, setCurrentId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [activeTab, setActiveTab] = useState("complete");

  const [isChartAnimated, setIsChartAnimated] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    // dispatch(listShipmentCancel(1, 10, "createdAt", -1));
    handleTabClick("complete");
    dispatch(listShipmentComplete(1, 10, "createdAt", -1));
    return () => {
      setLatitudeShipper([]);
      setLongitudeShipper([]);
      setLatitudeReceiver([]);
      setLongitudeReceiver([]);
      setMarkerLat(0);
      setMarkerLng(0);
      setCurrentId(0);
    };
  }, []);

  const shipmentData = useSelector((state) => state.shipmentReducer);
  const { loading, shipmentComplete, shipmentCancel, Length } = shipmentData;

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(shipmentComplete?.length)) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listShipmentComplete(pageNumber, 10, "createdAt", -1));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };

  const fetchCancelDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(shipmentComplete?.length)) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listShipmentCancel(pageNumber, 10, "createdAt", -1));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };

  const [latitudeShipper, setLatitudeShipper] = useState([]);
  const [longitudeShipper, setLongitudeShipper] = useState([]);
  const [latitudeReceiver, setLatitudeReceiver] = useState([]);
  const [longitudeReceiver, setLongitudeReceiver] = useState([]);
  const [markerLat, setMarkerLat] = useState(0);
  const [markerLng, setMarkerLng] = useState(0);
  const [sendmail, setSendmail] = useState("");

  const [anyHistory, setAnyHistory] = useState([]);

  useEffect(() => {}, [
    latitudeShipper,
    longitudeShipper,
    latitudeReceiver,
    longitudeReceiver,
  ]);
  console.log(
    "latitudeShipper - ",
    latitudeShipper,
    "longitudeShipper - ",
    longitudeShipper,
    "latitudeReceiver - ",
    latitudeReceiver,
    "longitudeReceiver - ",
    longitudeReceiver,
    "marker",
    markerLat,
    markerLng
  );

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  const getDayFromDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    return dayOfWeek;
  };

  const [reloadMap, setReloadMap] = useState(false); // State for triggering map reload
  const handleReloadMap = () => {
    console.log("clickkkk");
    setReloadMap(!reloadMap); // Toggle reloadMap state to trigger map reload
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    console.log("send mail", sendmail);

    const { data } = await api.sendShipmentMail(currentId, sendmail);
    console.log("send mail ", data);
    toast(data.message);
    if (data.status === 200) {
      clearSendMail();
    }
  };

  const clearSendMail = () => {
    setSendmail("");
  };

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

  return (
    <div className="shipment">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} />
      </div>

      <ul class="nav nav-tabs">
        <li class="nav-item">
          <div
            className={`nav-link ${
              activeTab === "complete" ? "active" : "inactive"
            }`}
            onClick={() => {
              handleTabClick("complete");
              dispatch(listShipmentComplete(1, 10, "createdAt", -1));
            }}
            style={{ cursor: "pointer" }}
          >
            Completed
          </div>
        </li>
        <li class="nav-item">
          <div
            className={`nav-link ${
              activeTab === "cancel" ? "active" : "inactive"
            }`}
            onClick={() => {
              handleTabClick("cancel");
              dispatch(listShipmentCancel(1, 10, "createdAt", -1));
            }}
            style={{ cursor: "pointer" }}
          >
            Canceled{" "}
          </div>
        </li>
      </ul>

      {loading ? (
        <div className="loader">
          <PropagateLoader
            cssOverride={override}
            size={15}
            color={"#000"}
            loading={loading}
          />
        </div>
      ) : activeTab === "complete" ? (
        <div className="container-fluid">
          <div className="row mx-sm-3 mx-0">
            <InfiniteScroll
              dataLength={shipmentComplete?.length}
              hasMore={hasMore}
              next={() => fetchDataOnScroll()}
              loader={
                (loading && shipmentComplete?.length === 0) ||
                shipmentComplete?.length === Length ? (
                  <div className="loader">
                    <ClipLoader size={30} color={"#000"} loading={loading} />
                  </div>
                ) : null
              }
              endMessage={
                <div className="row mt-4">
                  <div className="col text-center">
                    <p style={{ textAlign: "center" }}>
                      <b>
                        {shipmentComplete?.length === 0
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
              {shipmentComplete &&
                shipmentComplete.map((data, index) => (
                  <div className="tabLayout my-3" key={index}>
                    <div className="row">
                      <div className="col-12">
                        <div className="spaceBetween">
                          <div>
                            <button
                              className={`btn ${
                                toggle === true && currentId === data?._id
                                  ? "d-none"
                                  : "d-block"
                              }`}
                            >
                              {data?.loadId}
                            </button>
                          </div>
                          <div
                            className="togggle me-3 c-pointer"
                            title="View more"
                            onClick={() => {
                              let lastItem = data?.historyData?.pop();
                              handleGetAddress(lastItem?.Lat, lastItem?.Lon);
                              setCurrentId(data?._id);
                              setLatitudeShipper(
                                data?.shipper?.map(
                                  (shipper) => shipper.latitude
                                )
                              );
                              setLongitudeShipper(
                                data?.shipper?.map(
                                  (shipper) => shipper.longitude
                                )
                              );
                              setLatitudeReceiver(
                                data?.receiver?.map(
                                  (receiver) => receiver.latitude
                                )
                              );
                              setLongitudeReceiver(
                                data?.receiver?.map(
                                  (receiver) => receiver.longitude
                                )
                              );
                              setMarkerLat(data?.receiver[0]?.latitude);
                              setMarkerLng(data?.receiver[0]?.longitude);
                              toggle === true && currentId === data?._id
                                ? setToggle(false)
                                : setToggle(true);
                              setAnyHistory(data?.historyData);
                            }}
                          >
                            <i
                              className={`fa-solid  ${
                                toggle === true && currentId === data?._id
                                  ? "fa-chevron-up"
                                  : "fa-chevron-down"
                              }`}
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tabContent ${
                        toggle === true && currentId === data?._id
                          ? "d-block"
                          : "d-none"
                      }`}
                    >
                      <div className="row mb-3">
                        <div className="col-md-6 dataBox">
                          <div className="row">
                            <div className="col-md-8">
                              <div className="data">
                                <div className="icon">
                                  <i className="fa-solid fa-calendar-days"></i>
                                </div>
                                <div className="text">
                                  <p className="mb-0">
                                    {getDayFromDate(
                                      data?.shipper[0]?.pickupDate
                                    )}
                                  </p>
                                  <p className="mb-0">
                                    <Moment format="D, MMMM YYYY">
                                      {data?.shipper[0]?.pickupDate}
                                    </Moment>
                                  </p>
                                </div>
                              </div>
                              <div className="data">
                                <div className="icon">
                                  <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div className="text">
                                  <p className="mb-0">
                                    {address}
                                    {/* <GeocodingComponent
                                      lat={
                                        data?.historyData[
                                          data?.historyData?.length - 1
                                        ]?.Lat
                                      }
                                      lng={
                                        data?.historyData[
                                          data?.historyData?.length - 1
                                        ]?.Lon
                                      }
                                    /> */}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="lightTemperature ms-auto">
                                <div>
                                  <h1 className="mb-0 text-center">
                                    {data?.temperature?.actual}F
                                  </h1>
                                  <p className="mb-0 text-center">Set Temp.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            {data && data?.historyData && (
                              <div className="col-12">
                                {/* <ShipmentGraph historyData={data?.historyData} /> */}

                                <TempChart
                                  historyData={data?.historyData}
                                  pickup={data?.shipper[0]}
                                  delivery={data?.receiver[0]}
                                  temperature={data?.temperature?.actual}
                                  isChartAnimated={isChartAnimated}
                                  setIsChartAnimated={setIsChartAnimated}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-6 mapBox">
                          <div className="darktemperature ">
                            <div>
                              <h1 className="mb-0 text-center">
                                {data?.historyData[
                                  data?.historyData?.length - 1
                                ]?.Temp1.toFixed(1)}
                                F
                              </h1>
                              <p className="mb-0 text-center">
                                <Moment format="hh:mm:ss">
                                  {
                                    data?.historyData[
                                      data?.historyData?.length - 1
                                    ]?.createdAt
                                  }
                                </Moment>
                              </p>
                            </div>
                          </div>
                          <div className="sideGradient"></div>
                          <div className="topGradient"></div>
                          <div className="rightGradient"></div>
                          <div className="bottomGradient"></div>
                          <div className="gpsButton" onClick={handleReloadMap}>
                            <i class="fa-solid fa-location-crosshairs"></i>
                          </div>
                          {latitudeShipper &&
                            longitudeShipper &&
                            latitudeReceiver &&
                            longitudeReceiver &&
                            currentId &&
                            markerLat &&
                            markerLng && (
                              <ShipmentMap
                                latitudeShipper={latitudeShipper}
                                longitudeShipper={longitudeShipper}
                                latitudeReceiver={latitudeReceiver}
                                longitudeReceiver={longitudeReceiver}
                                currentId={currentId}
                                markerLat={markerLat}
                                markerLng={markerLng}
                                markerTemp={data?.historyData[
                                  data?.historyData?.length - 1
                                ]?.Temp1.toFixed(1)}
                                reloadMap={reloadMap}
                                isChartAnimated={isChartAnimated}
                                setIsChartAnimated={setIsChartAnimated}
                                anyHistory={anyHistory}
                              />
                            )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <button className="btn">{data?.loadId}</button>
                        </div>
                        <div className="col-md-10">
                          <div className="travelInfo">
                            <button
                              className="btn"
                              onClick={() =>
                                setIsChartAnimated(!isChartAnimated)
                              }
                            >
                              <i className="fa-solid fa-play"></i>
                            </button>
                            <ul>
                              <li className="darkBg">
                                <p className="mb-0">
                                  Total Distance:{" "}
                                  {data?.totalDistance.toFixed(0)} Mi
                                </p>
                              </li>
                              <li>
                                <p className="mb-0">
                                  Covered:{" "}
                                  {/* {parseInt(data?.coveredHours).toFixed(0)} mi */}
                                  {data?.totalDistance.toFixed(0)} Mi
                                </p>
                              </li>
                              <li>
                                <p className="mb-0">
                                  Remaining:{" "}
                                  {/* {(
                                    data?.totalDistance -
                                    parseInt(data?.coveredHours)
                                  ).toFixed(0)}{" "} */}
                                 0 mi
                                </p>
                              </li>
                              <li>
                                <Link
                                  to={`/complete-shipment-moreinfo/${data?._id}`}
                                >
                                  With Temp{" "}
                                </Link>
                              </li>

                              <li>
                                <Link
                                  to={`/complete-shipment-moreinfo-notemp/${data?._id}`}
                                >
                                  Without Temp{" "}
                                </Link>
                              </li>
                              <li title="Send shipment link">
                                <Link>
                                  <i
                                    className="fa-solid fa-paper-plane"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                  ></i>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 travelRecord">
                        {/* <div className="loc">
                  <div className="icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="text">
                    <p className="mb-0">Laredo, TX</p>
                  </div>
                </div> */}
                        {data?.shipper?.map((shipper, index) => (
                          <div className="pickup">
                            <p className="mb-0">Pick Up{index + 1}</p>
                            <div className="icon">
                              <i
                                className={`fa-solid fa-check ${
                                  Date.now() > new Date(shipper?.pickupDate)
                                    ? "checked"
                                    : "unchecked"
                                }`}
                              ></i>
                            </div>
                            <p className="destinaton">
                              {`${shipper?.pickupAddress.split(",")[0]}, ${
                                shipper?.pickupAddress.split(",")[
                                  shipper?.pickupAddress.split(",").length - 2
                                ]
                                  ? shipper?.pickupAddress.split(",")[
                                      shipper?.pickupAddress.split(",").length -
                                        2
                                    ]
                                  : ""
                              }`}
                            </p>
                          </div>
                        ))}
                        {/* need to make dynamic */}
                        <div className="range">
                          <div className="total"></div>
                          <div
                            className="value"
                            // style={{
                            //   "--move-point-left": `${(
                            //     (parseInt(data?.coveredHours).toFixed(0) /
                            //       data?.totalDistance.toFixed(0)) *
                            //     100
                            //   ).toFixed(0)}%`,
                            // }}
                            style={{ "--move-point-left": "100%" }}
                          ></div>
                          <div
                            className="temp"
                            // style={{
                            //   "--move-point-left": `${(
                            //     (parseInt(data?.coveredHours).toFixed(0) /
                            //       data?.totalDistance.toFixed(0)) *
                            //     100
                            //   ).toFixed(0)}%`,
                            // }}
                            style={{ "--move-point-left": "100%" }}
                          >
                            <p className="mb-0">
                              {data?.historyData[
                                data?.historyData?.length - 1
                              ]?.Temp1.toFixed(1)}
                              F
                            </p>
                          </div>
                        </div>
                        {data?.receiver?.map((receiver, index) => (
                          <div className="pickup">
                            <p className="mb-0">Delivered{index + 1}</p>
                            <div className="icon">
                              <i
                                className={`fa-solid fa-check ${
                                  Date.now() > new Date(receiver?.deliveryDate)
                                    ? "checked"
                                    : "unchecked"
                                }`}
                              ></i>
                            </div>
                            <p className="destinaton">
                              {`${receiver?.deliveryAddress.split(",")[0]}, ${
                                receiver?.deliveryAddress.split(",")[
                                  receiver?.deliveryAddress.split(",").length -
                                    2
                                ]
                                  ? receiver?.deliveryAddress.split(",")[
                                      receiver?.deliveryAddress.split(",")
                                        .length - 2
                                    ]
                                  : ""
                              }`}
                            </p>
                          </div>
                        ))}

                        <div className="belowLine"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row mx-sm-3 mx-0">
            <InfiniteScroll
              dataLength={shipmentCancel?.length}
              hasMore={hasMore}
              next={() => fetchCancelDataOnScroll()}
              loader={
                (loading && shipmentCancel?.length === 0) ||
                shipmentCancel?.length === Length ? (
                  <div className="loader">
                    <ClipLoader size={30} color={"#000"} loading={loading} />
                  </div>
                ) : null
              }
              endMessage={
                <div className="row mt-4">
                  <div className="col text-center">
                    <p style={{ textAlign: "center" }}>
                      <b>
                        {shipmentCancel?.length === 0
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
              {shipmentCancel &&
                shipmentCancel.map((data, index) => (
                  <div className="tabLayout my-3" key={index}>
                    <div className="row">
                      <div className="col-12">
                        <div className="spaceBetween">
                          <div>
                            <button
                              className={`btn ${
                                toggle === true && currentId === data?._id
                                  ? "d-none"
                                  : "d-block"
                              }`}
                            >
                              {data?.loadId}
                            </button>
                          </div>
                          <div
                            className="togggle me-3 c-pointer"
                            title="View more"
                            onClick={() => {
                              let lastItem = data?.historyData?.pop();
                              handleGetAddress(lastItem?.Lat, lastItem?.Lon);
                              setCurrentId(data?._id);
                              setLatitudeShipper(
                                data?.shipper?.map(
                                  (shipper) => shipper.latitude
                                )
                              );
                              setLongitudeShipper(
                                data?.shipper?.map(
                                  (shipper) => shipper.longitude
                                )
                              );
                              setLatitudeReceiver(
                                data?.receiver?.map(
                                  (receiver) => receiver.latitude
                                )
                              );
                              setLongitudeReceiver(
                                data?.receiver?.map(
                                  (receiver) => receiver.longitude
                                )
                              );
                              setMarkerLat(data?.receiver[0]?.latitude);
                              setMarkerLng(data?.receiver[0]?.longitude);
                              toggle === true && currentId === data?._id
                                ? setToggle(false)
                                : setToggle(true);
                            }}
                          >
                            <i
                              className={`fa-solid  ${
                                toggle === true && currentId === data?._id
                                  ? "fa-chevron-up"
                                  : "fa-chevron-down"
                              }`}
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tabContent ${
                        toggle === true && currentId === data?._id
                          ? "d-block"
                          : "d-none"
                      }`}
                    >
                      <div className="row mb-3">
                        <div className="col-md-6 dataBox">
                          <div className="row">
                            <div className="col-md-8">
                              <div className="data">
                                <div className="icon">
                                  <i className="fa-solid fa-calendar-days"></i>
                                </div>
                                <div className="text">
                                  <p className="mb-0">
                                    {getDayFromDate(
                                      data?.shipper[0]?.pickupDate
                                    )}
                                  </p>
                                  <p className="mb-0">
                                    <Moment format="D, MMMM YYYY">
                                      {data?.shipper[0]?.pickupDate}
                                    </Moment>
                                  </p>
                                </div>
                              </div>
                              <div className="data">
                                <div className="icon">
                                  <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div className="text">
                                  <p className="mb-0">
                                    {address}
                                    {/* <GeocodingComponent
                                      lat={
                                        data?.historyData[
                                          data?.historyData?.length - 1
                                        ]?.Lat
                                      }
                                      lng={
                                        data?.historyData[
                                          data?.historyData?.length - 1
                                        ]?.Lon
                                      }
                                    /> */}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="lightTemperature ms-auto">
                                <div>
                                  <h1 className="mb-0 text-center">
                                    {data?.temperature?.actual}F
                                  </h1>
                                  <p className="mb-0 text-center">Set Temp.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            {data && data?.historyData && (
                              <div className="col-12">
                                {/* <ShipmentGraph historyData={data?.historyData} /> */}
                                <TempChart
                                  historyData={data?.historyData}
                                  pickup={data?.shipper[0]}
                                  delivery={data?.receiver[0]}
                                  temperature={data?.temperature?.actual}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-6 mapBox">
                          <div className="darktemperature ">
                            <div>
                              <h1 className="mb-0 text-center">
                                {data?.historyData[
                                  data?.historyData?.length - 1
                                ]?.Temp1.toFixed(1)}
                                F
                              </h1>
                              <p className="mb-0 text-center">
                                <Moment format="hh:mm:ss">
                                  {
                                    data?.historyData[
                                      data?.historyData?.length - 1
                                    ]?.createdAt
                                  }
                                </Moment>
                              </p>
                            </div>
                          </div>
                          <div className="sideGradient"></div>
                          <div className="topGradient"></div>
                          <div className="rightGradient"></div>
                          <div className="bottomGradient"></div>
                          <div className="gpsButton" onClick={handleReloadMap}>
                            <i class="fa-solid fa-location-crosshairs"></i>
                          </div>
                          {latitudeShipper &&
                            longitudeShipper &&
                            latitudeReceiver &&
                            longitudeReceiver &&
                            currentId &&
                            markerLat &&
                            markerLng && (
                              <ShipmentMap
                                latitudeShipper={latitudeShipper}
                                longitudeShipper={longitudeShipper}
                                latitudeReceiver={latitudeReceiver}
                                longitudeReceiver={longitudeReceiver}
                                currentId={currentId}
                                markerLat={markerLat}
                                markerLng={markerLng}
                                markerTemp={data?.historyData[
                                  data?.historyData?.length - 1
                                ]?.Temp1.toFixed(1)}
                                reloadMap={reloadMap}
                              />
                            )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <button className="btn">{data?.loadId}</button>
                        </div>
                        <div className="col-md-10">
                          <div className="travelInfo">
                            <button className="btn">
                              <i className="fa-solid fa-play"></i>
                            </button>
                            <ul>
                              <li className="darkBg">
                                <p className="mb-0">
                                  Total Distance:{" "}
                                  {data?.totalDistance.toFixed(0)} Mi
                                </p>
                              </li>
                              <li>
                                <p className="mb-0">
                                  Covered:{" "}
                                  {parseInt(data?.coveredHours).toFixed(0)} mi
                                </p>
                              </li>
                              <li>
                                <p className="mb-0">
                                  Remaining:{" "}
                                  {(
                                    data?.totalDistance -
                                    parseInt(data?.coveredHours)
                                  ).toFixed(0)}{" "}
                                  mi
                                </p>
                              </li>
                              <li>
                                <Link
                                  to={`/complete-shipment-moreinfo/${data?._id}`}
                                >
                                  With Temp{" "}
                                </Link>
                              </li>

                              <li>
                                <Link
                                  to={`/complete-shipment-moreinfo-notemp/${data?._id}`}
                                >
                                  Without Temp{" "}
                                </Link>
                              </li>
                              <li title="Send shipment link">
                                <Link>
                                  <i
                                    className="fa-solid fa-paper-plane"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                  ></i>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 travelRecord">
                        {data?.shipper?.map((shipper, index) => (
                          <div className="pickup">
                            <p className="mb-0">Pick Up{index + 1}</p>
                            <div className="icon">
                              <i
                                className={`fa-solid fa-check ${
                                  Date.now() > new Date(shipper?.pickupDate)
                                    ? "checked"
                                    : "unchecked"
                                }`}
                              ></i>
                            </div>
                            <p className="destinaton">
                              {`${shipper?.pickupAddress.split(",")[0]}, ${
                                shipper?.pickupAddress.split(",")[
                                  shipper?.pickupAddress.split(",").length - 2
                                ]
                                  ? shipper?.pickupAddress.split(",")[
                                      shipper?.pickupAddress.split(",").length -
                                        2
                                    ]
                                  : ""
                              }`}
                            </p>
                          </div>
                        ))}
                        {/* need to make dynamic */}
                        <div className="range">
                          <div className="total"></div>
                          <div
                            className="value"
                            style={{ "--move-point-left": "100%" }}
                          ></div>
                          <div
                            className="temp"
                            style={{ "--move-point-left": "100%" }}
                          >
                            <p className="mb-0">
                              {data?.historyData[
                                data?.historyData?.length - 1
                              ]?.Temp1.toFixed(1)}
                              F
                            </p>
                          </div>
                        </div>
                        {data?.receiver?.map((receiver, index) => (
                          <div className="pickup">
                            <p className="mb-0">Delivered{index + 1}</p>
                            <div className="icon">
                              <i
                                className={`fa-solid fa-check ${
                                  Date.now() > new Date(receiver?.deliveryDate)
                                    ? "checked"
                                    : "unchecked"
                                }`}
                              ></i>
                            </div>
                            <p className="destinaton">
                              {`${receiver?.deliveryAddress.split(",")[0]}, ${
                                receiver?.deliveryAddress.split(",")[
                                  receiver?.deliveryAddress.split(",").length -
                                    2
                                ]
                                  ? receiver?.deliveryAddress.split(",")[
                                      receiver?.deliveryAddress.split(",")
                                        .length - 2
                                    ]
                                  : ""
                              }`}
                            </p>
                          </div>
                        ))}

                        <div className="belowLine"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      )}

      {loading === false && Length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // height: "100vh",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          No data to display
        </div>
      ) : null}

      <ToolBox />
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
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border me-3"
                data-bs-dismiss="modal"
                // onClick={() => clear()}
              >
                Back
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteShipment;

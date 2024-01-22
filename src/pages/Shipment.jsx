import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ShipmentMap from "../components/ShipmentMap/ShipmentMap";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { listShipment } from "../actions/shipment";
import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { PropagateLoader, ClipLoader } from "react-spinners";
import GeocodingComponent from "../components/GeocodingComponent/GeocodingComponent";
import TempChart from "../components/TempChart/TempChart";
import * as api from "../api/index";
import ShipmentMapDetail from "../components/ShipmentMapDetail/ShipmentMapDetail";

// Define a function to load the Google Maps script
const loadGoogleMapsScript = (callback) => {
  const googleMapsScript = document.createElement("script");
  googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API}&v=3.exp&libraries=geometry,drawing,places`;

  // Listen for the script to load and then call the callback function
  googleMapsScript.onload = callback;

  // Append the script to the document
  document.body.appendChild(googleMapsScript);
};

const Shipment = () => {
  const dispatch = useDispatch();

  const titleProp = "Active Shipment";

  const [toggle, setToggle] = useState(true);
  const [currentId, setCurrentId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);

  useEffect(() => {
    dispatch(listShipment(1, 10, "createdAt", -1));
    // Return a cleanup function to clear the state when the component unmounts
    return () => {
      setLatitudeShipper([]);
      setLongitudeShipper([]);
      setLatitudeReceiver([]);
      setLongitudeReceiver([]);
      setMarkerLat(0);
      setMarkerLng(0);
      setCurrentId(0);
      setMarkerTemp(0);
    };
  }, []);

  const [googleLoaded, setGoogleLoaded] = useState(false);

  const shipmentData = useSelector((state) => state.shipmentReducer);
  const { loading, shipment, Length } = shipmentData;

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(10 * (pageNumber - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listShipment(pageNumber, 10, "createdAt", -1));
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
  const [markerTemp, setMarkerTemp] = useState(0);

  const [sendmail, setSendmail] = useState("");

  useEffect(() => {}, [
    latitudeShipper,
    longitudeShipper,
    latitudeReceiver,
    longitudeReceiver,
    currentId,
    markerLat,
    markerLng,
    markerTemp,
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
        <HeaderComponent
          titleProp={titleProp}
          searching={true}
          shipment={true}
          driver={false}
        />
      </div>
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

      {loading && shipment.length === 0 ? (
        <div className="loader">
          <PropagateLoader
            cssOverride={override}
            size={15}
            color={"#000"}
            loading={loading}
          />
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row mx-sm-3 mx-0">
            <InfiniteScroll
              dataLength={shipment?.length}
              hasMore={hasMore}
              next={() => fetchDataOnScroll()}
              loader={
                (loading && shipment?.length === 0) ||
                shipment?.length === Length ? (
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
                        {shipment?.length === 0
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
              {shipment &&
                shipment.map((data, index) => (
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
                              handleGetAddress(
                                data?.realTimeData?.FLatitude,
                                data?.realTimeData?.FLongitude
                              );
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
                              setMarkerLat(data?.realTimeData?.FLatitude);
                              setMarkerLng(data?.realTimeData?.FLongitude);
                              setMarkerTemp(
                                data?.realTimeData?.FTemperature1.toFixed(1)
                              );
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
                                  <Moment format="dddd">
                                    {data?.realTimeData?.FGPSTime}
                                  </Moment>
                                  <p className="mb-0">
                                    <Moment format="D, MMMM YYYY">
                                      {data?.realTimeData?.FGPSTime}
                                    </Moment>
                                  </p>
                                </div>
                              </div>
                              <div className="data">
                                <div className="icon">
                                  <i className="fa-solid fa-location-dot"></i>
                                </div>
                                {address}
                                {/* <div className="text">
                                  <p className="mb-0">
                                    <GeocodingComponent
                                      lat={data?.realTimeData?.FLatitude}
                                      lng={data?.realTimeData?.FLongitude}
                                    />
                                  </p>
                                </div> */}
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
                            <div className="col-12">
                              {/* <ShipmentGraph historyData={data?.historyData} /> */}
                              {data && data?.isStart && (
                                <TempChart
                                  historyData={data?.historyData}
                                  pickup={data?.shipper[0]}
                                  delivery={data?.receiver[0]}
                                  temperature={data?.temperature?.actual}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 mapBox">
                          <div
                            className={
                              data?.realTimeData?.FTemperature1 >
                                data?.shipmentData?.temperature?.max ||
                              data?.realTimeData?.FTemperature1 <
                                data?.shipmentData?.temperature?.min
                                ? "redtemperature"
                                : "darktemperature"
                            }
                          >
                            <div>
                              <h1 className="mb-0 text-center">
                                {data?.realTimeData?.FTemperature1.toFixed(1)}F
                              </h1>
                              <p className="mb-0 text-center">
                                <Moment format="hh:mm:ss">
                                  {data?.realTimeData?.FGPSTime}
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
                            markerLng &&
                            markerTemp && (
                              <ShipmentMap
                                latitudeShipper={latitudeShipper}
                                longitudeShipper={longitudeShipper}
                                latitudeReceiver={latitudeReceiver}
                                longitudeReceiver={longitudeReceiver}
                                currentId={currentId}
                                markerLat={markerLat}
                                markerLng={markerLng}
                                markerTemp={markerTemp}
                                reloadMap={reloadMap}
                              />
                            )}

                          {/* {data.isStart && (
                            <ShipmentMap
                              latitudeShipper={latitudeShipper}
                              longitudeShipper={longitudeShipper}
                              latitudeReceiver={latitudeReceiver}
                              longitudeReceiver={longitudeReceiver}
                              currentId={currentId}
                              markerLat={markerLat}
                              markerLng={markerLng}
                              markerTemp={markerTemp}
                            />
                          )} */}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <button className="btn">{data?.loadId}</button>
                        </div>
                        <div className="col-md-10 mt-4 mt-md-0">
                          <div className="travelInfo">
                            {/* <button
                              className="btn"
                              onClick={() => {
                                setIsChartAnimated(!isChartAnimated);
                                setTempAnimation(!tempAnimation);
                              }}
                            >
                              <i className="fa-solid fa-play"></i>
                            </button> */}
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
                                  {parseInt(data?.coveredHours).toFixed(0) <
                                  data?.totalDistance.toFixed(0)
                                    ? parseInt(data?.coveredHours).toFixed(0)
                                    : data?.totalDistance.toFixed(0)}{" "}
                                  mi
                                </p>
                              </li>
                              <li>
                                <p className="mb-0">
                                  Remaining:{" "}
                                  {(
                                    data?.totalDistance -
                                    parseInt(data?.coveredHours)
                                  ).toFixed(0) < 0
                                    ? 0
                                    : (
                                        data?.totalDistance -
                                        parseInt(data?.coveredHours)
                                      ).toFixed(0)}
                                  mi
                                </p>
                              </li>
                              <li>
                                <Link to={`/Shipment-moreinfo/${data?._id}`}>
                                  With Temp{" "}
                                  {/* <i className="fa-solid fa-arrow-right"></i> */}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to={`/Shipment-moreinfo-notemp/${data?._id}`}
                                >
                                  Without Temp{" "}
                                  {/* <i className="fa-solid fa-arrow-right"></i> */}
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
                              <li>
                                <Link to={`/update-shipment/${data?._id}`}>
                                  Update{" "}
                                  <i className="fa-solid fa-arrow-right"></i>
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
                            style={{
                              "--move-point-left": `${
                                (
                                  (parseInt(data?.coveredHours).toFixed(0) /
                                    data?.totalDistance.toFixed(0)) *
                                  100
                                ).toFixed(0) > 100
                                  ? 100
                                  : (
                                      (parseInt(data?.coveredHours).toFixed(0) /
                                        data?.totalDistance.toFixed(0)) *
                                      100
                                    ).toFixed(0)
                              }%`,
                            }}
                          ></div>
                          <div
                            className="temp"
                            style={{
                              "--move-point-left": `${
                                (
                                  (parseInt(data?.coveredHours).toFixed(0) /
                                    data?.totalDistance.toFixed(0)) *
                                  100
                                ).toFixed(0) > 100
                                  ? 100
                                  : (
                                      (parseInt(data?.coveredHours).toFixed(0) /
                                        data?.totalDistance.toFixed(0)) *
                                      100
                                    ).toFixed(0)
                              }%`,
                            }}
                          >
                            <p className="mb-0 smText">
                              {data?.realTimeData?.FTemperature1.toFixed(1)}F
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

export default Shipment;

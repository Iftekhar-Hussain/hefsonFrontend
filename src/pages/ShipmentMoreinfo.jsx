import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { ProgressCircular } from "ui-neumorphism";
import { useEffect, useState } from "react";
import * as api from "../api/index";
import { useNavigate, useParams } from "react-router-dom";
import TempHumidity from "../components/TempHumidity/TempHumidity";
import BarCharts from "../components/BarChart/BarChart";
import Cookies from "js-cookie";
import { GoogleApiWrapper } from "google-maps-react";
import GeocodingComponent from "../components/GeocodingComponent/GeocodingComponent";
import ShipmentMapComponent from "../components/ShipmentMapComponent/ShipmentMapComponent";
import Moment from "react-moment";
import TimlineIcon from "../assets/timeline.png";
import ProgressTemp from "../components/ProgressTemp/ProgressTemp";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { format, parse } from "date-fns";
import ShipmentMap from "../components/ShipmentMap/ShipmentMap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import TempChartDetail from "../components/TempChartDetail/TempChartDetail";
import ProgressTempRed from "../components/ProgressTemp/ProgressTempRed";
import ToolBoxAdmin from "./ToolBoxAdmin";
// import { Document, Page, Image, pdf } from "@react-pdf/renderer";
import { LoadScript } from "@react-google-maps/api";
import HeaderComponentShareLink from "../components/Header/HeaderComponentShareLink";
import HeaderComponentNoLogin from "../components/Header/HeaderComponentNoLogin";

const baseURL = process.env.REACT_APP_BASEURL;

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const header = {
  headers: {
    Authorization: loginToken,
  },
};

const loginRole = Cookies.get("role") ? JSON.parse(Cookies.get("role")) : null;

// Define a function to load the Google Maps script
const loadGoogleMapsScript = (callback) => {
  const googleMapsScript = document.createElement("script");
  googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API}`;
  // googleMapsScript.async = true;
  // Listen for the script to load and then call the callback function
  googleMapsScript.onload = callback;

  // Append the script to the document
  document.body.appendChild(googleMapsScript);
};

let shipmentlat = 0;
let shipmentLng = 0;

const ShipmentMoreinfo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [shipmentData, setShipmentData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.getShipmentDetail(id);
        setShipmentData(data?.data);
        handleGetAddress(
          data?.data?.realTimeData?.FLatitude,
          data?.data?.realTimeData?.FLongitude
        );
        shipmentlat = data?.data?.realTimeData?.FLatitude;
        shipmentLng = data?.data?.realTimeData?.FLongitude;

        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.log("errrr: ", error);
        if (error.response && error.response.status === 429) {
          return toast(error.response.data.message + ", please reload");
        }
        if (
          error.response &&
          error.response.data.message ===
            "You are not an authorized user for this action."
        ) {
          window.location.replace("/login");
        } else if (error.response && error.response.status === 400) {
          window.location.replace("/login");
        }
      }
    })();

    // loadGoogleMapsScript();
  }, []);

  console.log("shipmentData -- ", shipmentData);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const [latitudeShipper, setLatitudeShipper] = useState([]);
  const [longitudeShipper, setLongitudeShipper] = useState([]);
  const [latitudeReceiver, setLatitudeReceiver] = useState([]);
  const [longitudeReceiver, setLongitudeReceiver] = useState([]);
  const [markerLat, setMarkerLat] = useState(0);
  const [markerLng, setMarkerLng] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [markerTemp, setMarkerTemp] = useState(0);

  useEffect(() => {
    // Your existing useEffect for fetching data...

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
      setShipmentData(null);
      shipmentlat = 0;
      shipmentLng = 0;
    };
  }, []); // Empty dependency array to run only when the component unmounts

  console.log("shipmentData => ", shipmentData);

  const titleProp = shipmentData?.loadId;
console.log("...............", titleProp)
  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

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
  const [pdfLoader, setPdfLoader] = useState(false);

  const handleDownload = () => {
    setPdfLoader(true);

    const input = document.getElementById("content-to-screenshot");

    html2canvas(input, { allowTaint: true, useCORS: true }).then(
      async (canvas) => {
        const imgData = await canvas.toDataURL("image/png");
        const imgWidth = 210; // Adjust as needed
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF();
        let position = 0;
        let remainingHeight = imgHeight;

        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, 0);
          remainingHeight -= 297; // Adjust the page height (A4 size: 297mm)
          position -= 297; // Adjust the page height (A4 size: 297mm)

          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }

        pdf.save(`${titleProp}.pdf`);
        setPdfLoader(false);
      }
    );
  };

  // This is working fine but can't use it due to Image constructor is being used for conversion of image to base64
  // const handleDownload = async () => {
  //   setPdfLoader(true);
  //   const input = document.getElementById("content-to-screenshot");
  //   const imgData = await html2canvas(input).then(async (canvas) => {
  //     return canvas.toDataURL("image/png");
  //   });

  //   const imgWidth = 210; // Adjust as needed
  //   const imgHeight = (input.offsetHeight * imgWidth) / input.offsetWidth;

  //   const doc = (
  //     <Document>
  //       <Page size="A4" style={{ width: imgWidth, height: imgHeight }}>
  //         <Image src={imgData} style={{ width: "100%", height: "auto" }} />
  //       </Page>
  //     </Document>
  //   );

  //   const pdfBlob = await pdf(doc).toBlob();

  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = URL.createObjectURL(pdfBlob);
  //   downloadLink.download = `${titleProp}.pdf`;
  //   downloadLink.click();
  //   setPdfLoader(false);
  // };

  // working one but breaks the pdf into two pages
  // const handleDownload = () => {
  //   const input = document.getElementById("content-to-screenshot");

  //   html2canvas(input).then(async (canvas) => {
  //     const imgData = await canvas.toDataURL("image/png");
  //     const imgWidth = 210; // Adjust as needed
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     const pdf = new jsPDF();
  //     let position = 0;
  //     let remainingHeight = imgHeight;

  //     while (remainingHeight > 0) {
  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, 0);
  //       remainingHeight -= 297; // Adjust the page height (A4 size: 297mm)
  //       position -= 297; // Adjust the page height (A4 size: 297mm)

  //       if (remainingHeight > 0) {
  //         pdf.addPage();
  //       }
  //     }

  //     pdf.save(`${titleProp}.pdf`);
  //   });
  // };

  const handleDownloadXLS = async (id) => {
    try {
      setPdfLoader(true);

      const { data } = await api.downloadXLS(id);
      const fileUrl = data.data;

      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.target = "_blank";
      link.download = `${shipmentData?.loadId}.xls`;

      // Programmatically trigger the download
      link.click();
      setPdfLoader(false);

      toast("File downloaded successfully.");
    } catch (error) {
      setPdfLoader(false);
      toast("Error occurred during file download");
      console.error("Error occurred during file download:", error);
    }
  };

  const navigate = useNavigate();

  const handleComplete = async (e, id, loadId) => {
    e.preventDefault();
    try {
      swal({
        title: "Are you sure?",
        text: `You want to complete load: ${loadId}`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDisable) => {
        if (willDisable) {
          swal(`Load ${loadId} is completed successfully`, {
            icon: "success",
          });
          const { data } = await axios.post(
            `${baseURL}/shipment/updateStatus`,
            {
              id: id,
              status: "complete",
            },
            header
          );
          if (data.status === 200) {
            navigate("/completeshipment");
          } else {
            return toast(data.message);
          }
        }
      });
    } catch (error) {
      console.log("error", error);
      return toast(error.response.data.message);
    }
  };

  const handleCancel = async (e, id, loadId) => {
    e.preventDefault();
    try {
      swal({
        title: "Are you sure?",
        text: `You want to cancel load: ${loadId}`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDisable) => {
        if (willDisable) {
          swal(`Load ${loadId} is canceld successfully`, {
            icon: "success",
          });
          const { data } = await axios.post(
            `${baseURL}/shipment/updateStatus`,
            {
              id: id,
              status: "cancel",
            },
            header
          );
          if (data.status === 200) {
            navigate("/completeshipment");
          } else {
            return toast(data.message);
          }
        }
      });
    } catch (error) {
      console.log("error", error);
      return toast(error.response.data.message);
    }
  };

  const getTimeDifference = (first, second) => {
    const firstTime = moment(first);
    const secondTime = moment(second);
    const duration = moment.duration(secondTime.diff(firstTime));

    const hours = String(duration.hours()).padStart(2, "0");
    const minutes = String(duration.minutes()).padStart(2, "0");
    const seconds = String(duration.seconds()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  function totalTime(start, end) {
    const startTime = moment(start);
    const endTime = moment(end);
    const duration = moment.duration(endTime.diff(startTime));

    // Add 5 minutes to the duration
    duration.add(5, "minutes");

    const hours = String(duration.hours()).padStart(2, "0");
    const minutes = String(duration.minutes()).padStart(2, "0");
    const seconds = String(duration.seconds()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  const [reloadMap, setReloadMap] = useState(false); // State for triggering map reload
  const handleReloadMap = () => {
    console.log("clickkkk");
    setReloadMap(!reloadMap); // Toggle reloadMap state to trigger map reload
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

  const [arrivalAddress, setArrivalAddress] = useState("");
  const [waitingAddress, setWaitingAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState("");
  const [loadingCompleteAddress, setLoadingCompleteAddress] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [departureAddress, setDepartureAddress] = useState("");
  
  const [receiverArrivalAddress, setReceiverArrivalAddress] = useState("");
  const [receiverWaitingAddress, setReceiverWaitingAddress] = useState("");
  const [receiverUnloadingAddress, setReceiverUnloadingAddress] = useState("");
  const [receiverUnLoadingCompleteAddress, setReceiverUnLoadingCompleteAddress] = useState("");
  const [receiverCheckoutAddress, setReceiverCheckoutAddress] = useState("");
  const [receiverDepartureAddress, setReceiverDepartureAddress] = useState("");
  
  const getFormattedAddress = (lat, lng, callback) => {
    let address = "";
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);
  
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          address = results[0].formatted_address;
        }
      }
      callback(address);
    });
  };
  
  useEffect(() => {
    if (!shipmentData) {
      return;
    }
  
    const steps = [
      "isShipperArrival",
      "isShipperWaiting",
      "isShipperLoading",
      "isShipperLoadingComplete",
      "isShipperCheckout",
      "isShipperDeparture",
      "isReceiverArrival",
      "isReceiverWaiting",
      "isReceiverUnloading",
      "isReceiverUnLoadingComplete",
      "isReceiverCheckout",
      "isReceiverDeparture",
    ];
  
    steps.forEach((step) => {
      const stepData = shipmentData[step];
      if (stepData?.latitude !== undefined && stepData?.longitude !== undefined) {
        const { latitude, longitude } = stepData;
        getFormattedAddress(latitude, longitude, (formattedAddress) => {
          switch (step) {
            case "isShipperArrival":
              setArrivalAddress(formattedAddress);
              break;
            case "isShipperWaiting":
              setWaitingAddress(formattedAddress);
              break;
            case "isShipperLoading":
              setLoadingAddress(formattedAddress);
              break;
            case "isShipperLoadingComplete":
              setLoadingCompleteAddress(formattedAddress);
              break;
            case "isShipperCheckout":
              setCheckoutAddress(formattedAddress);
              break;
            case "isShipperDeparture":
              setDepartureAddress(formattedAddress);
              break;
            case "isReceiverArrival":
              setReceiverArrivalAddress(formattedAddress);
              break;
            case "isReceiverWaiting":
              setReceiverWaitingAddress(formattedAddress);
              break;
            case "isReceiverUnloading":
              setReceiverUnloadingAddress(formattedAddress);
              break;
            case "isReceiverUnLoadingComplete":
              setReceiverUnLoadingCompleteAddress(formattedAddress);
              break;
            case "isReceiverCheckout":
              setReceiverCheckoutAddress(formattedAddress);
              break;
            case "isReceiverDeparture":
              setReceiverDepartureAddress(formattedAddress);
              break;
            default:
              break;
          }
        });
      }
    });
  }, [shipmentData]);
  
  

  const [base64Image, setBase64Image] = useState("");
  const [base64ImageDriver, setBase64ImageDriver] = useState("");

  useEffect(() => {
    function toDataURL(src, callback, outputFormat) {
      let image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
      };
      image.src = src;
      if (image.complete || image.complete === undefined) {
        image.src =
          "data:image/gif;base64, R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        image.src = src;
      }
    }
    console.log(
      "shipmentData -- ",
      shipmentData?.truckData?.manuData?.feature.find((feat) => {
        return feat._id === shipmentData?.truckData?.truckColor;
      }).image
    );
    toDataURL(
      shipmentData?.truckData?.manuData?.feature.find((feat) => {
        return feat._id === shipmentData?.truckData?.truckColor;
      }).image,
      function (dataUrl) {
        setBase64Image(dataUrl);
        console.log("RESULT:", dataUrl);
      }
    );
    console.log(
      "shipmentData driver image -- ",
      shipmentData?.driverData?.image
    );
    toDataURL(shipmentData?.driverData?.image, function (dataUrl) {
      setBase64ImageDriver(dataUrl);
      console.log("RESULT:", dataUrl);
    });
  }, [shipmentData !== null]);

  return (
    <div className="shipment-info" id="content-to-screenshot">
      <div className="container-fluid">
        {loginToken ? (
          <HeaderComponentShareLink
            titleProp={titleProp}
            searching={false}
            temp={"ShipmentMoreinfo"}
          />
        ) : (
          <HeaderComponentNoLogin
            titleProp={titleProp}
            searching={false}
            temp={true}
          />
        )}
      </div>
      <h4 className="text-capitalize mx-5 mb-5">
        {Cookies.get("businessName")
          ? JSON.parse(Cookies.get("businessName")).charAt(0).toUpperCase() +
            JSON.parse(Cookies.get("businessName")).slice(1)
          : shipmentData?.carrierData
          ? shipmentData?.carrierData?.businessName
          : ""}
      </h4>
      {loading && shipmentData === null ? (
        <div className="loader">
          <PropagateLoader
            cssOverride={override}
            size={15}
            color={"#000"}
            loading={loading}
          />
        </div>
      ) : pdfLoader === true ? (
        <div className="loader">
          <PropagateLoader
            cssOverride={override}
            size={15}
            color={"#000"}
            loading={pdfLoader}
          />
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row mb-5 shipmentInfo mx-sm-3 mx-0">
            <div className="col-lg-6 dataBox">
              <div className="row">
                <div className="col-12 mapGraph">
                  <div className="data">
                    <div className="icon">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="text">
                      <p className="mb-0">
                        {/* {shipmentData?.realTimeData?.FLongitude &&
                          shipmentData?.realTimeData?.FLatitude && (
                            <GeocodingComponent
                              lat={shipmentData?.realTimeData?.FLatitude}
                              lng={shipmentData?.realTimeData?.FLongitude}
                            />
                          )} */}
                        {address}
                      </p>
                    </div>
                  </div>
                  {shipmentData && shipmentLng && shipmentlat ? (
                    <div className="mapBox">
                      <div className="sideGradient"></div>
                      <div className="topGradient"></div>
                      <div className="rightGradient"></div>
                      <div className="bottomGradient"></div>
                      <div className="gpsButton" onClick={handleReloadMap}>
                        <i class="fa-solid fa-location-crosshairs"></i>
                      </div>

                      <ShipmentMapComponent
                        lat={shipmentlat}
                        lng={shipmentLng}
                        device={shipmentData}
                        reloadMap={reloadMap}
                      />

                      {/* <LoadScript
                      googleMapsApiKey={process.env.REACT_APP_MAP_API}
                      libraries={["geometry", "places"]}
                    >
                      {shipmentData?.realTimeData &&
                        shipmentData?.sensorData && (
                          <ShipmentMapComponent
                            lat={shipmentData?.realTimeData?.FLatitude}
                            lng={shipmentData?.realTimeData?.FLongitude}
                            device={shipmentData?.sensorData}
                          />
                        )}
                    </LoadScript> */}
                    </div>
                  ) : (
                    <div className="mapBox">
                      <h4>Real time coordinates not available</h4>
                    </div>
                  )}
                  <div className="sensorData text-center mt-4">
                    <div className="row">
                      <div className="col-sm-3">
                        <div className="sensorDataBox">
                          <h6>Sensor Battery</h6>
                          <div className="spaceAround">
                            <div>
                              <h2 class="d-flex">
                                {shipmentData?.realTimeData?.FBattery >= 100
                                  ? 100
                                  : shipmentData?.realTimeData?.FBattery}
                                % <i class="fa-solid fa-bolt text-success"></i>
                              </h2>
                              <p>Charging</p>
                            </div>
                            <div>
                              <h2>
                                <i class="fa-solid fa-signal"></i>
                              </h2>
                              <p>4G</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 col-6 mt-3 mt-sm-0">
                        <div
                          className="sensorDataBox"
                          onClick={() => navigate("/alarm")}
                          style={{ cursor: "pointer" }}
                        >
                          <h6>Door Open</h6>
                          <h2>
                            {shipmentData?.doorAlertCount <= 0
                              ? 0
                              : shipmentData?.doorAlertCount}
                          </h2>
                        </div>
                      </div>
                      <div className="col-sm-2 col-6 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Humidity</h6>
                          <h2>{shipmentData?.realTimeData?.FHumidity1}%</h2>
                        </div>
                      </div>
                      <div className="col-sm-2 col-6 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>M/C</h6>
                          <h2>
                            {shipmentData &&
                              shipmentData?.realTimeData &&
                              JSON.parse(
                                shipmentData?.realTimeData?.FExpandProto?.FDesc
                              )?.fLx}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-sm-3">
                        <div className="sensorDataBox">
                          <h6>Distance Covered</h6>
                          <div className="spaceAround">
                            <div>
                              <h2>
                                {parseFloat(shipmentData?.coveredHours).toFixed(
                                  0
                                )}
                              </h2>
                              <p>Miles</p>
                            </div>
                            <div>
                              <h2>
                                {shipmentData?.isCompleted === true
                                  ? 0
                                  : parseFloat(
                                      shipmentData?.leftDistancePercentage
                                    ).toFixed(1)}
                                %
                              </h2>
                              <p>Remaining</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Time left to deliver</h6>
                          <div className="spaceAround">
                            <div>
                              <h2>
                                {shipmentData?.leftTime > 0
                                  ? parseInt(shipmentData?.leftTime)?.toFixed(0)
                                  : 0}
                              </h2>
                              <p>Hours</p>
                            </div>
                            <div>
                              <h2>00</h2>
                              <p>Minutes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 mt-3 mt-sm-0">
                        <div
                          className="sensorDataBox"
                          onClick={() => navigate("/alarm")}
                          style={{ cursor: "pointer" }}
                        >
                          <h6>Temp Alert</h6>
                          <h2>
                            {shipmentData?.tempAlertCount >= 0
                              ? shipmentData?.tempAlertCount
                              : 0}
                          </h2>
                        </div>
                      </div>
                      <div className="col-sm-3 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Temp Threshold</h6>
                          <div className="spaceAround">
                            <div>
                              <p>Min</p>
                              <h2>
                                {shipmentData &&
                                shipmentData?.temperature &&
                                shipmentData?.temperature?.min
                                  ? shipmentData?.temperature?.min
                                  : "N/A"}
                              </h2>
                            </div>
                            <div>
                              <p>Max</p>
                              <h2>
                                {shipmentData &&
                                shipmentData?.temperature &&
                                shipmentData?.temperature?.max
                                  ? shipmentData?.temperature?.max
                                  : "N/A"}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 mt-3 mt-lg-0 centerMid align-items-start">
              <div className="temperatureBox">
                <div className="circularGraph">
                  <div className="temperature">
                    <ProgressTemp
                      value={shipmentData?.temperature?.actual}
                      text={"Set Temp."}
                    />
                  </div>
                </div>
                <div className="circularGraph mt-4">
                  <div
                    // className="temperature"
                    className={
                      shipmentData?.realTimeData?.FTemperature1 >
                        shipmentData?.shipmentData?.temperature?.max ||
                      shipmentData?.realTimeData?.FTemperature1 <
                        shipmentData?.shipmentData?.temperature?.min
                        ? "temperatureRed"
                        : "temperature"
                    }
                  >
                    <ProgressTempRed
                      value={shipmentData?.realTimeData?.FTemperature1.toFixed(
                        1
                      )}
                      text={"Reefer"}
                      shipmentData={shipmentData}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-3 mt-lg-0">
              <div className="truckInfoBox">
                {base64Image && (
                  <img
                    className="d-block m-auto"
                    src={base64Image}
                    alt="converted"
                  />
                )}

                {/* <img
                  src={
                    shipmentData?.truckData?.manuData?.feature.find((feat) => {
                      return feat._id === shipmentData?.truckData?.truckColor;
                    }).image
                  }
                  alt=""
                  className="d-block m-auto"
                /> */}
                <div className="row">
                  <div className="col-6">
                    <div className="spaceAround">
                      <p className="mb-0">
                        {shipmentData?.truckData?.manuData?.name}
                      </p>
                      <p className="mb-0">
                        <Moment format="YYYY">
                          {shipmentData?.truckData?.modelYear}
                        </Moment>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="mb-0 text-secondary mt-3">
                        Unit Number: {shipmentData?.truckData?.unitNumber}
                      </p>
                    </div>
                    <div className="unitNumber">
                      <div className="spaceAround">
                        <h3>
                          <Moment format="MMM">
                            {shipmentData?.truckData?.registrationExpiry}
                          </Moment>
                        </h3>
                        <h3>{shipmentData?.truckData?.state}</h3>
                        <h3>
                          <Moment format="YYYY">
                            {shipmentData?.truckData?.registrationExpiry}
                          </Moment>
                        </h3>
                      </div>
                      <h2 className="mb-0">
                        {shipmentData?.truckData?.numberPlate}
                      </h2>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="spaceAround">
                      <p className="mb-0">
                        {shipmentData?.trailerData?.manuData?.name}
                      </p>
                      <p className="mb-0">
                        <Moment format="YYYY">
                          {shipmentData?.trailerData?.modelYear}
                        </Moment>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="mb-0 text-secondary mt-3">
                        Unit Number: {shipmentData?.trailerData?.unitNumber}
                      </p>
                    </div>
                    <div className="unitNumber">
                      <div className="spaceAround">
                        <h3>
                          <Moment format="MMM">
                            {shipmentData?.trailerData?.registrationExpiry}
                          </Moment>
                        </h3>
                        <h3>{shipmentData?.trailerData?.state}</h3>
                        <h3>
                          {" "}
                          <Moment format="YYYY">
                            {shipmentData?.trailerData?.registrationExpiry}
                          </Moment>
                        </h3>
                      </div>
                      <h2 className="mb-0">
                        {shipmentData?.trailerData?.numberPlate}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="informationAccordients mt-4">
                <div class="accordion" id="accordionExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Driver Information
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      class="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <div className="driverBox">
                          <div className="row">
                            <div className="col-sm-6 driverProfile">
                              <div className="image">
                                {base64ImageDriver && (
                                  <img
                                    src={base64ImageDriver}
                                    alt="converted"
                                  />
                                )}

                                {/* <img
                                  src={shipmentData?.driverData?.image}
                                  alt=""
                                /> */}
                              </div>
                              <h3>{shipmentData?.driverData?.fullName}</h3>
                            </div>
                            <div className="col-sm-6 mt-2 mt-sm-0">
                              <div className="row">
                                <div className="col-6">
                                  <div className="dataBox">
                                    <p className="mb-0">ID</p>
                                    <h4>{shipmentData?.driverData?.id}</h4>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="dataBox">
                                    <p className="mb-0">Phone Number</p>
                                    <h4>
                                      {" "}
                                      {shipmentData?.driverData?.mobile?.number}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-5 mt-sm-0">
                              <div className="dataBox">
                                <p className="mb-0">License</p>
                                <h4>
                                  {
                                    shipmentData?.driverData?.protfolio
                                      ?.licenseNo
                                  }
                                </h4>
                              </div>
                            </div>
                            <div className="col-4 mt-sm-0">
                              <div className="dataBox">
                                <p className="mb-0">License Expiry </p>
                                <h4>
                                  <Moment format="MMMM YYYY">
                                    {
                                      shipmentData?.driverData?.protfolio
                                        ?.licenseExp
                                    }
                                  </Moment>
                                </h4>
                              </div>
                            </div>
                            <div className="col-3 mt-sm-0">
                              <div className="dataBox">
                                <p className="mb-0">Issued State</p>
                                <h4>
                                  {
                                    shipmentData?.driverData?.protfolio
                                      ?.issuedState
                                  }
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingTwo">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Pick Up
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <div className="driverBox">
                          <div className="row">
                            <div className="col-sm-9 mt-2 mt-sm-0">
                              <div className="row">
                                <div className="col-12">
                                  <div className="dataBox">
                                    <p className="mb-0">Location</p>
                                    <h4>
                                      {shipmentData?.shipper[0]?.pickupAddress}
                                    </h4>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="dataBox">
                                    <p className="mb-0">Appointment Time</p>
                                    <h4>
                                      {shipmentData &&
                                        format(
                                          parse(
                                            shipmentData?.shipper[0]
                                              ?.pickupTime,
                                            "HH:mm",
                                            new Date()
                                          ),
                                          "hh:mm a"
                                        )}
                                      -{" "}
                                      <Moment format="DD/MM/YYYY">
                                        {shipmentData?.shipper[0]?.pickupDate}
                                      </Moment>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-3 driverProfile">
                              <div className="image">
                                <img src="../assets/location.png" alt="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingThree">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Delivery
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <div className="driverBox">
                          <div className="row">
                            <div className="col-sm-9 mt-2 mt-sm-0">
                              <div className="row">
                                <div className="col-12">
                                  <div className="dataBox">
                                    <p className="mb-0">Location</p>
                                    <h4>
                                      {
                                        shipmentData?.receiver[0]
                                          ?.deliveryAddress
                                      }
                                    </h4>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="dataBox">
                                    <p className="mb-0">Appointment Time</p>
                                    <h4>
                                      {shipmentData &&
                                        format(
                                          parse(
                                            shipmentData?.receiver[0]
                                              ?.deliveryTime,
                                            "HH:mm",
                                            new Date()
                                          ),
                                          "hh:mm a"
                                        )}
                                      -{" "}
                                      <Moment format="DD/MM/YYYY">
                                        {
                                          shipmentData?.receiver[0]
                                            ?.deliveryDate
                                        }
                                      </Moment>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-3 driverProfile">
                              <div className="image">
                                <img src="../assets/location.png" alt="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingFour">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        Broker
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <div className="driverBox">
                          <div className="row">
                            <div className="col-sm-10 mt-2 mt-sm-0">
                              <div className="row">
                                <div className="col-5">
                                  <div className="dataBox">
                                    <p className="mb-0">Broker Name</p>
                                    <h4>{shipmentData?.broker?.name}</h4>
                                  </div>
                                </div>
                                <div className="col-5">
                                  <div className="dataBox">
                                    <p className="mb-0">Phone Number</p>
                                    {/* <h4>(316) 555-0116</h4> */}
                                    <h4>{shipmentData?.broker?.brokerPhone}</h4>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-5">
                                  <div className="dataBox">
                                    <p className="mb-0">Company name</p>
                                    <h4>{shipmentData?.broker?.brokerAgent}</h4>
                                  </div>
                                </div>
                                <div className="col-5">
                                  <div className="dataBox">
                                    <p className="mb-0">Hèfson ID</p>
                                    <h4>
                                      {shipmentData?.broker?.brokerhefsonId}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-2 driverProfile"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingFive">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFive"
                        aria-expanded="false"
                        aria-controls="collapseFive"
                      >
                        Carrier
                      </button>
                    </h2>
                    <div
                      id="collapseFive"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingFive"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <div className="driverBox">
                          <div className="row">
                            <div className="col-12 mt-2 mt-sm-0">
                              <div className="row">
                                <div className="col-4">
                                  <div className="dataBox">
                                    <p className="mb-0">Carrier Name</p>
                                    <h4 className="text-capitalize">
                                      {shipmentData?.carrierData?.fullName}
                                    </h4>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="dataBox">
                                    <p className="mb-0">
                                      Emergency Phone Number
                                    </p>
                                    <h4>
                                      {shipmentData?.carrierEmergencyPhone}
                                    </h4>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="dataBox">
                                    <p className="mb-0">Hèfson ID</p>
                                    <h4>{shipmentData?.carrierData?.id}</h4>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-4">
                                  <div className="dataBox">
                                    <p className="mb-0">
                                      Dispatch Phone number
                                    </p>
                                    <h4>{shipmentData?.carrierPhone}</h4>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="dataBox">
                                    <p className="mb-0">Contact Number</p>
                                    <h4>{shipmentData?.carrierPhone}</h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-2 driverProfile"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {loginRole === 1 ? (
                    ""
                  ) : (
                    <div class="accordion-item">
                      {loginToken ? (
                        <h2 class="accordion-header" id="headingSix">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseSix"
                            aria-expanded="false"
                            aria-controls="collapseSix"
                          >
                            Mark as completed or cancel
                          </button>
                        </h2>
                      ) : (
                        ""
                      )}

                      <div
                        id="collapseSix"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingSix"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body bg-light">
                          <div className="driverBox ">
                            <div className="row">
                              <div className="col">
                                <button
                                  className=" btn btn-main me-3"
                                  onClick={(e) =>
                                    handleComplete(
                                      e,
                                      shipmentData._id,
                                      shipmentData.loadId
                                    )
                                  }
                                >
                                  Complete
                                </button>
                                <button
                                  className=" btn btn-main"
                                  onClick={(e) =>
                                    handleCancel(
                                      e,
                                      shipmentData._id,
                                      shipmentData.loadId
                                    )
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row my-5 mx-sm-3 mx-0">
            <div className="col-12">
              <div className="spaceBetween">
                <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <div
                      class="nav-link active"
                      data-bs-toggle="tab"
                      href="#home"
                    >
                      Temp
                    </div>
                  </li>
                  <li class="nav-item">
                    <div class="nav-link" data-bs-toggle="tab" href="#menu1">
                      T+H
                    </div>
                  </li>
                  <li class="nav-item">
                    <div class="nav-link" data-bs-toggle="tab" href="#menu2">
                      Bar Chart
                    </div>
                  </li>
                  <li
                    class="nav-item"
                    onClick={() => {
                      return new Promise((resolve, reject) => {
                        setCurrentId(shipmentData?._id);
                        setLatitudeShipper(
                          shipmentData?.shipper?.map(
                            (shipper) => shipper.latitude
                          )
                        );
                        setLongitudeShipper(
                          shipmentData?.shipper?.map(
                            (shipper) => shipper.longitude
                          )
                        );
                        setLatitudeReceiver(
                          shipmentData?.receiver?.map(
                            (receiver) => receiver.latitude
                          )
                        );
                        setLongitudeReceiver(
                          shipmentData?.receiver?.map(
                            (receiver) => receiver.longitude
                          )
                        );
                        setMarkerLat(shipmentData?.realTimeData?.FLatitude);
                        setMarkerLng(shipmentData?.realTimeData?.FLongitude);
                        setMarkerTemp(
                          shipmentData?.realTimeData?.FTemperature1.toFixed(1)
                        );

                        // You can resolve or reject the Promise based on certain conditions, if needed.
                        // For simplicity, we'll resolve it without any conditions.
                        resolve();
                      });
                    }}
                  >
                    <div class="nav-link" data-bs-toggle="tab" href="#menu3">
                      Trip Map
                    </div>
                  </li>
                </ul>
                <div className="download">
                  <p className="mb-0">Download</p>
                  <div className="downlodeBox">
                    <div
                      className="icon"
                      onClick={handleDownload}
                      style={{ cursor: "pointer" }}
                    >
                      <img src="../assets/PDF.png" alt="" />
                    </div>
                  </div>
                  <div className="downlodeBox">
                    <div
                      className="icon"
                      onClick={() => handleDownloadXLS(shipmentData?._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src="../assets/xl.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-content">
                <div class="tab-pane active p-3 w-100 mx-0" id="home">
                  {shipmentData && (
                    <TempChartDetail
                      historyData={shipmentData?.historyData}
                      pickup={shipmentData?.shipper[0]}
                      delivery={shipmentData?.receiver[0]}
                      temperature={shipmentData?.temperature?.actual}
                    />
                  )}
                </div>
                <div class="tab-pane fade p-3" id="menu1">
                  {shipmentData && (
                    <TempHumidity
                      historyData={shipmentData?.historyData}
                      pickup={shipmentData?.shipper[0]}
                      delivery={shipmentData?.receiver[0]}
                      temperature={shipmentData?.temperature?.actual}
                    />
                  )}
                </div>
                <div class="tab-pane fade p-3" id="menu2">
                  {shipmentData && (
                    <BarCharts
                      historyData={shipmentData?.historyData}
                      pickup={shipmentData?.shipper[0]}
                      delivery={shipmentData?.receiver[0]}
                      temperature={shipmentData?.temperature?.actual}
                    />
                  )}
                </div>
                <div class="tab-pane fade p-3" id="menu3">
                  <div className="mapBox">
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4 mx-sm-3 mx-0">
            <div className="col-12">
              <div className="spaceBetween">
                <div className="timeLine">
                  <div className="icon">
                    <img src={TimlineIcon} alt="" />
                  </div>
                  <p className="mb-0">Timeline</p>
                </div>
                <div className="graphBox">
                  <ProgressCircular
                    size={150}
                    width={5}
                    value={(100 - shipmentData?.leftDistancePercentage).toFixed(
                      2
                    )}
                    color={"var(--success)"}
                  />
                  <div className="textBox text-center">
                    <p className="mb-0">Trip</p>
                    <h2 className="mb-0">
                      {(100 - shipmentData?.leftDistancePercentage).toFixed(2) >
                      100
                        ? 100
                        : (100 - shipmentData?.leftDistancePercentage).toFixed(
                            2
                          )}
                      %
                    </h2>
                    <p className="mb-0">Completed</p>
                  </div>
                  <h4 className="mt-3">
                    {shipmentData?.trailerData?.unitNumber}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5 mx-sm-3 mx-0">
            <div className="col-md-6">
              <h6>Shipper</h6>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Shipper</th>
                    <th scope="col">Time Stamp</th>
                    <th scope="col">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div
                        className={`greenIcon ${
                          shipmentData?.isShipperArrival?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </th>
                    <td>Arrival</td>
                    <td>
                      {shipmentData?.isShipperArrival?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperArrival?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isShipperArrival?.status === true ? (
                        <>00:00 h</>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">
                      <div
                        className={`greenIcon ${
                          shipmentData?.isShipperWaiting?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </th>
                    <td>Waiting</td>
                    <td>
                      {shipmentData?.isShipperWaiting?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperWaiting?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isShipperLoading?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperArrival?.createdTime,
                            shipmentData?.isShipperLoading?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isShipperWaiting?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperArrival?.createdTime,
                            Date.now()
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div
                        className={`greenIcon ${
                          shipmentData?.isShipperLoading?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </th>
                    <td>L Started</td>
                    <td>
                      {shipmentData?.isShipperLoading?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperLoading?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <>-</>
                      {/* {shipmentData?.isShipperLoadingComplete?.status ===
                      true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperWaiting?.createdTime,
                            shipmentData?.isShipperLoadingComplete?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isShipperLoading?.status === true ? (
                        <>--:-- h</>
                      ) : (
                        "N/A"
                      )} */}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div
                        className={`greenIcon ${
                          shipmentData?.isShipperLoadingComplete?.status ===
                          false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </th>
                    <td>L Completed</td>
                    <td>
                      {shipmentData?.isShipperLoadingComplete?.status ===
                      true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {
                              shipmentData?.isShipperLoadingComplete
                                ?.createdTime
                            }
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isShipperLoadingComplete?.status ===
                      true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperLoading?.createdTime,
                            shipmentData?.isShipperLoadingComplete?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div
                        className={`greenIcon ${
                          shipmentData?.isShipperCheckout?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        {/* <div className="line"></div> */}
                      </div>
                    </th>
                    <td>Checkout</td>
                    <td>
                      {shipmentData?.isShipperCheckout?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperCheckout?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isShipperCheckout?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperLoadingComplete?.createdTime,
                            shipmentData?.isShipperCheckout?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th scope="row"></th>
                    <td></td>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      {shipmentData?.isShipperArrival?.status === true &&
                      shipmentData?.isShipperWaiting?.status === false &&
                      shipmentData?.isShipperLoading?.status === false &&
                      shipmentData?.isShipperLoadingComplete?.status ===
                        false &&
                      shipmentData?.isShipperCheckout?.status === false ? (
                        <>00:00 h</>
                      ) : shipmentData?.isShipperArrival?.status === true &&
                        shipmentData?.isShipperWaiting?.status === true &&
                        shipmentData?.isShipperLoading?.status === false &&
                        shipmentData?.isShipperLoadingComplete?.status ===
                          false &&
                        shipmentData?.isShipperCheckout?.status === false ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperArrival?.createdTime,
                            shipmentData?.isShipperWaiting?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isShipperArrival?.status === true &&
                        shipmentData?.isShipperWaiting?.status === true &&
                        shipmentData?.isShipperLoading?.status === true &&
                        shipmentData?.isShipperLoadingComplete?.status ===
                          false &&
                        shipmentData?.isShipperCheckout?.status === false ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperArrival?.createdTime,
                            shipmentData?.isShipperLoading?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isShipperArrival?.status === true &&
                        shipmentData?.isShipperWaiting?.status === true &&
                        shipmentData?.isShipperLoading?.status === true &&
                        shipmentData?.isShipperLoadingComplete?.status ===
                          true &&
                        shipmentData?.isShipperCheckout?.status === false ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperArrival?.createdTime,
                            shipmentData?.isShipperLoadingComplete?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isShipperArrival?.status === true &&
                        shipmentData?.isShipperWaiting?.status === true &&
                        shipmentData?.isShipperLoading?.status === true &&
                        shipmentData?.isShipperLoadingComplete?.status ===
                          true &&
                        shipmentData?.isShipperCheckout?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperArrival?.createdTime,
                            shipmentData?.isShipperCheckout?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div
                        className={`greenIcon ${
                          shipmentData?.isShipperDeparture?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                      </div>
                    </th>
                    <td>Departure</td>
                    <td>
                      {shipmentData?.isShipperDeparture?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperDeparture?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isShipperDeparture?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isShipperCheckout?.createdTime,
                            shipmentData?.isShipperDeparture?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h6>Receiver</h6>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Total Hours</th>
                    <th scope="col">Time Stamp</th>
                    <th scope="col">Receiver</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {shipmentData?.isReceiverArrival?.status === true ? (
                        <>00:00 h</>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isReceiverArrival?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverArrival?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>Arrival</td>
                    <td>
                      <div
                        className={`greenIcon ${
                          shipmentData?.isReceiverArrival?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {shipmentData?.isReceiverUnloading?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverArrival?.createdTime,
                            shipmentData?.isReceiverUnloading?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isReceiverWaiting?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverWaiting?.createdTime,
                            Date.now()
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isReceiverWaiting?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverWaiting?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>Waiting</td>
                    <td>
                      <div
                        className={`greenIcon ${
                          shipmentData?.isReceiverWaiting?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <>-</>
                    </td>
                    <td>
                      {shipmentData?.isReceiverUnloading?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverUnloading?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>UL Started</td>
                    <td>
                      <div
                        className={`greenIcon ${
                          shipmentData?.isReceiverUnloading?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {shipmentData?.isReceiverUnLoadingComplete?.status ===
                      true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverUnloading?.createdTime,
                            shipmentData?.isReceiverUnLoadingComplete
                              ?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isReceiverUnLoadingComplete?.status ===
                      true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {
                              shipmentData?.isReceiverUnLoadingComplete
                                ?.createdTime
                            }
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>UL Completed</td>
                    <td>
                      <div
                        className={`greenIcon ${
                          shipmentData?.isReceiverCheckout?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        <div className="line"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {shipmentData?.isReceiverCheckout?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverUnLoadingComplete
                              ?.createdTime,
                            shipmentData?.isReceiverCheckout?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isReceiverCheckout?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverCheckout?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>Checkout</td>
                    <td>
                      <div
                        className={`greenIcon ${
                          shipmentData?.isReceiverCheckout?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                        {/* <div className="line"></div> */}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {shipmentData?.isReceiverArrival?.status === true &&
                      shipmentData?.isReceiverWaiting?.status === false &&
                      shipmentData?.isReceiverUnloading?.status === false &&
                      shipmentData?.isReceiverUnLoadingComplete?.status ===
                        false &&
                      shipmentData?.isReceiverCheckout?.status === false ? (
                        <>00:00 h</>
                      ) : shipmentData?.isReceiverArrival?.status === true &&
                        shipmentData?.isReceiverWaiting?.status === true &&
                        shipmentData?.isReceiverUnloading?.status === false &&
                        shipmentData?.isReceiverUnLoadingComplete?.status ===
                          false &&
                        shipmentData?.isReceiverCheckout?.status === false ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverArrival?.createdTime,
                            shipmentData?.isReceiverWaiting?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isReceiverArrival?.status === true &&
                        shipmentData?.isReceiverWaiting?.status === true &&
                        shipmentData?.isReceiverUnloading?.status === true &&
                        shipmentData?.isReceiverUnLoadingComplete?.status ===
                          false &&
                        shipmentData?.isReceiverCheckout?.status === false ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverArrival?.createdTime,
                            shipmentData?.isReceiverUnloading?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isReceiverArrival?.status === true &&
                        shipmentData?.isReceiverWaiting?.status === true &&
                        shipmentData?.isReceiverUnloading?.status === true &&
                        shipmentData?.isReceiverUnLoadingComplete?.status ===
                          true &&
                        shipmentData?.isReceiverCheckout?.status === false ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverArrival?.createdTime,
                            shipmentData?.isReceiverUnLoadingComplete
                              ?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : shipmentData?.isReceiverArrival?.status === true &&
                        shipmentData?.isReceiverWaiting?.status === true &&
                        shipmentData?.isReceiverUnloading?.status === true &&
                        shipmentData?.isReceiverUnLoadingComplete?.status ===
                          true &&
                        shipmentData?.isReceiverCheckout?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverArrival?.createdTime,
                            shipmentData?.isReceiverCheckout?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <th scope="row">
                      <strong>Total</strong>
                    </th>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      {shipmentData?.isReceiverDeparture?.status === true ? (
                        <>
                          {getTimeDifference(
                            shipmentData?.isReceiverCheckout?.createdTime,
                            shipmentData?.isReceiverDeparture?.createdTime
                          )}{" "}
                          h
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {shipmentData?.isReceiverDeparture?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverDeparture?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>Departure</td>
                    <td>
                      <div
                        className={`greenIcon ${
                          shipmentData?.isReceiverDeparture?.status === false
                            ? "darkIcon"
                            : ""
                        }`}
                      >
                        <i class="fa-solid fa-check"></i>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row my-5 mx-sm-3 mx-0">
            <div className="cdtimeLine">
              <div className="startEndbtns">Pickup</div>
              <div>
                <div
                  className={`stepsDesigns ${
                    shipmentData?.isShipperArrival?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons bluegrads">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">01</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Arrival</h3>
                    {shipmentData?.isShipperArrival?.latitude &&
                    shipmentData?.isShipperArrival?.longitude ? (
                      <p className="contentTexts">{arrivalAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.shipper[0]?.pickupAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isShipperArrival?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperArrival?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
                <div
                  className={`stepsDesigns ${
                    shipmentData?.isShipperWaiting?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons yeelowgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">02</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Waiting</h3>
                    {shipmentData?.isShipperWaiting?.latitude &&
                    shipmentData?.isShipperWaiting?.longitude ? (
                      <p className="contentTexts">{waitingAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.shipper[0]?.pickupAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isShipperWaiting?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperWaiting?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isShipperLoading?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons yeelowgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">03</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">L Started</h3>
                    {shipmentData?.isShipperLoading?.latitude &&
                    shipmentData?.isShipperLoading?.longitude ? (
                      <p className="contentTexts">{loadingAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.shipper[0]?.pickupAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isShipperLoading?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperLoading?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isShipperLoadingComplete?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons yeelowgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">04</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">L Completed</h3>
                    {shipmentData?.isShipperLoadingComplete?.latitude &&
                    shipmentData?.isShipperLoadingComplete?.longitude ? (
                      <p className="contentTexts">
                        {loadingCompleteAddress}
                      </p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.shipper[0]?.pickupAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isShipperLoadingComplete?.status ===
                      true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {
                              shipmentData?.isShipperLoadingComplete
                                ?.createdTime
                            }
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isShipperCheckout?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons yeelowgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">05</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Checkout</h3>
                    {shipmentData?.isShipperCheckout?.latitude &&
                    shipmentData?.isShipperCheckout?.longitude ? (
                      <p className="contentTexts">{checkoutAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.shipper[0]?.pickupAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isShipperCheckout?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperCheckout?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isShipperDeparture?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons yeelowgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">06</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Departure</h3>
                    {shipmentData?.isShipperDeparture?.latitude &&
                    shipmentData?.isShipperDeparture?.longitude ? (
                      <p className="contentTexts">{departureAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.shipper[0]?.pickupAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isShipperDeparture?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isShipperDeparture?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="progressBardesigns">
                <p>
                  <strong>
                    {(100 - shipmentData?.leftDistancePercentage).toFixed(2) >
                    100
                      ? 100
                      : (100 - shipmentData?.leftDistancePercentage).toFixed(2)}
                    %
                  </strong>
                  <span>Task</span>
                  <span> Compelete</span>
                </p>
                <div className="greenProgressbar">
                  <ProgressCircular
                    size={250}
                    width={40}
                    value={
                      (100 - shipmentData?.leftDistancePercentage).toFixed(2) >
                      100
                        ? 100
                        : (100 - shipmentData?.leftDistancePercentage).toFixed(
                            2
                          )
                    }
                    color={"var(--success)"}
                  />
                </div>
              </div>
              <div>
                <div
                  className={`stepsDesigns ${
                    shipmentData?.isReceiverArrival?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons redsgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">07</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Arrival</h3>
                    {shipmentData?.isReceiverArrival?.latitude &&
                    shipmentData?.isReceiverArrival?.longitude ? (
                      <p className="contentTexts">{receiverArrivalAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.receiver[0]?.deliveryAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isReceiverArrival?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverArrival?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isReceiverWaiting?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons redsgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">08</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Waiting</h3>
                    {shipmentData?.isReceiverWaiting?.latitude &&
                    shipmentData?.isReceiverWaiting?.longitude ? (
                      <p className="contentTexts">{receiverWaitingAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.receiver[0]?.deliveryAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isReceiverWaiting?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverWaiting?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isReceiverUnloading?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons redsgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">09</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">UL Started</h3>
                    {shipmentData?.isReceiverUnloading?.latitude &&
                    shipmentData?.isReceiverUnloading?.longitude ? (
                      <p className="contentTexts">{receiverUnloadingAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.receiver[0]?.deliveryAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isReceiverUnloading?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverUnloading?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isReceiverUnLoadingComplete?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons redsgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">10</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">UL Completed</h3>
                    {shipmentData?.isReceiverUnLoadingComplete?.latitude &&
                    shipmentData?.isReceiverUnLoadingComplete?.longitude ? (
                      <p className="contentTexts">{receiverUnLoadingCompleteAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.receiver[0]?.deliveryAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isReceiverUnLoadingComplete?.status ===
                      true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {
                              shipmentData?.isReceiverUnLoadingComplete
                                ?.createdTime
                            }
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isReceiverCheckout?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons redsgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">11</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Checkout</h3>
                    {shipmentData?.isReceiverCheckout?.latitude &&
                    shipmentData?.isReceiverCheckout?.longitude ? (
                      <p className="contentTexts">{receiverCheckoutAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.receiver[0]?.deliveryAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isReceiverCheckout?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverCheckout?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`stepsDesigns ${
                    shipmentData?.isReceiverDeparture?.status === false
                      ? "disable"
                      : ""
                  }`}
                >
                  <div className="locatioIcons greensgrds">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="counterNumber">12</div>

                  <div className="textcontents">
                    <h3 className="firstHeadings">Departure</h3>
                    {shipmentData?.isReceiverDeparture?.latitude &&
                    shipmentData?.isReceiverDeparture?.longitude ? (
                      <p className="contentTexts">{receiverDepartureAddress}</p>
                    ) : (
                      <p className="contentTexts">
                        {shipmentData?.receiver[0]?.deliveryAddress}
                      </p>
                    )}
                    <p className="scecondHeads">
                      {shipmentData?.isReceiverDeparture?.status === true ? (
                        <>
                          <Moment format="HH:mm - MMMM D YYYY">
                            {shipmentData?.isReceiverDeparture?.createdTime}
                          </Moment>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`startEndbtns ${
                  shipmentData?.isReceiverDeparture?.status === false
                    ? "disable"
                    : ""
                }`}
              >
                Delivery
              </div>
            </div>
          </div>
          <div className="row my-5 mx-sm-3 mx-0">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center">
              <button className="btn ">
                On Route - {shipmentData?.totalHours.toFixed(0)} Hours
              </button>
            </div>
            <div className="col-md-4 text-md-end text-center mt-3 mt-md-0">
              <button className="btn-black ">
                Total - {shipmentData?.totalHours.toFixed(0)} Hours
              </button>
            </div>
          </div>
          <div className="row my-4 mx-sm-3 mx-0">
            <div className="col-12 travelRecordDetail">
              <div className="loc">
                <div className="icon">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div className="text">
                  <p className="mb-0">
                    {shipmentData?.shipper[0]?.pickupAddress}
                  </p>
                </div>
              </div>

              <div className="range">
                <div className="total"></div>
                <div
                  className="value"
                  style={{
                    "--move-point-left": `${
                      (
                        (parseInt(shipmentData?.coveredHours).toFixed(0) /
                          shipmentData?.totalDistance.toFixed(0)) *
                        100
                      ).toFixed(0) > 100
                        ? 100
                        : (
                            (parseInt(shipmentData?.coveredHours).toFixed(0) /
                              shipmentData?.totalDistance.toFixed(0)) *
                            100
                          ).toFixed(0)
                    }%`,
                  }}
                ></div>

                <div
                  className="temp"
                  style={{
                    "--move-point-left": `${(
                      (parseInt(shipmentData?.coveredHours).toFixed(0) /
                        shipmentData?.totalDistance.toFixed(0)) *
                      100
                    ).toFixed(0)}%`,
                  }}
                >
                  <p className="mb-0 smText">
                    {shipmentData?.realTimeData?.FTemperature1.toFixed(1)}F
                  </p>
                </div>
              </div>

              <div className="loc">
                <div className="icon">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div className="text">
                  <p className="mb-0">
                    {shipmentData?.receiver[0]?.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row my-5 mx-sm-3 mx-0">
            <div className="col-12 text-center">
              <button
                className=" btn btn-main me-3"
                onClick={(e) =>
                  handleComplete(e, shipmentData._id, shipmentData.loadId)
                }
              >
                Complete
              </button>
              <button
                className=" btn btn-main"
                onClick={(e) =>
                  handleCancel(e, shipmentData._id, shipmentData.loadId)
                }
              >
                Cancel
              </button>
            </div>
          </div> */}
        </div>
      )}
      {loginToken ? loginRole === 1 ? <ToolBoxAdmin /> : <ToolBox /> : ""}
    </div>
  );
};

export default ShipmentMoreinfo;
GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_API,
})(ShipmentMoreinfo);

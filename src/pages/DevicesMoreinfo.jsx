import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { ProgressCircular } from "ui-neumorphism";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";
import * as api from "../api/index";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import GeocodingComponent from "../components/GeocodingComponent/GeocodingComponent";
import ShipmentMapComponent from "../components/ShipmentMapComponent/ShipmentMapComponent";
import ShipmentMapDetail from "../components/ShipmentMapDetail/ShipmentMapDetail";
import BarCharts from "../components/BarChart/BarChart";
import Cookies from "js-cookie";
import ToolBoxAdmin from "./ToolBoxAdmin";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { listMapDataDevice } from "../actions/mapData";
import { useDispatch, useSelector } from "react-redux";
import TempChartDetailSensor from "../components/TempChartDetailSensor/TempChartDetailSensor";
import TempHumiditySensor from "../components/TempHumiditySensor/TempHumiditySensor";
import ProgressTempRed from "../components/ProgressTemp/ProgressTempRed";
import ProgressTemp from "../components/ProgressTemp/ProgressTemp";
import ShipmentMapComponentTS from "../components/ShipmentMapComponent/ShipmentMapComponentTS";

const TrailersMoreInfo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [deviceData, setDeviceData] = useState(null);

  const [latitudeShipper, setLatitudeShipper] = useState(0);
  const [longitudeShipper, setLongitudeShipper] = useState(0);
  const [latitudeReceiver, setLatitudeReceiver] = useState(0);
  const [longitudeReceiver, setLongitudeReceiver] = useState(0);
  const [markerLat, setMarkerLat] = useState(0);
  const [markerLng, setMarkerLng] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [markerTemp, setMarkerTemp] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.getDeviceDetail(id);
        console.log("Device Data --- ", data);
        setDeviceData(data?.data[0]);
        handleGetAddress(
          data?.data[0]?.realTimeData?.FLatitude,
          data?.data[0]?.realTimeData?.FLongitude
        );
        setLoading(false); // Set loading state to false after data is fetched
        dispatch(listMapDataDevice(id));
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
          return toast(error.response.data.message);
        }
      }
    })();

    return () => {
      setLatitudeShipper([]);
      setLongitudeShipper([]);
      setLatitudeReceiver([]);
      setLongitudeReceiver([]);
      setMarkerLat(0);
      setMarkerLng(0);
      setCurrentId(0);
      setMarkerTemp(0);
      setDeviceData(null);
    };
  }, []);
  const { loadingMapData, mapDataDevice } = useSelector(
    (state) => state.mapDataReducer
  );
  console.log("mapDataDevice ----> ", mapDataDevice);
  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };
  const overrideMap = {
    display: "flex",
    justifyContent: "left",
    paddingLeft: "200px",
    marginTop: "100px ",
    borderColor: "red",
  };
  useEffect(() => {}, [
    latitudeShipper,
    longitudeShipper,
    latitudeReceiver,
    longitudeReceiver,
  ]);

  const [pdfLoader, setPdfLoader] = useState(false);

  const handleDownload = () => {
    setPdfLoader(true);
    const input = document.getElementById("content-to-screenshot");

    html2canvas(input, { allowTaint: true, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
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

      pdf.save(`${deviceData?.FAssetID}.pdf`);
      setPdfLoader(false);
    });
  };

  const handleDownloadXLS = async (id) => {
    try {
      setPdfLoader(true);

      const { data } = await api.downloadXLSDevice(id);
      const fileUrl = data.data;

      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.target = "_blank";
      link.download = `${deviceData?.FAssetID}.xls`;

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

  const [base64Image, setBase64Image] = useState("");

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
      "deviceData?.trailerData?.manuData?.image -- ",
      deviceData?.trailerData?.manuData?.image
    );
    toDataURL(deviceData?.trailerData?.manuData?.image, function (dataUrl) {
      setBase64Image(dataUrl);
      console.log("RESULT:", dataUrl);
    });
  }, [deviceData]);

  return (
    <div className="trailerInfo" id="content-to-screenshot">
      <div className="container-fluid">
        <HeaderComponent titleProp={deviceData?.FAssetID} />
      </div>
      {loading && deviceData === null ? (
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
      ) : Object.keys(deviceData?.trailerData || {}).length === 0 ? (
        <h4 className="mt-4 text-center">
          This device is not assigned to any trailer yet
        </h4>
      ) : (
        <div className="container-fluid">
          <div className="row mx-sm-4 mx-0 mb-5 trailerInfoLayout">
            <div className="col-lg-8 dataBox">
              <div className="row">
                <div className="col-12 mapGraph">
                  <div className="data">
                    <div className="icon">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    {/* {deviceData &&
                      deviceData?.realTimeData?.FLongitude &&
                      deviceData?.realTimeData?.FLatitude && (
                        <div className="text">
                          <p className="mb-0">
                            <GeocodingComponent
                              lat={deviceData?.realTimeData?.FLatitude}
                              lng={deviceData?.realTimeData?.FLongitude}
                            />
                          </p>
                        </div>
                      )} */}
                    {address}
                  </div>
                  {deviceData &&
                  deviceData?.realTimeData?.FLatitude &&
                  deviceData?.realTimeData?.FLongitude ? (
                    <div className="mapBox">
                      <div className="sideGradient"></div>
                      <div className="topGradient"></div>
                      <div className="rightGradient"></div>
                      <div className="bottomGradient"></div>
                      <div className="gpsButton" onClick={handleReloadMap}>
                        <i class="fa-solid fa-location-crosshairs"></i>
                      </div>
                      <ShipmentMapComponentTS
                        lat={deviceData?.realTimeData?.FLatitude}
                        lng={deviceData?.realTimeData?.FLongitude}
                        device={deviceData}
                        reloadMap={reloadMap}
                      />
                    </div>
                  ) : (
                    <div className="mapBox">
                      <h4>Real time coordinates not available</h4>
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8">
                  <div className="sensorData text-center mt-4">
                    <div className="row">
                      <div className="col-sm-5 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Sensor Battery</h6>
                          <div className="spaceAround">
                            <div>
                              <h2 class="d-flex">
                                {deviceData?.realTimeData
                                  ? deviceData?.realTimeData?.FBattery >= 100
                                    ? 100
                                    : deviceData?.realTimeData?.FBattery
                                  : 0}
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
                      <div className="col-sm-3 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Door Open</h6>
                          <h2>
                            {deviceData?.realTimeData
                              ? deviceData?.realTimeData?.FDoor <= 0
                                ? 0
                                : deviceData?.realTimeData?.FDoor
                              : 0}
                          </h2>
                        </div>
                      </div>
                      <div className="col-sm-3 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Humidity</h6>
                          <h2>
                            {deviceData?.realTimeData
                              ? deviceData?.realTimeData?.FHumidity1
                              : 0}
                            %
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-sm-5 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Distance Covered</h6>
                          <div className="spaceAround">
                            <div>
                              <h2>
                                {deviceData?.coveredHours
                                  ? parseFloat(
                                      deviceData?.coveredHours
                                    ).toFixed(0)
                                  : 0}
                              </h2>
                              <p>Miles</p>
                            </div>
                            <div>
                              <h2>
                                {deviceData?.leftDistancePercentage
                                  ? parseFloat(
                                      deviceData?.leftDistancePercentage
                                    ).toFixed(1)
                                  : 0}
                                %
                              </h2>
                              <p>Remaining</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Time left to deliver</h6>
                          <div className="spaceAround">
                            <div>
                              <h2>
                                {deviceData?.leftTime
                                  ? deviceData?.leftTime
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
                      <div className="col-sm-3 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Temp Alert</h6>
                          <h2>
                            {deviceData?.realTimeData
                              ? deviceData?.realTimeData?.FAlarm <= 0
                                ? 0
                                : deviceData?.realTimeData?.FAlarm
                              : 0}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {deviceData?.realTimeData && (
                  <div className="col-lg-4 mt-4 mt-lg-0 centerMid">
                    <div className="circularGraph">
                      <div
                        // className={
                        //   deviceData?.realTimeData?.FTemperature1 >
                        //     deviceData?.shipmentData?.temperature?.max ||
                        //   deviceData?.realTimeData?.FTemperature1 <
                        //     deviceData?.shipmentData?.temperature?.min
                        //     ? "temperatureRed"
                        //     : "temperature"
                        // }
                        className="temperature"
                      >
                        <ProgressTemp
                          value={deviceData?.realTimeData?.FTemperature1.toFixed(
                            1
                          )}
                          text={"Reefer"}
                        />
                        {/* <ProgressTempRed
                        value={deviceData?.realTimeData?.FTemperature1.toFixed(
                          1
                        )}
                        text={"Reefer"}
                        shipmentData={deviceData}
                      /> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="trailerInfoBox">
                <div className="row align-items-center">
                  <div className="col-6">
                    <h6 style={{ textAlign: "center" }}>Associated with</h6>
                    <h6 style={{ textAlign: "center", color: "InfoText" }}>
                      <strong>{deviceData?.trailerData?.unitNumber}</strong>
                    </h6>
                    {base64Image && <img src={base64Image} alt="converted" />}

                    {/* <img
                      src={deviceData?.trailerData?.manuData?.image}
                      alt=""
                      className="w-100"
                    /> */}
                  </div>
                  <div className="col-6">
                    <h5>
                      Trailer -{" "}
                      <Moment format="YYYY">
                        {deviceData?.trailerData?.modelYear}
                      </Moment>
                    </h5>
                    <h6> Unit Number: {deviceData?.trailerData?.unitNumber}</h6>
                    <div className="unitNumber">
                      <div className="spaceBetween">
                        <h3 className="month">
                          <Moment format="MMM">
                            {deviceData?.trailerData?.registrationExpiry}
                          </Moment>
                        </h3>
                        <h3 className="city">
                          {deviceData?.trailerData?.state}
                        </h3>
                        <h3>
                          <Moment format="YYYY">
                            {deviceData?.trailerData?.registrationExpiry}
                          </Moment>
                        </h3>
                      </div>
                      <h2 className="mb-0">
                        {deviceData?.trailerData?.numberPlate}
                      </h2>
                    </div>
                  </div>
                  <div className="col-12">
                    <p className="mb-0">ICCID - {deviceData?.FAssetID}</p>
                  </div>
                </div>
              </div>
              {/* <div className="deviceid mt-30"> */}
              {/* <div className="idNumber">
                  <p className="mb-0">Device ID - {deviceData?.FAssetID}</p>
                </div> */}
              {/* <div className="edit">
                  <img src="../assets/icons/Edit.svg" alt="" />
                </div> */}
              {/* </div> */}
              <div className="activeShipment mt-30">
                <div className="spaceBetween">
                  <h4>Active Shipment </h4>
                  {deviceData?.activeShipment && (
                    <div className="icon">
                      <Link
                        to={`/Shipment-moreinfo/${deviceData?.activeShipment?._id}`}
                      >
                        <img src="../assets/icons/rightArrow.svg" alt="" />
                      </Link>
                    </div>
                  )}
                </div>
                <h3>{deviceData?.activeShipment?.loadId}</h3>
                <div className="spaceBetween">
                  {deviceData?.activeShipment && (
                    <div className="loc">
                      <img src="../assets/icons/LocationLight.svg" alt="" />
                      {`${
                        deviceData?.activeShipment?.shipper[0]?.pickupAddress.split(
                          ","
                        )[0]
                      }, ${
                        deviceData?.activeShipment?.shipper[0]?.pickupAddress.split(
                          ","
                        )[
                          deviceData?.activeShipment?.shipper[0]?.pickupAddress.split(
                            ","
                          ).length - 2
                        ]
                          ? deviceData?.activeShipment?.shipper[0]?.pickupAddress.split(
                              ","
                            )[
                              deviceData?.activeShipment?.shipper[0]?.pickupAddress.split(
                                ","
                              ).length - 2
                            ]
                          : ""
                      }`}
                    </div>
                  )}
                  {deviceData?.activeShipment && (
                    <div className="loc">
                      <img src="../assets/icons/LocationLight.svg" alt="" />

                      {`${
                        deviceData?.activeShipment?.receiver[0]?.deliveryAddress.split(
                          ","
                        )[0]
                      }, ${
                        deviceData?.activeShipment?.receiver[0]?.deliveryAddress.split(
                          ","
                        )[
                          deviceData?.activeShipment?.receiver[0]?.deliveryAddress.split(
                            ","
                          ).length - 2
                        ]
                          ? deviceData?.activeShipment?.receiver[0]?.deliveryAddress.split(
                              ","
                            )[
                              deviceData?.activeShipment?.receiver[0]?.deliveryAddress.split(
                                ","
                              ).length - 2
                            ]
                          : ""
                      }`}
                    </div>
                  )}
                </div>
                {deviceData?.activeShipment && (
                  <div className="progressCOntainer">
                    <div class="progress">
                      <div
                        class="progress-bar bg-success"
                        role="progressbar"
                        // style={{ width: "25%" }}
                        style={{
                          width: `${(
                            (parseInt(deviceData?.coveredHours).toFixed(0) /
                              deviceData?.activeShipment?.totalDistance.toFixed(
                                0
                              )) *
                            100
                          ).toFixed(0)}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p className="mb-0">
                      {(
                        (parseInt(deviceData?.coveredHours).toFixed(0) /
                          deviceData?.activeShipment?.totalDistance.toFixed(
                            0
                          )) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                  </div>
                )}
              </div>
              <div className="informationAccordients mt-4">
                <div class="accordion" id="accordionExample">
                  <h5 className="p-3">Completed Shipment </h5>
                  {deviceData?.completeShipment?.map((data, index) => (
                    <div class="accordion-item" key={index}>
                      <h2 class="accordion-header" id={`heading${index}`}>
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded="false"
                          aria-controls={`collapse${index}`}
                        >
                          {data?.loadId}
                          <div
                            className="icon"
                            style={{
                              backgroundColor: "white",
                              borderRadius: "50%",
                              paddingTop: "3px",
                              paddingLeft: "8px",
                              paddingBottom: "3px",
                              paddingRight: "5px",
                              color: "black",
                              marginLeft: "10px",
                            }}
                          >
                            <Link
                              to={`/complete-shipment-moreinfo/${data?._id}`}
                            >
                              <img
                                src="../assets/icons/rightArrow.svg"
                                alt=""
                              />
                            </Link>
                          </div>
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        class="accordion-collapse collapse"
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body activeShipment">
                          {/* Your content for the accordion item */}

                          <div className="spaceBetween">
                            <div className="loc">
                              <img
                                src="../assets/icons/LocationLight.svg"
                                alt=""
                              />
                              {`${
                                data?.shipper[0]?.pickupAddress.split(",")[0]
                              }, ${
                                data?.shipper[0]?.pickupAddress.split(",")[
                                  data?.shipper[0]?.pickupAddress.split(",")
                                    .length - 2
                                ]
                                  ? data?.shipper[0]?.pickupAddress.split(",")[
                                      data?.shipper[0]?.pickupAddress.split(",")
                                        .length - 2
                                    ]
                                  : ""
                              }`}
                            </div>
                            <div className="loc">
                              <img
                                src="../assets/icons/LocationLight.svg"
                                alt=""
                              />

                              {`${
                                data?.receiver[0]?.deliveryAddress.split(",")[0]
                              }, ${
                                data?.receiver[0]?.deliveryAddress.split(",")[
                                  data?.receiver[0]?.deliveryAddress.split(",")
                                    .length - 2
                                ]
                                  ? data?.receiver[0]?.deliveryAddress.split(
                                      ","
                                    )[
                                      data?.receiver[0]?.deliveryAddress.split(
                                        ","
                                      ).length - 2
                                    ]
                                  : ""
                              }`}
                            </div>
                          </div>

                          <div className="progressCOntainer">
                            <div class="progress">
                              <div
                                class="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: "100%" }}
                                aria-valuenow="25"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <p className="mb-0">100%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row mx-sm-4 mx-0 my-5">
            <div className="col-12">
              <div className="spaceBetween">
                <ul class="nav nav-tabs mt-3">
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
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      data-bs-toggle="tab"
                      href="#menu3"
                      onClick={() => {
                        if (deviceData && deviceData?.activeShipment) {
                          setCurrentId(deviceData?.activeShipment?._id);
                          setLatitudeShipper(
                            deviceData?.activeShipment?.shipper[0]?.latitude
                          );
                          setLongitudeShipper(
                            deviceData?.activeShipment?.shipper[0]?.longitude
                          );
                          setLatitudeReceiver(
                            deviceData?.activeShipment?.receiver[0]?.latitude
                          );
                          setLongitudeReceiver(
                            deviceData?.activeShipment?.receiver[0]?.longitude
                          );
                          setMarkerLat(deviceData?.realTimeData?.FLatitude);
                          setMarkerLng(deviceData?.realTimeData?.FLongitude);
                          setMarkerTemp(
                            deviceData?.realTimeData?.FTemperature1.toFixed(1)
                          );
                        }
                      }}
                    >
                      Trip Map
                    </div>
                  </li>
                </ul>
                {/* <div className="timeBox mt-3">
                  <h5 className="time">
                    {deviceData?.realTimeData?.FGPSTime.slice(11, 19)}
                  </h5>
                  <p className="mb-0">
                    <Moment format="dddd D,YYYY">
                      {deviceData?.realTimeData?.FGPSTime}
                    </Moment>
                  </p>
                </div> */}
                <div className="download mt-3">
                  <p className="mb-0">Download</p>
                  <div className="downlodeBox">
                    <div className="icon">
                      <div
                        className="icon"
                        onClick={handleDownload}
                        style={{ cursor: "pointer" }}
                      >
                        <img src="../assets/PDF.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="downlodeBox">
                    <div
                      className="icon"
                      onClick={() => handleDownloadXLS(deviceData?._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src="../assets/xl.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              {loadingMapData ? (
                <PropagateLoader
                  cssOverride={overrideMap}
                  size={10}
                  color={"#000"}
                  loading={loadingMapData}
                />
              ) : (
                <div class="tab-content">
                  <div class="tab-pane  active py-3 w-100 mx-0" id="home">
                    {mapDataDevice.length > 0 ? (
                      <TempChartDetailSensor
                        historyData={mapDataDevice}
                        // pickup={deviceData?.activeShipment?.shipper[0]}
                        // delivery={deviceData?.activeShipment?.receiver[0]}
                        // temperature={deviceData?.temperature?.actual}
                      />
                    ) : (
                      <h4 className="text-center">No data available to plot</h4>
                    )}
                  </div>
                  <div class="tab-pane  fade py-3" id="menu1">
                    {mapDataDevice.length > 0 ? (
                      <TempHumiditySensor
                        historyData={mapDataDevice}
                        // pickup={deviceData?.activeShipment?.shipper[0]}
                        // delivery={deviceData?.activeShipment?.receiver[0]}
                        // temperature={deviceData?.temperature?.actual}
                      />
                    ) : (
                      <h4 className="text-center">No data available to plot</h4>
                    )}
                  </div>
                  <div class="tab-pane  fade py-3" id="menu2">
                    {mapDataDevice.length > 0 ? (
                      <BarCharts
                        historyData={mapDataDevice}
                        // pickup={deviceData?.activeShipment?.shipper[0]}
                        // delivery={deviceData?.activeShipment?.receiver[0]}
                        // temperature={deviceData?.temperature?.actual}
                      />
                    ) : (
                      <h4 className="text-center">No data available to plot</h4>
                    )}
                  </div>

                  {deviceData &&
                  deviceData?.activeShipment &&
                  latitudeShipper &&
                  longitudeShipper &&
                  latitudeReceiver &&
                  longitudeReceiver &&
                  currentId &&
                  markerLat &&
                  markerLng &&
                  markerTemp ? (
                    <div class="tab-pane  fade py-3" id="menu3">
                      <div className="mapBox">
                        <div className="sideGradient"></div>
                        <div className="topGradient"></div>
                        <div className="rightGradient"></div>
                        <div className="bottomGradient"></div>
                        <div className="gpsButton" onClick={handleReloadMap}>
                          <i class="fa-solid fa-location-crosshairs"></i>
                        </div>
                        <ShipmentMapDetail
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
                      </div>
                    </div>
                  ) : (
                    <div className="tab-pane fade py-3" id="menu3">
                      <h4>There is no active shipment to show map</h4>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* <div className="row mx-sm-4 mx-0 mt-4">
            <div className="col-12">
              <div className="graphContainer">
                <div className="graphBox">
                  <ProgressCircular
                    size={150}
                    width={3}
                    value={(deviceData?.trailerData?.currentHours / 4000) * 100}
                    color={
                      deviceData?.trailerData?.currentHours < 2500
                        ? "var(--success)"
                        : deviceData?.trailerData?.currentHours > 2500 &&
                          deviceData?.trailerData?.currentHours < 3000
                        ? "var(--warning)"
                        : deviceData?.trailerData?.currentHours > 3000
                        ? "var(--error)"
                        : "var(--error)"
                    }
                  />
                  <div className="textBox text-center">
                    <p className="mb-0">Trip</p>
                    <h2 className="mb-0">
                      {deviceData?.trailerData?.currentHours}
                    </h2>
                    <p className="mb-0">Hours</p>
                  </div>
                </div>
                <button className="btn">Reset</button>
              </div>
            </div>
            <div className="col-12 mt-4">
              <div className="spaceBetween">
                <div className="timeLine">
                  <div className="icon">
                    <img src="../assets/timeline.png" alt="" />
                  </div>
                  <p className="mb-0">Timeline</p>
                </div>
                <button className="btn">Add Event</button>
              </div>
            </div>
          </div>
          <div className="row mx-sm-4 mx-0 mt-3">
            <div className="col-12">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Time Stamp</th>
                    <th scope="col">Comment</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <i class="fa-regular fa-circle-check"></i>
                    </th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <i class="fa-regular fa-circle-check"></i>
                    </th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <i class="fa-regular fa-circle-check"></i>
                    </th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
      )}
      {JSON.parse(Cookies.get("role")) === 1 ? <ToolBoxAdmin /> : <ToolBox />}
    </div>
  );
};

export default TrailersMoreInfo;

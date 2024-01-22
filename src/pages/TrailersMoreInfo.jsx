import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { ProgressCircular } from "ui-neumorphism";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";
import * as api from "../api/index";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
// import GeocodingComponent from "../components/GeocodingComponent/GeocodingComponent";
// import ShipmentMapComponent from "../components/ShipmentMapComponent/ShipmentMapComponent";
import ShipmentMapDetail from "../components/ShipmentMapDetail/ShipmentMapDetail";
import BarCharts from "../components/BarChart/BarChart";
import { useDispatch, useSelector } from "react-redux";
import {
  createEvent,
  detailTrailer,
  resetHour,
  updateTrailer,
} from "../actions/trailer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { listMapData } from "../actions/mapData";
import TempChartDetailSensor from "../components/TempChartDetailSensor/TempChartDetailSensor";
import TempHumiditySensor from "../components/TempHumiditySensor/TempHumiditySensor";
import ProgressTempRed from "../components/ProgressTemp/ProgressTempRed";
import carr from "../assets/carrr.png";
import ProgressTemp from "../components/ProgressTemp/ProgressTemp";
import Cookies from "js-cookie";
import ToolBoxAdmin from "./ToolBoxAdmin";
import ShipmentMapComponentTS from "../components/ShipmentMapComponent/ShipmentMapComponentTS";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CalenderIcon from "../assets/icons/CalendarDate.svg";

const baseURL = process.env.REACT_APP_BASEURL;
const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;
const header = {
  headers: {
    Authorization: loginToken,
  },
};

const stateOptions = [
  { value: "California", label: "California" },
  { value: "Sacramanto", label: "Sacramanto" },
  { value: "Ontario", label: "Ontario" },
];

const loginRole = Cookies.get("role") ? JSON.parse(Cookies.get("role")) : null;

const TrailersMoreInfo = () => {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const { id } = useParams();
  const [unitState, setUnitState] = useState([]);

  const [latitudeShipper, setLatitudeShipper] = useState(0);
  const [longitudeShipper, setLongitudeShipper] = useState(0);
  const [latitudeReceiver, setLatitudeReceiver] = useState(0);
  const [longitudeReceiver, setLongitudeReceiver] = useState(0);
  const [markerLat, setMarkerLat] = useState(0);
  const [markerLng, setMarkerLng] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [markerTemp, setMarkerTemp] = useState(0);
  const [manufacture, setManufacture] = useState([]);
  const [sensors, setSensors] = useState([]);

  const [trailerData, setTrailerData] = useState({
    unitNumber: "",
    manufacturer: "",
    modelYear: null,
    numberPlate: "",
    registrationExpiry: null,
    state: "",
    engineHours: "",
    sensorId: "",
  });

  // setting manufacturer for dropdown
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChangeOptions = (selectedOption) => {
    setSelectedOption(selectedOption);
    // Access the selected value using selectedOption.value._id
    const selectedValue = selectedOption ? selectedOption.value._id : "";
    // ...
    setTrailerData({
      ...trailerData,
      manufacturer: selectedValue,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      manufacturer: null,
    }));
  };
  let value = null;
  if (currentId === 0 && trailerData.manufacturer === "") {
    value = { value: "", label: "Manufacturer" }; // Set custom placeholder option
  } else {
    value = {
      value: trailerData.manufacturer,
      label: manufacture?.find((em) => em._id === trailerData.manufacturer)
        ?.name,
    }; // Set custom placeholder option
  }
  // dropdown manufacturer

  console.log("manufacture-- ", manufacture);
  console.log("sensors-- ", sensors);

  // setting selected option for dropdown
  const [selectedOptionSensor, setSelectedOptionSensor] = useState(null);

  const handleChangeOptionsSensor = (selectedOptionSensor) => {
    setSelectedOptionSensor(selectedOptionSensor);
    // Access the selected value using selectedOptionSensor.value._id
    const selectedValue = selectedOptionSensor
      ? selectedOptionSensor.value._id
      : "";
    // ...
    setTrailerData({
      ...trailerData,
      sensorId: selectedValue,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      sensorId: null,
    }));
  };
  let valueSensor = null;
  if (currentId === 0 && trailerData.sensorId === "") {
    valueSensor = { value: "", label: "Sensor Id" }; // Set custom placeholder option
  } else {
    valueSensor = {
      value: trailerData.sensorId,
      label: sensors?.find((em) => em._id === trailerData.sensorId)?.FAssetID,
    }; // Set custom placeholder option
  }
  //sensor dropdown

  // setting selected option for state dropdown
  const [selectedOptionState, setSelectedOptionState] = useState(null);

  const handleChangeOptionsState = (selectedOptionState) => {
    setSelectedOptionState(selectedOptionState);
    // Update driverData with selected value
    const selectedValue = selectedOptionState ? selectedOptionState.value : "";
    // ...
    setTrailerData({
      ...trailerData,
      state: selectedValue,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      state: null,
    }));
  };
  let valueState = null;
  if (currentId === 0 && trailerData.state === "") {
    valueState = { value: "", label: "Select State" }; // Set custom placeholder option
  } else {
    // valueState = stateOptions.find((option) => option.value === trailerData.state);
    valueState = { value: trailerData.state, label: trailerData.state };
  }
  // dropdown value state

  const [errors, setErrors] = useState({});
  console.log("Errrrr: ", errors);
  const handleUnitNumberBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: "Unit Number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: null,
      }));
    }
  };

  const handleSensorIdBlur = (e) => {
    const value = trailerData.sensorId;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sensorId: "Sensor id is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sensorId: null,
      }));
    }
  };

  const handleNumberPlateBlur = (e) => {
    const value = e.target.value.trim();

    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: "Number Plate is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: null,
      }));
    }
  };

  const handleEngineHoursBlur = (e) => {
    const value = e.target.value.trim();
    const isValid = !value || validateNumberField(value);
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        engineHours: "Engine Hour is required.",
      }));
    } else if (isValid === false) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        engineHours: "Engine Hour should be number",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        engineHours: null,
      }));
    }
  };
  const [resetHours, setResetHours] = useState("");

  const resetSubmit = (e, resetHours) => {
    e.preventDefault();
    dispatch(resetHour(trailerDetail._id, resetHours));
  };

  const validateNumberField = (myNumber) => {
    const numberRegEx = /\-?\d*\.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
  };
  const handleResetHoursBlur = (e) => {
    const value = e.target.value.trim();
    const isValid = !value || validateNumberField(value);
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        resetHours: "Reset Hours is required.",
      }));
    } else if (isValid === false) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        resetHours: "Reset Hours should be number",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        resetHours: null,
      }));
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    window.onload = function () {
      new window.google.maps.Geocoder();
    };
    dispatch(detailTrailer(id));
    dispatch(listMapData(id));
    setMfgData();
    setSensorData();
    setUnitStateData();

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

  async function setMfgData() {
    const getManufactur = await axios.get(
      `${baseURL}/manufacture/list?limit=10&page=1&type=2`,
      header
    );
    if (
      getManufactur?.data?.data?.data.length > 0 &&
      manufacture.length === 0
    ) {
      await setManufacture(getManufactur?.data?.data?.data);
    }
  }

  async function setSensorData() {
    const getSensor = await axios.get(
      `${baseURL}/device/list?limit=10&page=1`,
      header
    );
    if (getSensor?.data?.data?.data.length > 0 && sensors?.length === 0) {
      await setSensors(getSensor?.data?.data?.data);
    }
  }

  async function setUnitStateData() {
    const states = await axios.get(
      `${baseURL}/states/list?limit=100&page=1`,
      header
    );
    if (states?.data?.data?.stateList.length > 0) {
      await setUnitState(states?.data?.data?.stateList);
    }
  }

  // setting state dropdown
  const [selectedOptionStates, setSelectedOptionStates] = useState(null);

  const handleChangeOptionsStates = (selectedOptionStates) => {
    setSelectedOptionStates(selectedOptionStates);
    // Access the selected value using selectedOptionStates.value._id
    const selectedValue = selectedOptionStates
      ? selectedOptionStates.value
      : "";
    // ...
    setTrailerData({
      ...trailerData,
      state: selectedValue,
    });
  };

  let valueStates = null;
  if (currentId === 0 && trailerData.state === "") {
    valueStates = { value: "", label: "Select State" }; // Set custom placeholder option
  } else {
    valueStates = {
      value: trailerData.state,
      label: trailerData.state,
    }; // Set custom placeholder option
  }
  // dropdown State

  const { loading, trailerDetail, Length } = useSelector(
    (state) => state.trailerReducer
  );
  const { loadingMapData, mapData } = useSelector(
    (state) => state.mapDataReducer
  );

  const [eventData, setEventData] = useState({
    status: "",
    comment: "",
    amount: "",
  });

  const clear = () => {
    setEventData({
      ...eventData,
      status: "",
      comment: "",
      amount: "",
    });
  };

  // const [errors, setErrors] = useState({});

  const handleStatusBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: "Status is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: null,
      }));
    }
  };

  const handleCommentBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        comment: "Comment is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        comment: null,
      }));
    }
  };

  const handleAmountBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        amount: "Amount is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        amount: null,
      }));
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((error) => error);
    if (!hasError) {
      dispatch(createEvent(id, eventData));
      clear();
    }
  };

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

  const handleDownloadT = () => {
    setPdfLoader(true);
    const input = document.getElementById("content-to-screenshot");

    html2canvas(input, { allowTaint: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // const imgWidth = 210; // Adjust as needed
      // const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("download.pdf");
      // let position = 0;
      // let remainingHeight = imgHeight;

      // while (remainingHeight > 0) {
      //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, 0);
      //   remainingHeight -= 297; // Adjust the page height (A4 size: 297mm)
      //   position -= 297; // Adjust the page height (A4 size: 297mm)

      //   if (remainingHeight > 0) {
      //     pdf.addPage();
      //   }
      // }

      // pdf.save(`${trailerDetail?.unitNumber}.pdf`);
      setPdfLoader(false);
    });
  };

  const handleDownload = () => {
    setPdfLoader(true);
    const input = document.getElementById("content-to-screenshot");

    html2canvas(input, { allowTaint: true, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // imgData.crossOrigin = "anonymous";
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

      pdf.save(`${trailerDetail?.unitNumber}.pdf`);
      setPdfLoader(false);
    });
  };

  const handleDownloadXLS = async (id) => {
    try {
      setPdfLoader(true);

      const { data } = await api.downloadXLSTrailer(id);
      const fileUrl = data.data;

      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.target = "_blank";
      link.download = `${trailerDetail?.unitNumber}.xls`;

      // Programmatically trigger the download
      link.click();
      setPdfLoader(false);

      toast("File downloaded successfully.");
    } catch (error) {
      setPdfLoader(false);
      toast("Error occurred during file download");
    }
  };

  const [reloadMap, setReloadMap] = useState(false); // State for triggering map reload
  const handleReloadMap = () => {
    setReloadMap(!reloadMap); // Toggle reloadMap state to trigger map reload
  };

  useEffect(() => {
    handleGetAddress(
      trailerDetail?.realTimeData?.FLatitude,
      trailerDetail?.realTimeData?.FLongitude
    );
  }, [trailerDetail]);

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

  const popupRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setErrors({});
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };
  const closePopupBlur = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleDateChangeModelYear = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setTrailerData({
        ...trailerData,
        modelYear: formattedDate,
      });
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      modelYear: null,
    }));
  };

  const openDatePickerModelYear = () => {
    if (ref2.current) {
      ref2.current.setOpen(true);
    }
  };

  const handleDateChangeRegistrationExpiry = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setTrailerData({
        ...trailerData,
        registrationExpiry: formattedDate,
      });
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      registrationExpiry: null,
    }));
  };

  const openDatePickerRegistrationExpiry = () => {
    if (ref.current) {
      ref.current.setOpen(true);
    }
  };

  const editHandler = async (e) => {
    e.preventDefault();

    setTrailerData({
      unitNumber: trailerDetail?.unitNumber,
      manufacturer: trailerDetail?.manufacturer,
      modelYear: trailerDetail?.modelYear.slice(0, 10),
      numberPlate: trailerDetail?.numberPlate,
      registrationExpiry: trailerDetail?.registrationExpiry.slice(0, 10),
      state: trailerDetail?.state,
      engineHours: trailerDetail?.engineHours,
      sensorId: trailerDetail?.sensorId,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const createTrailerSendData = {
      unitNumber: trailerData.unitNumber,
      manufacturer: trailerData.manufacturer,
      modelYear: trailerData.modelYear,
      numberPlate: trailerData.numberPlate,
      registrationExpiry: trailerData.registrationExpiry,
      state: trailerData.state,
      engineHours: Number(trailerData.engineHours),
      sensorId: trailerData.sensorId,
    };

    if (
      trailerData?.unitNumber === "" &&
      trailerData?.manufacturer === "" &&
      trailerData?.modelYear === null &&
      trailerData?.numberPlate === "" &&
      trailerData?.registrationExpiry === null &&
      trailerData?.state === "" &&
      trailerData?.engineHours === "" &&
      trailerData?.sensorId === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: "Unit number is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        manufacturer: "Manufacturer is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: "Model year is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: "Number Plate is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: "Registration expiry is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        engineHours: "Engine hours is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        sensorId: "Sensor id is required.",
      }));
    } else if (trailerData?.unitNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: "Unit number is required.",
      }));
    } else if (trailerData?.sensorId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sensorId: "Sensor id is required.",
      }));
    } else if (trailerData?.manufacturer === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        manufacturer: "Manufacturer is required.",
      }));
    } else if (trailerData?.modelYear === null) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: "Model year is required.",
      }));
    } else if (trailerData?.numberPlate === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: "Number Plate is required.",
      }));
    } else if (trailerData?.engineHours === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        engineHours: "Engine hours is required.",
      }));
    } else if (trailerData?.registrationExpiry === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: "Registration expiry is required.",
      }));
    } else if (trailerData?.state === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        manufacturer: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        engineHours: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        sensorId: null,
      }));
    }

    if (
      trailerData?.unitNumber !== "" &&
      trailerData?.manufacturer !== "" &&
      trailerData?.modelYear !== null &&
      trailerData?.numberPlate !== "" &&
      trailerData?.registrationExpiry !== null &&
      trailerData?.state !== "" &&
      trailerData?.engineHours !== "" &&
      trailerData?.sensorId !== ""
    ) {
      // Submit the form

      dispatch(updateTrailer(trailerDetail?._id, trailerData));

      clear();
      closePopup();
    }
  };

  // const imageUrl =
  //   "https://hefson.s3.ca-central-1.amazonaws.com/trailer/1692611577641-Group%201000008266%201.png%27";
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
      "trailerDetail?.manufactureInfo?.image -- ",
      trailerDetail?.manufactureInfo?.image
    );

    toDataURL(
      trailerDetail?.manufactureInfo?.image.substring(
        0,
        trailerDetail?.manufactureInfo?.image.indexOf(".png") + 4
      ),
      function (dataUrl) {
        setBase64Image(dataUrl);
        console.log("RESULT:", dataUrl);
      }
    );
    // toDataURL(
    //   "https://hefson.s3.ca-central-1.amazonaws.com/unit/1700225333066-strawberry.jpeg",
    //   function (dataUrl) {
    //     setBase64Image(dataUrl);
    //     console.log("RESULT:", dataUrl);
    //   }
    // );
  }, [trailerDetail]);

  return (
    <div className="trailerInfo" id="content-to-screenshot">
      <div className="container-fluid">
        <HeaderComponent titleProp={trailerDetail?.unitNumber} />
      </div>

      {loading ? (
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
      ) : Object.keys(trailerDetail || {}).length === 0 ? (
        <h4 className="mt-4 text-center">Data not found</h4>
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
                    <div className="text">
                      <p className="mb-0">
                        {/* {trailerDetail &&
                        trailerDetail?.realTimeData?.FLongitude &&
                        trailerDetail?.realTimeData?.FLatitude ? (
                          <GeocodingComponent
                            lat={trailerDetail?.realTimeData?.FLatitude}
                            lng={trailerDetail?.realTimeData?.FLongitude}
                          />
                        ) : (
                          <h4 className="text-center">
                            Coordinates not available
                          </h4>
                        )} */}
                        {address}
                      </p>
                    </div>
                  </div>
                  {trailerDetail &&
                  trailerDetail?.realTimeData?.FLatitude &&
                  trailerDetail?.realTimeData?.FLongitude &&
                  trailerDetail?.sensorData ? (
                    <div className="mapBox">
                      <div className="sideGradient"></div>
                      <div className="topGradient"></div>
                      <div className="rightGradient"></div>
                      <div className="bottomGradient"></div>
                      <div className="gpsButton" onClick={handleReloadMap}>
                        <i class="fa-solid fa-location-crosshairs"></i>
                      </div>
                      <ShipmentMapComponentTS
                        lat={trailerDetail?.realTimeData?.FLatitude}
                        lng={trailerDetail?.realTimeData?.FLongitude}
                        device={trailerDetail}
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
                                {trailerDetail?.realTimeData?.FBattery}%{" "}
                                <i class="fa-solid fa-bolt text-success"></i>
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
                          <h6>Humidity</h6>
                          <h2>
                            {trailerDetail?.realTimeData?.FDoor <= 0
                              ? 0
                              : trailerDetail?.realTimeData?.FDoor}
                          </h2>
                        </div>
                      </div>
                      <div className="col-sm-3 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Temp Alert</h6>
                          <h2>{trailerDetail?.realTimeData?.FHumidity1}%</h2>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-sm-5 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Hours</h6>
                          <div className="spaceAround">
                            <div>
                              <h2>
                                {parseFloat(trailerDetail?.engineHours).toFixed(
                                  0
                                )}
                              </h2>
                              <p>Total</p>
                            </div>
                            <div>
                              <h2>
                                {/* {parseFloat(
                                  trailerDetail?.leftDistancePercentage
                                ).toFixed(1)}
                                % */}
                                {parseFloat(
                                  trailerDetail?.currentHours
                                ).toFixed(0)}
                              </h2>
                              <p>Service</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-5 mt-3 mt-sm-0">
                        <div className="sensorDataBox">
                          <h6>Maintenance</h6>
                          <div className="spaceAround">
                            <div>
                              <h2>{trailerDetail?.timeline?.length}</h2>
                              <p>Total</p>
                            </div>
                            <div>
                              <h2>
                                $
                                {trailerDetail?.timeline?.reduce(
                                  (sum, item) => sum + item.amount,
                                  0
                                )}
                              </h2>
                              <p>Amount</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mt-4 mt-lg-0 centerMid ">
                  <div className="circularGraph">
                    <div
                      // className={
                      //   trailerDetail?.realTimeData?.FTemperature1 >
                      //     trailerDetail?.shipmentData?.temperature?.max ||
                      //   trailerDetail?.realTimeData?.FTemperature1 <
                      //     trailerDetail?.shipmentData?.temperature?.min
                      //     ? "temperatureRed"
                      //     : "temperature"
                      // }
                      className="temperature"
                    >
                      <ProgressTemp
                        value={trailerDetail?.realTimeData?.FTemperature1.toFixed(
                          1
                        )}
                        text={"Reefer"}
                      />
                      {/* <ProgressTempRed
                        value={trailerDetail?.realTimeData?.FTemperature1.toFixed(
                          1
                        )}
                        text={"Reefer"}
                        shipmentData={trailerDetail}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="trailerInfoBox">
                <div className="row align-items-center">
                  <div className="col-5 text-center">
                    {base64Image && <img src={base64Image} alt="converted" />}
                  </div>
                  <div className="col-7">
                    <h5>
                      Year -{" "}
                      <Moment format="YYYY">{trailerDetail?.modelYear}</Moment>
                    </h5>
                    <h6> Unit Number: {trailerDetail?.unitNumber}</h6>
                    <div className="unitNumber">
                      <div className="spaceBetween">
                        <h3 className="month">
                          <Moment format="MMM">
                            {trailerDetail?.registrationExpiry}
                          </Moment>
                        </h3>
                        <h3 className="city">{trailerDetail?.state}</h3>
                        <h3>
                          <Moment format="YYYY">
                            {trailerDetail?.registrationExpiry}
                          </Moment>
                        </h3>
                      </div>
                      <h2 className="mb-0">{trailerDetail?.numberPlate}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="deviceid mt-30">
                <div className="idNumber">
                  <p className="mb-0">
                    Device ID - {trailerDetail?.sensorData?.FAssetID}
                  </p>
                </div>
                {sensors.length !== 0 &&
                  trailerDetail &&
                  trailerDetail?.sensorData &&
                  trailerDetail?.sensorData?.FAssetID && (
                    <div
                      className="edit"
                      style={{ cursor: "pointer" }}
                      onClick={async (e) => {
                        await editHandler(e);
                        openPopup();
                      }}
                    >
                      <img src="../assets/icons/Edit.svg" alt="" />
                    </div>
                  )}
              </div>
              {trailerDetail?.activeShipment && (
                <div className="activeShipment mt-30">
                  <div className="spaceBetween">
                    <h4>Active Shipment </h4>
                    <div className="icon">
                      <Link
                        to={`/Shipment-moreinfo/${trailerDetail?.activeShipment?._id}`}
                      >
                        <img src="../assets/icons/rightArrow.svg" alt="" />
                      </Link>
                    </div>
                  </div>
                  <h3>{trailerDetail?.activeShipment?.loadId}</h3>
                  <div className="spaceBetween">
                    <div className="loc">
                      <img src="../assets/icons/LocationLight.svg" alt="" />
                      {`${
                        trailerDetail?.activeShipment?.shipper[0]?.pickupAddress.split(
                          ","
                        )[0]
                      }, ${
                        trailerDetail?.activeShipment?.shipper[0]?.pickupAddress.split(
                          ","
                        )[
                          trailerDetail?.activeShipment?.shipper[0]?.pickupAddress.split(
                            ","
                          ).length - 2
                        ]
                          ? trailerDetail?.activeShipment?.shipper[0]?.pickupAddress.split(
                              ","
                            )[
                              trailerDetail?.activeShipment?.shipper[0]?.pickupAddress.split(
                                ","
                              ).length - 2
                            ]
                          : ""
                      }`}
                    </div>
                    <div className="loc">
                      <img src="../assets/icons/LocationLight.svg" alt="" />

                      {`${
                        trailerDetail?.activeShipment?.receiver[0]?.deliveryAddress.split(
                          ","
                        )[0]
                      }, ${
                        trailerDetail?.activeShipment?.receiver[0]?.deliveryAddress.split(
                          ","
                        )[
                          trailerDetail?.activeShipment?.receiver[0]?.deliveryAddress.split(
                            ","
                          ).length - 2
                        ]
                          ? trailerDetail?.activeShipment?.receiver[0]?.deliveryAddress.split(
                              ","
                            )[
                              trailerDetail?.activeShipment?.receiver[0]?.deliveryAddress.split(
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
                        // style={{ width: "25%" }}
                        style={{
                          width: `${(
                            (parseInt(trailerDetail?.coveredHours).toFixed(0) /
                              trailerDetail?.activeShipment?.totalDistance.toFixed(
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
                        (parseInt(trailerDetail?.coveredHours).toFixed(0) /
                          trailerDetail?.activeShipment?.totalDistance.toFixed(
                            0
                          )) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                  </div>
                </div>
              )}
              <div className="informationAccordients mt-4">
                <div class="accordion" id="accordionExample">
                  <h5 className="p-3">Completed Shipment </h5>
                  {trailerDetail?.completeShipment?.map((data, index) => (
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
                  {/* <li class="nav-item">
                    <div
                      class="nav-link"
                      data-bs-toggle="tab"
                      href="#menu3"
                      onClick={() => {
                        if (trailerDetail && trailerDetail?.activeShipment) {
                          setCurrentId(trailerDetail?.activeShipment?._id);
                          setLatitudeShipper(
                            trailerDetail?.activeShipment?.shipper[0]?.latitude
                          );
                          setLongitudeShipper(
                            trailerDetail?.activeShipment?.shipper[0]?.longitude
                          );
                          setLatitudeReceiver(
                            trailerDetail?.activeShipment?.receiver[0]?.latitude
                          );
                          setLongitudeReceiver(
                            trailerDetail?.activeShipment?.receiver[0]
                              ?.longitude
                          );
                          setMarkerLat(trailerDetail?.realTimeData?.FLatitude);
                          setMarkerLng(trailerDetail?.realTimeData?.FLongitude);
                          setMarkerTemp(
                            trailerDetail?.realTimeData?.FTemperature1.toFixed(
                              1
                            )
                          );
                        }
                      }}
                    >
                      Trip Map
                    </div>
                  </li> */}
                </ul>
                {/* <div className="timeBox mt-3">
                  <h5 className="time">
                    <Moment format="HH:mm:ss">
                      {trailerDetail?.realTimeData?.FGPSTime}
                    </Moment>
                  </h5>
                  <p className="mb-0">
                    <Moment format="dddd D,YYYY">
                      {trailerDetail?.realTimeData?.FGPSTime}
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
                      onClick={() => handleDownloadXLS(trailerDetail?._id)}
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
                  <div class="tab-pane active py-3 w-100 mx-0" id="home">
                    <TempChartDetailSensor
                      historyData={mapData}
                      // pickup={trailerDetail?.activeShipment?.shipper[0]}
                      // delivery={trailerDetail?.activeShipment?.receiver[0]}
                      // temperature={trailerDetail?.temperature?.actual}
                    />
                  </div>
                  <div class="tab-pane fade py-3" id="menu1">
                    <TempHumiditySensor
                      historyData={mapData}
                      // pickup={trailerDetail?.activeShipment?.shipper[0]}
                      // delivery={trailerDetail?.activeShipment?.receiver[0]}
                      // temperature={trailerDetail?.temperature?.actual}
                    />
                  </div>
                  <div class="tab-pane fade py-3" id="menu2">
                    <BarCharts
                      historyData={mapData}
                      // pickup={trailerDetail?.activeShipment?.shipper[0]}
                      // delivery={trailerDetail?.activeShipment?.receiver[0]}
                      // temperature={trailerDetail?.temperature?.actual}
                    />
                  </div>

                  {trailerDetail &&
                  trailerDetail?.activeShipment &&
                  latitudeShipper &&
                  longitudeShipper &&
                  latitudeReceiver &&
                  longitudeReceiver &&
                  currentId &&
                  markerLat &&
                  markerLng &&
                  markerTemp ? (
                    <div className="tab-pane fade py-3" id="menu3">
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

          <div className="row mx-sm-4 mx-0 mt-4">
            <div className="col-12">
              <div className="graphContainer">
                <div className="graphBox">
                  <ProgressCircular
                    size={150}
                    width={3}
                    value={(trailerDetail?.currentHours / 4000) * 100}
                    color={
                      trailerDetail?.currentHours < 2500
                        ? "var(--success)"
                        : trailerDetail?.currentHours > 2500 &&
                          trailerDetail?.currentHours < 3000
                        ? "var(--warning)"
                        : trailerDetail?.currentHours > 3000
                        ? "var(--error)"
                        : "var(--error)"
                    }
                  />
                  <div className="textBox text-center">
                    <p className="mb-0">Trip</p>
                    <h2 className="mb-0">{trailerDetail?.currentHours}</h2>
                    <p className="mb-0">Hours</p>
                  </div>
                </div>
                <button
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#resetTripHour"
                >
                  Reset
                </button>
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
                <button
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#addEvent"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
          <div className="row mx-sm-4 mx-0 mt-4">
            <div className="col-12">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "20%" }}>
                      Status
                    </th>
                    <th scope="col" style={{ width: "20%" }}>
                      Time Stamp
                    </th>
                    <th scope="col" style={{ width: "50%" }}>
                      Comment
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trailerDetail?.timeline?.map((data, index) => (
                    <tr key={index}>
                      <th scope="row" className="flexBox">
                        <div className="greenIcon">
                          <i class="fa-solid fa-check"></i>
                          <div className="line"></div>
                        </div>
                        <span>{data?.status}</span>
                      </th>
                      <td>
                        <Moment format="hh:mm a - MMMM  D YYYY">
                          {data?.createTime}
                        </Moment>
                      </td>
                      <td>{data?.comments}</td>
                      <td>${data?.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {loginRole === 1 ? <ToolBoxAdmin /> : <ToolBox />}

      {/* Edit Trailer Popup  */}
      {isOpen && (
        <div className="popup-container" onClick={closePopupBlur}>
          <div className="popup" ref={popupRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Update Trailer
                </h5>

                <button
                  type="button"
                  className="btn-closed"
                  aria-label="Close"
                  onClick={() => {
                    clear();
                    closePopup();
                  }}
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
                        defaultValue={trailerData.unitNumber}
                        onChange={(e) => {
                          setTrailerData({
                            ...trailerData,
                            unitNumber: e.target.value,
                          });
                          handleUnitNumberBlur(e);
                        }}
                        onBlur={handleUnitNumberBlur}
                        required
                      />
                    </div>
                    {errors.unitNumber && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.unitNumber}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <Select
                        value={selectedOptionSensor || valueSensor}
                        onChange={handleChangeOptionsSensor}
                        options={sensors?.map((option) => ({
                          value: option,
                          label: option.FAssetID,
                        }))}
                        onBlur={handleSensorIdBlur}
                        placeholder="Sensor Id"
                      />
                    </div>
                    {errors.sensorId && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.sensorId}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <Select
                        value={selectedOption || value}
                        onChange={handleChangeOptions}
                        options={manufacture.map((option) => ({
                          value: option,
                          label: option.name,
                        }))}
                        placeholder="Manufacturer"
                      />
                    </div>
                    {errors.manufacturer && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.manufacturer}
                      </h6>
                    )}
                  </div>

                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <DatePicker
                        className="form-control"
                        selected={
                          trailerData.modelYear
                            ? new Date(trailerData.modelYear)
                            : null
                        }
                        onChange={handleDateChangeModelYear}
                        placeholderText="Model Year"
                        onFocus={() => {
                          if (ref2.current) {
                            ref2.current.input.readOnly = true;
                          }
                        }}
                        onBlur={() => {
                          if (ref2.current) {
                            ref2.current.input.readOnly = false;
                          }
                        }}
                        ref={ref2}
                        required
                      />

                      <img
                        src={CalenderIcon}
                        className="cal"
                        alt="Calendar Icon"
                        onClick={openDatePickerModelYear}
                      />
                    </div>
                    {errors.modelYear && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.modelYear}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Number Plate"
                        defaultValue={trailerData.numberPlate}
                        onChange={(e) => {
                          setTrailerData({
                            ...trailerData,
                            numberPlate: e.target.value,
                          });
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            numberPlate: null,
                          }));
                        }}
                        onBlur={(e) => handleNumberPlateBlur(e)}
                        required
                      />
                    </div>
                    {errors.numberPlate && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.numberPlate}
                      </h6>
                    )}
                  </div>

                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Engine Hours"
                        required
                        onBlur={(e) => handleEngineHoursBlur(e)}
                        defaultValue={trailerData.engineHours}
                        onChange={(e) => {
                          setTrailerData({
                            ...trailerData,
                            engineHours: e.target.value,
                          });
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            engineHours: null,
                          }));
                        }}
                      />
                    </div>
                    {errors.engineHours && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.engineHours}
                      </h6>
                    )}
                  </div>

                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <Select
                        value={selectedOptionStates || valueStates}
                        onChange={handleChangeOptionsState}
                        options={unitState?.flatMap((manu) =>
                          manu.states.map((state) => ({
                            value: state.name,
                            label: state.name,
                          }))
                        )}
                        placeholder="Select State"
                      />
                    </div>
                    {errors.state && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.state}
                      </h6>
                    )}
                  </div>

                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <DatePicker
                        className="form-control"
                        selected={
                          trailerData.registrationExpiry
                            ? new Date(trailerData.registrationExpiry)
                            : null
                        }
                        onChange={handleDateChangeRegistrationExpiry}
                        placeholderText="Registration Expiry Date"
                        onFocus={() => {
                          if (ref.current) {
                            ref.current.input.readOnly = true;
                          }
                        }}
                        onBlur={() => {
                          if (ref.current) {
                            ref.current.input.readOnly = false;
                          }
                        }}
                        ref={ref}
                        required
                      />

                      <img
                        src={CalenderIcon}
                        className="cal"
                        alt="Calendar Icon"
                        onClick={openDatePickerRegistrationExpiry}
                      />
                    </div>
                    {errors.registrationExpiry && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.registrationExpiry}
                      </h6>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="spaceBetween w-100">
                  <button
                    type="button"
                    className="btn btn-border"
                    onClick={() => {
                      clear();
                      closePopup();
                    }}
                  >
                    Back
                  </button>

                  <div>
                    <button
                      type="button"
                      className="btn"
                      onClick={(e) => {
                        submitHandler(e);
                      }}
                    >
                      Update Trailer
                    </button>
                  </div>
                </div>
                {/* <button type="button" className="btn">
                Save changes
              </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Popup  */}
      <div
        className="modal fade"
        id="addEvent"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addEvent">
                Add Event
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      value={eventData.status}
                      onChange={(e) => {
                        setEventData({
                          ...eventData,
                          status: e.target.value,
                        });
                        handleStatusBlur(e);
                      }}
                      onBlur={handleStatusBlur}
                      required
                    />
                  </div>
                  {errors.status && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.status}
                    </h6>
                  )}
                </div>

                <div className="col-12 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Amount"
                      value={eventData.amount}
                      onChange={(e) => {
                        setEventData({
                          ...eventData,
                          amount: e.target.value,
                        });
                        handleAmountBlur(e);
                      }}
                      onBlur={handleAmountBlur}
                      required
                    />
                  </div>
                  {errors.amount && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.amount}
                    </h6>
                  )}
                </div>
                <div className="col-12 mt-3">
                  <div className="inputField">
                    <textarea
                      name=""
                      id=""
                      rows="4"
                      className="form-control"
                      placeholder="Comments"
                      value={eventData.comment}
                      onChange={(e) => {
                        setEventData({
                          ...eventData,
                          comment: e.target.value,
                        });
                        handleCommentBlur(e);
                      }}
                      onBlur={handleCommentBlur}
                      required
                    ></textarea>
                  </div>
                  {errors.comment && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.comment}
                    </h6>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border me-3"
                data-bs-dismiss="modal"
              >
                BACK
              </button>

              <div data-bs-dismiss="modal">
                <button
                  type="button"
                  className="btn"
                  onClick={handleEventSubmit}
                >
                  ADD EVENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Reset Trip Hours Popup  */}
      <div
        className="modal fade"
        id="resetTripHour"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered sm-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addEvent">
                Reset Trip Hours
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <p>Please check the Engine hours manually and enter below.</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Engine Hours"
                      value={resetHours}
                      onChange={(e) => {
                        setResetHours(e.target.value);
                        handleResetHoursBlur(e);
                      }}
                      onBlur={handleResetHoursBlur}
                      required
                    />
                  </div>
                  {errors.resetHours && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.resetHours}
                    </h6>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border me-3"
                data-bs-dismiss="modal"
              >
                BACK
              </button>

              <div data-bs-dismiss="modal">
                <button
                  type="button"
                  className="btn"
                  onClick={(e) => resetSubmit(e, resetHours)}
                >
                  RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailersMoreInfo;

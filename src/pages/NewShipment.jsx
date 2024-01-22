import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTrailer, listTrailer } from "../actions/trailer";
import { createUnit, listTruck } from "../actions/truck";
import Select from "react-select";
import { createDriver, listDriver } from "../actions/driver";
import { createShipment } from "../actions/shipment";
import Autocomplete from "react-google-autocomplete";
// import PlacesAutocomplete from "react-places-autocomplete";
import { Link, useNavigate } from "react-router-dom";
import ToolBox from "./ToolBox";
import axios from "axios";
import { ClipLoader, PropagateLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CalenderIcon from "../assets/icons/CalendarDate.svg";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import TimePicker from "rc-time-picker";
import HeaderComponent from "../components/Header/HeaderComponent";
import { GoogleApiWrapper } from "google-maps-react";
const showSecond = false;
const str = showSecond ? "HH:mm:ss" : "HH:mm";

const baseURL = process.env.REACT_APP_BASEURL;

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const header = {
  headers: {
    Authorization: loginToken,
  },
};

let Index = 0;

const NewShipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [manufacture, setManufacture] = useState([]);
  const [unitState, setUnitState] = useState([]);
  const [manufactureTrailer, setManufactureTrailer] = useState([]);
  const [createShipmentLoading, setCreateShipmentLoading] = useState(false);
  const [sensors, setSensors] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (loginToken === null) {
      window.location.replace("/login");
    }
    if (Cookies.get("businessName")) {
      setShipmentData((prevState) => ({
        ...prevState,
        dispatchName: JSON.parse(Cookies.get("businessName")),
      }));
    }
    if (Cookies.get("phone")) {
      setShipmentData((prevState) => ({
        ...prevState,
        carrierPhone: JSON.parse(Cookies.get("phone")),
      }));
    }

    dispatch(listTruck(1, 100));
    dispatch(listTrailer(1, 100));
    dispatch(listDriver(1, 100, "createdAt", -1));

    setMfgData();
    setUnitStateData();

    setMfgDataTrailer();
    setSensorData();
  }, []);

  async function setSensorData() {
    const getSensor = await axios.get(
      `${baseURL}/device/list?limit=10&page=1`,
      header
    );
    if (getSensor?.data?.data?.data.length > 0 && sensors?.length === 0) {
      await setSensors(getSensor?.data?.data?.data);
    }
  }

  async function setMfgDataTrailer() {
    const getManufactur = await axios.get(
      `${baseURL}/manufacture/list?limit=10&page=1&type=2`,
      header
    );
    if (
      getManufactur?.data?.data?.data.length > 0 &&
      manufacture.length === 0
    ) {
      await setManufactureTrailer(getManufactur?.data?.data?.data);
    }
  }

  async function setMfgData() {
    const getManufactur = await axios.get(
      `${baseURL}/manufacture/list?limit=10&page=1`,
      header
    );
    if (
      getManufactur?.data?.data?.data.length > 0 &&
      manufacture.length === 0
    ) {
      await setManufacture(getManufactur?.data?.data?.data);
    }
  }

  async function setUnitStateData() {
    const states = await axios.get(
      `${baseURL}/states/list?limit=100&page=1`,
      header
    );
    if (states?.data?.data?.stateList.length > 0 && manufacture.length === 0) {
      await setUnitState(states?.data?.data?.stateList);
    }
  }

  const { unit } = useSelector((state) => state.truckReducer);
  const { trailer } = useSelector((state) => state.trailerReducer);
  const { driver } = useSelector((state) => state.driverReducer);
  const { loading } = useSelector((state) => state.shipmentReducer);

  console.log("shipment reducer loading - ", loading);

  console.log("Unit list =>  ", unit);
  console.log("trailer list =>  ", trailer);
  console.log("driver list =>  ", driver);

  const [customerData, setCustomerData] = useState({
    fullName: "",
    mobile: {
      code: "91",
      number: "",
    },
    address: "",
    email: "",
    licenseNo: "",
    licenseExp: "",
    issuedState: "",
    image: "",
  });

  const clearDriver = () => {
    setCustomerData({
      ...customerData,
      fullName: "",
      mobile: {
        code: "91",
        number: "",
      },
      address: "",
      email: "",
      licenseNo: "",
      licenseExp: "",
      issuedState: "",
      image: "",
    });

    setSelectedOption(null);
  };

  const addDriverHandler = (e) => {
    e.preventDefault();
    dispatch(createDriver(customerData));
    clearDriver();
    // const hasError = Object.values(errors).some((error) => error);
    // console.log("hasError => ", hasError);
    // if (!hasError) {
    //   if (currentId === 0) dispatch(createDriver(customerData));
    //   else {
    //     dispatch(updateDriver(currentId, customerUpdateData));
    //   }
    //   clear();
    // }
  };

  // dropdown manufacturer color

  const [uploading, setUploading] = useState(false);

  const uploadImageHandler = async (e) => {
    console.log("driver image upload");
    console.log(e.target);

    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("uploadImage", file);
    bodyFormData.append("folderName", "unit");
    setUploading(true);
    await axios
      .post(`${baseURL}/file/upload-image`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: loginToken,
        },
      })
      .then(async (response) => {
        console.log("response.data => ", response.data.data);
        await setCustomerData({
          ...customerData,
          image: response.data.data,
        });
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
    console.log("Driver data => ", customerData);
  };

  const handleFullNameBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Full name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: null,
      }));
    }
  };

  const handleMobileBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "Phone number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: null,
      }));
    }
  };

  const handleAddressBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: "Address is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: null,
      }));
    }
  };

  const handleEmailBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: null,
      }));
    }
  };

  const handleLicenseBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        licenseNo: "License no is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        licenseNo: null,
      }));
    }
  };

  const handleLicenseExpireBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        licenseExp: "License expire date is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        licenseExp: null,
      }));
    }
  };

  const handleImageBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Image is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: null,
      }));
    }
  };

  const [trailerData, setTrailerData] = useState({
    unitNumber: "",
    manufacturer: "",
    modelYear: "",
    numberPlate: "",
    registrationExpiry: "",
    state: "",
    engineHours: "",
    sensorId: "",
  });

  const clearTrailer = () => {
    console.log("clear trailer");
    setTrailerData({
      ...trailerData,
      unitNumber: "",
      manufacturer: "",
      modelYear: "",
      numberPlate: "",
      registrationExpiry: "",
      state: "",
      engineHours: 0,
      sensorId: "",
    });
    setSelectedOptionTrailer(null);
    setSelectedOptionSensor(null);
    setSelectedOptionStates(null);
  };

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
  };
  let valueSensor = null;
  if (trailerData.sensorId === "") {
    valueSensor = { value: "", label: "Sensor Id" }; // Set custom placeholder option
  } else if (trailerData.sensorId !== "") {
    valueSensor = {
      value: trailerData.sensorId,
      label: sensors?.find((em) => em._id === trailerData.sensorId).FAssetID,
    }; // Set custom placeholder option
  } else {
    valueSensor = sensors?.find(
      (option) => option.value === trailerData.sensorId
    );
  }
  //sensor dropdown

  // State/Provice

  // setting state dropdown trailer
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
  if (trailerData.state === "") {
    valueStates = { value: "", label: "Select State" }; // Set custom placeholder option
  } else if (trailerData.state != "") {
    valueStates = {
      value: trailerData.state,
      label: trailerData.state,
    }; // Set custom placeholder option
  } else {
    valueStates = unitState.find(
      (option) => option.value === trailerData.state
    );
  }
  // dropdown State trailer

  const [unitData, setUnitData] = useState({
    unitNumber: "",
    manufacture: "",
    modelYear: "",
    truckColor: "",
    numberPlate: "",
    registrationExpiry: "",
    state: "",
  });

  const clearUnit = () => {
    // setCurrentId(0);
    setUnitData({
      ...unitData,
      unitNumber: "",
      manufacture: "",
      modelYear: "",
      truckColor: "",
      numberPlate: "",
      registrationExpiry: "",
      state: "",
    });
    setSelectedOption(null);
    setSelectedOptionColor(null);
  };

  // setting manufacturer for dropdown for trailer
  const [selectedOptionTrailer, setSelectedOptionTrailer] = useState(null);

  const handleChangeOptionsTrailer = (selectedOption) => {
    setSelectedOptionTrailer(selectedOption);
    // Access the selected value using selectedOption.value._id
    const selectedValue = selectedOption ? selectedOption.value._id : "";
    // ...
    setTrailerData({
      ...trailerData,
      manufacturer: selectedValue,
    });
  };
  let valueTrailers = null;
  if (trailerData.manufacturer === "") {
    valueTrailers = { value: "", label: "Manufacturer" }; // Set custom placeholder option
  } else if (trailerData.manufacturer !== "") {
    valueTrailers = {
      value: trailerData.manufacturer,
      label: manufactureTrailer.find(
        (em) => em._id === trailerData.manufacturer
      ).name,
    }; // Set custom placeholder option
  } else {
    valueTrailers = manufactureTrailer.find(
      (option) => option.value === trailerData.manufacturer
    );
  }
  // dropdown manufacturer for trailer

  // setting manufacturer for dropdown
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChangeOptions = (selectedOption) => {
    setSelectedOption(selectedOption);
    // Access the selected value using selectedOption.value._id
    const selectedValue = selectedOption ? selectedOption.value._id : "";
    // ...
    setUnitData({
      ...unitData,
      manufacture: selectedValue,
    });
  };
  let value = null;
  if (unitData.manufacture === "") {
    value = { value: "", label: "Manufacturer" }; // Set custom placeholder option
  } else if (unitData.manufacture != "") {
    value = {
      value: unitData.manufacture,
      label: manufacture.find((em) => em._id === unitData.manufacture).name,
    }; // Set custom placeholder option
  } else {
    value = manufacture.find((option) => option.value === unitData.manufacture);
  }
  // dropdown manufacturer

  // setting manufacturer for color dropdown
  const [selectedOptionColor, setSelectedOptionColor] = useState(null);

  const handleChangeOptionsColor = (selectedOptionColor) => {
    setSelectedOptionColor(selectedOptionColor);
    // Access the selected value using selectedOptionColor.value._id
    const selectedValue = selectedOptionColor
      ? selectedOptionColor.value._id
      : "";
    // ...
    setUnitData({
      ...unitData,
      truckColor: selectedValue,
    });
  };
  let valueColor = null;
  if (unitData.manufacture === "") {
    valueColor = { value: "", label: "Unit Color" }; // Set custom placeholder option
  } else if (unitData.manufacture != "") {
    valueColor = {
      value: unitData.truckColor,
      label: manufacture
        .map((option) =>
          option.feature.find((feature) => feature._id === unitData.truckColor)
        )
        .filter(Boolean)
        .map((feature) => feature.color)[0],
    }; // Set custom placeholder option
  } else {
    valueColor = manufacture.find(
      (option) => option.value === unitData.truckColor
    );
  }
  // dropdown manufacturer color

  // State/Province

  // setting manufacturer for color dropdown
  const [selectedOptionState, setSelectedOptionState] = useState(null);

  const handleChangeOptionsState = (selectedOptionState) => {
    setSelectedOptionState(selectedOptionState);
    // Access the selected value using selectedOptionState.value._id
    const selectedValue = selectedOptionState ? selectedOptionState.value : "";
    // ...
    setUnitData({
      ...unitData,
      state: selectedValue,
    });
  };

  let valueState = null;
  if (unitData.state === "") {
    valueState = { value: "", label: "State/Provice" }; // Set custom placeholder option
  } else if (unitData.state != "") {
    valueState = {
      value: unitData.state,
      label: unitData.state,
    }; // Set custom placeholder option
  } else {
    valueState = unitState.find((option) => option.value === unitData.state);
  }
  // dropdown manufacturer color

  const [errors, setErrors] = useState({
    shipper: [],
    receiver: [],
  });
  const [shipmentData, setShipmentData] = useState({
    truckId: Cookies.get("truckId") ? JSON.parse(Cookies.get("truckId")) : "",
    trailerId: Cookies.get("trailerId")
      ? JSON.parse(Cookies.get("trailerId"))
      : "",
    isDefaultTruck: true,
    isDefaultTrailer: true,
    driverId: Cookies.get("driverId")
      ? JSON.parse(Cookies.get("driverId"))
      : "",
    isDefaultDriver: true,
    shipper: Cookies.get("shipper")
      ? JSON.parse(Cookies.get("shipper"))
      : [
          {
            pickupName: "",
            pickupAddress: "",
            latitude: 0,
            longitude: 0,
            pickupDate: null,
            pickupTime: "",
            poNumber: "",
          },
        ],
    receiver: Cookies.get("receiver")
      ? JSON.parse(Cookies.get("receiver"))
      : [
          {
            deliveryName: "",
            deliveryAddress: "",
            latitude: 0,
            longitude: 0,
            deliveryDate: null,
            deliveryTime: "",
            deliveryNumber: "",
          },
        ],

    temperature: {
      actual: Cookies.get("actual") ? JSON.parse(Cookies.get("actual")) : "",
      min: Cookies.get("min") ? JSON.parse(Cookies.get("min")) : "",
      max: Cookies.get("max") ? JSON.parse(Cookies.get("max")) : "",
    },
    referenceNumber: Cookies.get("referenceNumber")
      ? JSON.parse(Cookies.get("referenceNumber"))
      : "",
    comment: Cookies.get("comment") ? JSON.parse(Cookies.get("comment")) : "",
    broker: {
      name: Cookies.get("name") ? JSON.parse(Cookies.get("name")) : "",
      brokerAgent: Cookies.get("brokerAgent")
        ? JSON.parse(Cookies.get("brokerAgent"))
        : "",
      brokerPhone: Cookies.get("brokerPhone")
        ? JSON.parse(Cookies.get("brokerPhone"))
        : "",
      brokerhefsonId: Cookies.get("brokerhefsonId")
        ? JSON.parse(Cookies.get("brokerhefsonId"))
        : "",
    },
    dispatchName: Cookies.get("dispatchName")
      ? JSON.parse(Cookies.get("dispatchName"))
      : "",
    carrierPhone: Cookies.get("carrierPhone")
      ? JSON.parse(Cookies.get("carrierPhone"))
      : "",
    carrierEmergencyPhone: Cookies.get("carrierEmergencyPhone")
      ? JSON.parse(Cookies.get("carrierEmergencyPhone"))
      : "",
  });

  // this useEffect is for seting the value of shipper array when shipmentData?.shipper changes
  useEffect(() => {
    Cookies.set("shipper", JSON.stringify(shipmentData?.shipper));
  }, [shipmentData?.shipper]);

  useEffect(() => {
    Cookies.set("receiver", JSON.stringify(shipmentData?.receiver));
  }, [shipmentData?.receiver]);

  if (Cookies.get("receiver")) {
    console.log("Cookie receiver - ", JSON.parse(Cookies.get("receiver")));
  }
  // const [submitDisable, setSubmitDisable] = useState(false);

  const ref = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef();
  const ref9 = useRef();

  const [selectedTime, setSelectedTime] = useState(""); // State to store the selected time

  const handleTimeChange = (time, index) => {
    if (time && time.isValid()) {
      // Check if the time is valid
      const formattedTime = time.format("HH:mm"); // Convert the moment object to "HH:mm" format

      setSelectedTime(formattedTime); // Update the selected time in state
      setShipmentData((prevState) => {
        const updatedShippers = [...prevState.shipper];
        updatedShippers[index].pickupTime = formattedTime; // Set the selected time in shipmentData
        return {
          ...prevState,
          shipper: updatedShippers,
        };
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        shipper: (prevErrors.shipper || []).map((err, i) =>
          i === index ? { ...err, pickupTime: null } : err
        ),
      }));
    } else {
      // Handle invalid time (e.g., clear the value)
      setSelectedTime(""); // Update the selected time in state
      setShipmentData((prevState) => {
        const updatedShippers = [...prevState.shipper];
        updatedShippers[index].pickupTime = ""; // Clear the pickupTime in shipmentData
        return {
          ...prevState,
          shipper: updatedShippers,
        };
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        shipper: (prevErrors.shipper || []).map((err, i) =>
          i === index ? { ...err, pickupTime: "Invalid time" } : err
        ),
      }));
    }
  };

  const handleTimeChangeReceiver = (time, index) => {
    if (time && time.isValid()) {
      // Check if the time is valid
      const formattedTime = time.format("HH:mm"); // Convert the moment object to "HH:mm" format

      setSelectedTime(formattedTime); // Update the selected time in state
      setShipmentData((prevState) => {
        const updatedReceiver = [...prevState.receiver];
        updatedReceiver[index].deliveryTime = formattedTime; // Set the selected time in shipmentData
        return {
          ...prevState,
          receiver: updatedReceiver,
        };
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        receiver: (prevErrors.receiver || []).map((err, i) =>
          i === index ? { ...err, deliveryTime: null } : err
        ),
      }));
    } else {
      // Handle invalid time (e.g., clear the value)
      setSelectedTime(""); // Update the selected time in state
      setShipmentData((prevState) => {
        const updatedReceiver = [...prevState.receiver];
        updatedReceiver[index].deliveryTime = ""; // Clear the deliveryTime in shipmentData
        return {
          ...prevState,
          receiver: updatedReceiver,
        };
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        receiver: (prevErrors.receiver || []).map((err, i) =>
          i === index ? { ...err, deliveryTime: "Invalid time" } : err
        ),
      }));
    }
  };

  const handleDateChangePickupDate = (date, index) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");

      setShipmentData((prevState) => {
        const updatedShippers = [...prevState.shipper];
        updatedShippers[index].pickupDate = formattedDate;
        return {
          ...prevState,
          shipper: updatedShippers,
        };
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        shipper: (prevErrors.shipper || []).map((err, i) =>
          i === index ? { ...err, pickupDate: null } : err
        ),
      }));
    }
  };

  const openDatePickerPickupDate = () => {
    if (ref6.current) {
      ref6.current.setOpen(true);
    }
  };

  const handleDateChangeDeliveryDate = (date, index) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");

      setShipmentData((prevState) => {
        const updatedShippers = [...prevState.receiver];
        updatedShippers[index].deliveryDate = formattedDate;
        return {
          ...prevState,
          receiver: updatedShippers,
        };
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        receiver: (prevErrors.receiver || []).map((err, i) =>
          i === index ? { ...err, deliveryDate: null } : err
        ),
      }));
    }
  };

  const openDatePickerDeliveryDate = () => {
    if (ref8.current) {
      ref8.current.setOpen(true);
    }
  };

  console.log("Danger  --- ", shipmentData);

  const [currentStep, setCurrentStep] = useState(1);

  // setting Trucks for dropdown
  const [selectedTruckOption, setSelectedTruckOption] = useState(null);

  const handleChangeTruckOptions = (selectedTruckOption) => {
    setSelectedTruckOption(selectedTruckOption);
    // Access the selected value using selectedTruckOption.value._id
    const selectedValue = selectedTruckOption
      ? selectedTruckOption?.value?._id
      : "";
    // ... define state variable to set value for this page
    console.log("Selected value => ", selectedTruckOption);
    setShipmentData({
      ...shipmentData,
      truckId: selectedValue,
    });
    if (errors !== undefined)
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: null,
      }));
  };
  let valueTruck;

  if (shipmentData?.truckId === "") {
    valueTruck = { value: "", label: "Unit Number" }; // Set custom placeholder option
  } else if (shipmentData?.truckId !== "" && unit && unit.length !== 0) {
    const selectedUnit = unit.find((em) => em._id === shipmentData?.truckId);
    valueTruck = {
      value: selectedUnit,
      label: selectedUnit?.unitNumber,
    };

    console.log("value Truck ", valueTruck);
    console.log("selectedUnit", selectedUnit);
  } else {
    valueTruck = unit.find((option) => option.value === shipmentData?.truckId);
  }

  console.log("valueTruck", valueTruck);

  // dropdown Trucks

  // setting Trailer for dropdown
  const [selectedTrailerOption, setSelectedTrailerOption] = useState(null);

  const handleChangeTrailerOptions = (selectedTrailerOption) => {
    setSelectedTrailerOption(selectedTrailerOption);
    // Access the selected value using selectedTrailerOption.value._id
    const selectedValue = selectedTrailerOption
      ? selectedTrailerOption?.value?._id
      : "";
    // ... define state variable to set value for this page
    console.log("Selected value => ", selectedTrailerOption?.value?._id);
    setShipmentData({
      ...shipmentData,
      trailerId: selectedValue,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      trailerId: null,
    }));
  };
  let valueTrailer = null;
  if (shipmentData?.trailerId === "") {
    valueTrailer = { value: "", label: "Trailer Number" }; // Set custom placeholder option
  } else if (
    shipmentData?.trailerId !== "" &&
    trailer &&
    trailer.length !== 0
  ) {
    let selectedTrailer = trailer.find(
      (em) => em._id === shipmentData?.trailerId
    );
    valueTrailer = {
      value: selectedTrailer,
      label: selectedTrailer?.unitNumber,
    }; // Set custom placeholder option
  } else {
    valueTrailer = trailer.find(
      (option) => option.value === shipmentData?.trailerId
    );
  }
  // dropdown Trailer

  // setting Drivers for dropdown
  const [selectedDriverOption, setSelectedDriverOption] = useState(null);

  const handleChangeDriverOptions = (selectedDriverOption) => {
    setSelectedDriverOption(selectedDriverOption);
    // Access the selected value using selectedDriverOption.value._id
    const selectedValue = selectedDriverOption
      ? selectedDriverOption?.value?._id
      : "";
    // ... define state variable to set value for this page
    console.log("Selected value => ", selectedDriverOption?.value?._id);
    setShipmentData({
      ...shipmentData,
      driverId: selectedValue,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      driverId: null,
    }));
  };
  let valueDriver = null;
  if (shipmentData?.driverId === "") {
    valueDriver = { value: "", label: "Driver Name" }; // Set custom placeholder option
  } else if (shipmentData?.driverId !== "" && driver.length !== 0) {
    console.log("shipmentData?.driverId -- ", shipmentData?.driverId);
    console.log("driver -- ", driver);
    // console.log(
    //   'value: driver.find((em) => em._id === shipmentData?.driverId) = ',
    //   driver.find((em) => em._id === shipmentData?.driverId)
    // );
    console.log(
      "driver.find((em) => em._id === shipmentData?.driverId)?.fullName => ",
      driver.find((em) => em._id === shipmentData?.driverId)
    );
    valueDriver = {
      value: driver.find((em) => em._id === shipmentData?.driverId),
      label: driver.find((em) => em._id === shipmentData?.driverId)?.fullName,
    };
  } else {
    valueDriver = driver.find(
      (option) => option.value === shipmentData?.driverId
    );
  }
  // dropdown Drivers

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
  const validateNumberField = (myNumber) => {
    const numberRegEx = /\-?\d*\.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
  };

  const handleModelYearBlur = (e) => {
    const value = e.target.value.trim();
    const currentDate = new Date().toISOString().slice(0, 10);
    const parts = currentDate.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: "Model year is required.",
      }));
    } else if (value >= new Date().toISOString().slice(0, 10)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: "Model year should not be greater than today .",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: null,
      }));
    }
  };

  const handleNumberPlateBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: "Number plate is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: null,
      }));
    }
  };

  const handleRegistrationExpiryBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: "Registration expiry date is required.",
      }));
    } else if (unitData.modelYear >= value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry:
          "Registration expiry date should be greater than model year .",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: null,
      }));
    }
  };

  const addUnitHandler = (e) => {
    e.preventDefault();
    console.log("adding");
    dispatch(createUnit(unitData));

    // const hasError = Object.values(errors).some((error) => error);
    // if (!hasError) {
    //   // Submit the form
    //   dispatch(createUnit(unitData));

    //   clearUnit();
    // }
  };

  const addTrailerHandler = (e) => {
    e.preventDefault();
    const createTrailerSendData = {
      unitNumber: trailerData.unitNumber,
      manufacturer: trailerData.manufacturer,
      modelYear: trailerData.modelYear,
      numberPlate: trailerData.numberPlate,
      registrationExpiry: trailerData.registrationExpiry,
      state: trailerData.state,
      engineHours: trailerData.engineHours,
      sensorId: trailerData.sensorId,
    };
    dispatch(createTrailer(createTrailerSendData));

    clearTrailer();
    // const hasError = Object.values(errors).some((error) => error);
    // if (!hasError) {
    //   if (currentId === 0) dispatch(createTrailer(createTrailerSendData));
    //   else {
    //     dispatch(updateTrailer(currentId, trailerData));
    //   }
    //   clear();
    // }
  };

  console.log("shipment data => ", shipmentData);

  // validation

  const handleUnitNumberBlur = (e) => {
    const value = shipmentData?.truckId;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: "Unit number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: null,
      }));
    }
  };

  const handleTrailerNumberBlur = (e) => {
    const value = shipmentData?.trailerId;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        trailerId: "Trailer number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        trailerId: null,
      }));
    }
  };

  const handleDriverNameBlur = (e) => {
    const value = shipmentData?.driverId;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        driverId: "Driver Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        driverId: null,
      }));
    }
  };

  const handlePickupNameBlur = (index) => {
    if (shipmentData?.shipper[index]?.pickupName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupName: "Pickup name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupName: null,
      }));
    }
  };

  // const handlePickupNameBlur = (e) => {
  //   const { name, value } = e.target;
  //   if (value.trim() === "") {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       shipper: [
  //         ...prevErrors.shipper,
  //         {
  //           [name]: "Pickup name is required.",
  //         },
  //       ],
  //     }));
  //   } else {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       shipper: [
  //         ...prevErrors.shipper,
  //         {
  //           [name]: "",
  //         },
  //       ],
  //     }));
  //   }
  // };

  const handlePickupAddressBlur = (index) => {
    if (shipmentData?.shipper[index]?.pickupAddress.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupAddress: "Pickup address is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupAddress: "",
      }));
    }
  };

  const handleAutocompleteError = (error) => {
    console.error("Autocomplete error:", error);
    // Handle the error and display an appropriate message to the user
  };

  const handlePickupDateBlur = (index) => {
    if (shipmentData?.shipper[index]?.pickupDate.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupDate: "Pick Up Date is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupDate: "",
      }));
    }
  };

  // const handlePickupDateBlur = (index) => {
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     shipper: [
  //       ...prevErrors.shipper?.slice(0, index),
  //       {
  //         ...prevErrors.shipper[index],
  //         pickupDate: null,
  //       },
  //       ...prevErrors.shipper?.slice(index + 1),
  //     ],
  //   }));
  // };

  const handlePickupTimeBlur = (index) => {
    if (shipmentData?.shipper[index]?.pickupTime.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupTime: "Pick Up Time is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupTime: "",
      }));
    }
  };

  //make string validation
  const handlePoNumberBlur = (index) => {
    // if (shipmentData?.shipper[index]?.poNumber === "") {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     poNumber: "PO Number is required.",
    //   }));
    // } else {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     poNumber: "",
    //   }));
    // }
    console.log("shipper errors -- ", errors);

    if (shipmentData?.shipper[index]?.poNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: "PO Number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: "",
      }));
    }

    // if (shipmentData?.shipper[index]?.pickupName.trim() === "") {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     pickupName: "Pickup name is required.",
    //   }));
    // } else {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     pickupName: null,
    //   }));
    // }
  };

  const handleDeliveryNameBlur = (index) => {
    if (shipmentData?.receiver[index]?.deliveryName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryName: "Delivery Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryName: null,
      }));
    }
  };

  const handleDeliveryAddressBlur = (index) => {
    if (shipmentData?.receiver[index]?.deliveryAddress.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryAddress: "Delivery Address is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryAddress: "",
      }));
    }
  };

  const handleDeliveryDateBlur = (index) => {
    if (shipmentData?.receiver[index]?.deliveryDate.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryDate: "Delivery Date is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryDate: "",
      }));
    }
  };

  const handleDeliveryTimeBlur = (index) => {
    if (shipmentData?.receiver[index]?.deliveryTime.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: "Delivery Date is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: "",
      }));
    }
  };

  const handleDeliveryNumberBlur = (index) => {
    if (shipmentData?.receiver[index]?.deliveryNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: "Delivery Number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: "",
      }));
    }
  };

  const handleRequiredTempBlur = () => {
    if (shipmentData?.temperature.actual.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureActual: "Temperature is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureActual: "",
      }));
    }
  };

  const handleRequiredMinTempBlur = () => {
    if (shipmentData?.temperature.min.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMin: "Min Temperature is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMin: "",
      }));
    }
  };

  const handleRequiredMaxTempBlur = () => {
    if (shipmentData?.temperature.max.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMax: "Max Temperature is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMax: "",
      }));
    }
  };

  const handleReferenceNumberBlur = () => {
    if (shipmentData?.referenceNumber.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceNumber: "Reference Number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceNumber: null,
      }));
    }
  };

  const handleCommentTempBlur = () => {
    if (shipmentData?.comment.trim() === "") {
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

  const handleBrokerNameBlur = () => {
    if (shipmentData?.broker.name.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerName: "Broker name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerName: "",
      }));
    }
  };

  const handleBrokerAgentBlur = () => {
    if (shipmentData?.broker.brokerAgent.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerAgent: "Broker agent is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerAgent: "",
      }));
    }
  };

  const handleBrokerPhoneBlur = () => {
    const value = shipmentData?.broker.brokerPhone.trim();

    if (value.length === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: "Broker phone is required.",
      }));
    } else if (!/^\d{1,10}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone:
          "Broker phone must be a number with a maximum of 10 digits.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: null,
      }));
    }
  };

  const handleBrokerhefsonIdBlur = () => {
    if (shipmentData?.broker.brokerhefsonId.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerhefsonId: "Broker hefsonId is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerhefsonId: "",
      }));
    }
  };

  const handleDispatchNameBlur = () => {
    if (shipmentData?.dispatchName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dispatchName: "Dispatch name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dispatchName: "",
      }));
    }
  };

  const handleCarrierPhoneBlur = (e) => {
    const carrierPhone = e.target.value;
    if (carrierPhone === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierPhone: "Carrier phone is required.",
      }));
    } else if (!/^-?\d*\.?\d+$/.test(carrierPhone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierPhone: "Carrier Phone must be a valid number.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierPhone: "",
      }));
    }
  };

  const handleCarrierEmergencyPhoneBlur = (e) => {
    const carrierEmergencyPhone = e.target.value;

    if (carrierEmergencyPhone === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierEmergencyPhone: "Carrier Emergency Phone Number is required.",
      }));
    } else if (!/^-?\d*\.?\d+$/.test(carrierEmergencyPhone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierEmergencyPhone:
          "Carrier Emergency Phone Number must be a valid number.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierEmergencyPhone: "",
      }));
    }
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  const firstStepNext = (e) => {
    e.preventDefault();

    if (shipmentData?.truckId === "" && shipmentData?.trailerId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: "Unit number is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        trailerId: "Trailer Number is required.",
      }));
    } else if (shipmentData?.truckId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: "Unit number is required.",
      }));
    } else if (shipmentData?.trailerId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        trailerId: "trailerId is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        trailerId: null,
      }));
    }
    if (shipmentData?.truckId !== "" && shipmentData?.trailerId !== "") {
      setCurrentStep(currentStep + 1);
      Cookies.set("truckId", JSON.stringify(shipmentData?.truckId));
      Cookies.set("trailerId", JSON.stringify(shipmentData?.trailerId));
    }
  };

  // google place api

  const [selectedPlace, setSelectedPlace] = useState(null);
  const handlePlaceSelected = (index, place) => {
    setSelectedPlace({
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });

    setShipmentData((prevState) => {
      const updatedShippers = [...prevState.shipper];
      if (updatedShippers[index]) {
        updatedShippers[index].pickupAddress = place.formatted_address;
        updatedShippers[index].latitude = place.geometry.location.lat();
        updatedShippers[index].longitude = place.geometry.location.lng();
      }
      return { ...prevState, shipper: updatedShippers };
    });

    Cookies.set(
      "latitudeShipper",
      JSON.stringify(place.geometry.location.lat())
    );
    Cookies.set(
      "longitudeShipper",
      JSON.stringify(place.geometry.location.lng())
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      pickupAddress: null,
    }));
  };

  const [selectedPlaceDelivery, setSelectedPlaceDelivery] = useState(null);

  const handlePlaceSelectedDelivery = (index, place) => {
    setSelectedPlaceDelivery({
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });

    setShipmentData((prevState) => {
      const updatedShippers = [...prevState.receiver];
      updatedShippers[index].deliveryAddress = place.formatted_address;
      updatedShippers[index].latitude = place.geometry.location.lat();
      updatedShippers[index].longitude = place.geometry.location.lng();

      return { ...prevState, receiver: updatedShippers };
    });

    Cookies.set(
      "latitudeReceiver",
      JSON.stringify(place.geometry.location.lat())
    );
    Cookies.set(
      "longitudeReceiver",
      JSON.stringify(place.geometry.location.lng())
    );

    setErrors((prevErrors) => ({
      ...prevErrors,
      deliveryAddress: null,
    }));
  };

  const secondStepNext = (e) => {
    e.preventDefault();
    if (shipmentData?.driverId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        driverId: "Driver name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        driverId: null,
      }));
    }
    if (shipmentData?.driverId !== "") {
      setCurrentStep(currentStep + 1);
      Cookies.set("driverId", JSON.stringify(shipmentData?.driverId));
    }
  };

  const thirdStepNext = (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((error) => error);

    let shipperValidation = Cookies.get("shipper")
      ? JSON.parse(Cookies.get("shipper"))
      : [
          {
            pickupName: "",
            pickupAddress: "",
            latitude: 0,
            longitude: 0,
            pickupDate: null,
            pickupTime: "",
            poNumber: 0,
          },
        ];
    console.log("shipperValidation --  ", shipperValidation);

    const findEmptyFieldWithId = (shipperArray) => {
      for (const [index, shipper] of shipperArray.entries()) {
        for (const [field, value] of Object.entries(shipper)) {
          if (value === "" || value === null) {
            return { field, id: index }; // Return the field and its associated "id"
          }
        }
      }
      return null; // Return null if no empty field is found
    };

    const emptyFieldInfo = findEmptyFieldWithId(shipperValidation);
    console.log("emptyFieldInfo -- ", emptyFieldInfo);

    // -------------

    let receiverValidation = Cookies.get("receiver")
      ? JSON.parse(Cookies.get("receiver"))
      : [
          {
            deliveryName: "",
            deliveryAddress: "",
            latitude: 0,
            longitude: 0,
            deliveryDate: null,
            deliveryTime: "",
            deliveryNumber: "",
          },
        ];
    console.log("receiverValidation --  ", receiverValidation);

    const findReceiverEmptyFieldWithId = (receiverArray) => {
      for (const [index, receiver] of receiverArray.entries()) {
        for (const [field, value] of Object.entries(receiver)) {
          if (value === "" || value === null) {
            return { field, id: index }; // Return the field and its associated "id"
          }
        }
      }
      return null; // Return null if no empty field is found
    };

    const emptyFieldInfoReceiver =
      findReceiverEmptyFieldWithId(receiverValidation);
    console.log("emptyFieldInfo -- ", emptyFieldInfo);

    // ----------------------
    if (emptyFieldInfo) {
      const { field, id } = emptyFieldInfo;

      Index = id;
      console.log(`The field "${field}" with id "${id}" has an empty value.`);

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${field} is required.`,
      }));
      console.log(errors, "ty");
    } else if (emptyFieldInfoReceiver) {
      const { field, id } = emptyFieldInfoReceiver;

      Index = id;
      console.log(`The field "${field}" with id "${id}" has an empty value.`);

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${field} is required.`,
      }));
      console.log(errors, "rty");
    } else if (
      shipmentData?.temperature.actual === "" &&
      shipmentData?.temperature.min === "" &&
      shipmentData?.temperature.max === "" &&
      shipmentData?.referenceNumber === "" &&
      shipmentData?.comment === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        comment: "Comment is required",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceNumber: "Reference Number is required",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMax: "Max temperature is required",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMin: "Min temperature is required",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureActual: "Actual temperature is required",
      }));
    } else if (shipmentData?.temperature.actual === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureActual: "Actual temperature is required",
      }));
    } else if (shipmentData?.temperature.min === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMin: "Min temperature is required",
      }));
    } else if (shipmentData?.temperature.max === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMax: "Max temperature is required",
      }));
    } else if (shipmentData?.referenceNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceNumber: "Reference Number is required",
      }));
    } else if (shipmentData?.comment === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        comment: "Comment is required",
      }));
    } else if (
      shipmentData?.temperature.actual !== "" &&
      shipmentData?.temperature.min !== "" &&
      shipmentData?.temperature.max !== "" &&
      shipmentData?.referenceNumber !== "" &&
      shipmentData?.comment !== ""
      // &&      errors.shipper.length === 0 &&
      // errors.receiver.length === 0
    ) {
      console.log("!hasError  - ", !hasError);
      console.log("errors - ", errors);
      setCurrentStep(currentStep + 1);

      Cookies.set("actual", JSON.stringify(shipmentData?.temperature.actual));
      Cookies.set("min", JSON.stringify(shipmentData?.temperature.min));
      Cookies.set("max", JSON.stringify(shipmentData?.temperature.max));
      Cookies.set(
        "referenceNumber",
        JSON.stringify(shipmentData?.referenceNumber)
      );
      Cookies.set("comment", JSON.stringify(shipmentData?.comment));
    }
  };

  const forthStepNext = (e) => {
    e.preventDefault();

    if (
      shipmentData?.broker.name === "" &&
      shipmentData?.broker.brokerAgent === "" &&
      shipmentData?.broker.brokerPhone === "" &&
      shipmentData?.broker.brokerhefsonId === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerName: "Broker name is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerAgent: "Broker agent is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: "Broker phone is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerhefsonId: "Broker hefsonId is required.",
      }));
    } else if (shipmentData?.broker.name === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerName: "Broker name is required.",
      }));
    } else if (shipmentData?.broker.brokerAgent === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerAgent: "Broker agent is required.",
      }));
    } else if (shipmentData?.broker.brokerPhone === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: "Broker phone is required.",
      }));
    } else if (shipmentData?.broker.brokerhefsonId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerhefsonId: "Broker hefsonId is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerName: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerAgent: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerhefsonId: null,
      }));
    }
    if (
      shipmentData?.broker.name !== "" &&
      shipmentData?.broker.brokerAgent !== "" &&
      shipmentData?.broker.brokerPhone !== "" &&
      shipmentData?.broker.brokerhefsonId !== ""
    ) {
      setCurrentStep(currentStep + 1);
      Cookies.set("name", JSON.stringify(shipmentData?.broker.name));
      Cookies.set(
        "brokerAgent",
        JSON.stringify(shipmentData?.broker.brokerAgent)
      );
      Cookies.set(
        "brokerPhone",
        JSON.stringify(shipmentData?.broker.brokerPhone)
      );
      Cookies.set(
        "brokerhefsonId",
        JSON.stringify(shipmentData?.broker.brokerhefsonId)
      );
    }
  };

  const fifthStepNext = (e) => {
    e.preventDefault();
    setCreateShipmentLoading(true);
    // setSubmitDisable(true);
    console.log("CreateShipmentLoading- ", createShipmentLoading);

    if (
      shipmentData?.dispatchName === "" &&
      shipmentData?.carrierPhone === 0 &&
      shipmentData?.carrierEmergencyPhone === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dispatchName: "Dispatch name is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierPhone: "Carrier phone is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierEmergencyPhone: "Carrier Emergency Phone Number is required.",
      }));
    } else if (shipmentData?.dispatchName === "") {
      console.log("my name is : ", shipmentData?.dispatchName);
      setErrors((prevErrors) => ({
        ...prevErrors,
        dispatchName: "Dispatch name is required.",
      }));
    } else if (shipmentData?.carrierPhone === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierPhone: "Carrier phone is required.",
      }));
    } else if (shipmentData?.carrierEmergencyPhone === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierEmergencyPhone: "Carrier Emergency Phone Number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dispatchName: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierPhone: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierEmergencyPhone: null,
      }));
    }
    if (
      shipmentData?.dispatchName !== "" &&
      shipmentData?.carrierPhone !== 0 &&
      shipmentData?.carrierEmergencyPhone !== ""
    ) {
      // setCurrentStep(currentStep + 1);
      console.log("Completed step -- ", shipmentData);
      Cookies.set("dispatchName", JSON.stringify(shipmentData?.dispatchName));
      Cookies.set("carrierPhone", JSON.stringify(shipmentData?.carrierPhone));
      Cookies.set(
        "carrierEmergencyPhone",
        JSON.stringify(shipmentData?.carrierEmergencyPhone)
      );

      //need to clear id from shipper and receiver
      const updatedPayload = {
        ...shipmentData,
        receiver: shipmentData.receiver.map((receiver) => {
          // Create a copy of the receiver object without the 'id' property
          const { id, ...receiverWithoutId } = receiver;
          return receiverWithoutId;
        }),
        shipper: shipmentData.shipper.map((shipper) => {
          // Create a copy of the shipper object without the 'id' property
          const { id, ...shipperWithoutId } = shipper;
          return shipperWithoutId;
        }),
        carrierEmergencyPhone: Number(shipmentData?.carrierEmergencyPhone),
      };

      console.log("updatedPayload:  ", updatedPayload);

      dispatch(createShipment(updatedPayload));
      setErrors({
        shipper: [],
        receiver: [],
      });
    }
    // setCreateShipmentLoading(false);
  };
  console.log("CreateShipmentLoading -- ", createShipmentLoading);

  console.log("vsssssssss => ", valueTruck);

  const handleAddShipper = () => {
    setShipmentData((prevState) => ({
      ...prevState,
      shipper: [
        ...prevState.shipper,
        {
          id: Date.now(), // Assign a unique ID to the new shipper
          pickupName: "",
          pickupAddress: "",
          pickupDate: "",
          pickupTime: "",
          poNumber: 0,
        },
      ],
    }));
  };

  const handleRemoveShipper = (shipperIdToRemove) => {
    setShipmentData((prevState) => ({
      ...prevState,
      shipper: prevState.shipper.filter(
        (shipper) => shipper.id !== shipperIdToRemove
      ),
    }));
  };

  const handleAddReceiver = () => {
    setShipmentData((prevState) => ({
      ...prevState,
      receiver: [
        ...prevState.receiver,
        {
          id: Date.now(), // Assign a unique ID to the new shipper
          deliveryName: "",
          deliveryAddress: "",
          deliveryDate: "",
          deliveryTime: "",
          deliveryNumber: 0,
        },
      ],
    }));
  };
  const handleRemoveReceiver = (receiverIdToRemove) => {
    setShipmentData((prevState) => ({
      ...prevState,
      receiver: prevState.receiver.filter(
        (receiver) => receiver.id !== receiverIdToRemove
      ),
    }));
  };

  // const defaultValue = shipmentData?.shipper[0].pickupAddress; // Assuming shipmentData is available
  const renderFormFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {/* Truck & Trailer  */}
            <div className="col-12">
              <div className="tabContent">
                <div className="row">
                  <div className="col-md-6">
                    <p>Truck Info</p>
                    <div className="inputField">
                      <Select
                        value={selectedTruckOption || valueTruck}
                        onChange={handleChangeTruckOptions}
                        options={unit.map((option) => ({
                          value: option,
                          label: option?.unitNumber,
                        }))}
                        placeholder="Unit Number"
                        onBlur={handleUnitNumberBlur}
                      />
                      {errors.truckId && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.truckId}
                        </h6>
                      )}
                    </div>
                    <p
                      className="text-primary mt-3"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      style={{ cursor: "pointer" }}
                    >
                      New Unit
                    </p>
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder={
                          valueTruck?.value !== ""
                            ? valueTruck?.value.manufactureInfo?.name
                            : selectedTruckOption
                            ? selectedTruckOption?.value.manufactureInfo?.name
                            : "Manufacturer"
                        }
                        className="form-control"
                        readOnly
                      />
                    </div>

                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTruck?.value !== ""
                            ? valueTruck?.value?.modelYear?.slice(0, 10)
                            : selectedTruckOption
                            ? selectedTruckOption?.value?.modelYear?.slice(
                                0,
                                10
                              )
                            : "Model Year"
                        }
                        readOnly
                      />
                    </div>

                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTruck?.value !== ""
                            ? valueTruck?.value?.manufactureInfo?.feature.find(
                                (feature) =>
                                  feature._id === valueTruck?.value?.truckColor
                              )?.color
                            : selectedTruckOption
                            ? selectedTruckOption?.value?.manufactureInfo?.feature.find(
                                (feature) =>
                                  feature._id ===
                                  selectedTruckOption?.value?.truckColor
                              )?.color
                            : "Truck Color"
                        }
                        readOnly
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTruck?.value !== ""
                            ? valueTruck?.value?.numberPlate
                            : selectedTruckOption
                            ? selectedTruckOption?.value?.numberPlate
                            : "Number Plate"
                        }
                        readOnly
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTruck?.value !== ""
                            ? valueTruck?.value?.state
                            : selectedTruckOption
                            ? selectedTruckOption?.value?.state
                            : "Issued State"
                        }
                        readOnly
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTruck?.value !== ""
                            ? valueTruck?.value?.registrationExpiry?.slice(
                                0,
                                10
                              )
                            : selectedTruckOption
                            ? selectedTruckOption?.value?.registrationExpiry?.slice(
                                0,
                                10
                              )
                            : "Registration Expiry Date"
                        }
                        readOnly
                      />
                    </div>

                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        Save Truck Info
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <p>Trailer Info</p>
                    <div className="inputField">
                      <Select
                        value={selectedTrailerOption || valueTrailer}
                        onChange={handleChangeTrailerOptions}
                        options={trailer.map((option) => ({
                          value: option,
                          label: option?.unitNumber,
                        }))}
                        placeholder="Trailer Number"
                        onBlur={handleTrailerNumberBlur}
                      />
                      {errors.trailerId && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.trailerId}
                        </h6>
                      )}
                    </div>
                    <p
                      className="text-primary mt-3"
                      data-bs-toggle="modal"
                      data-bs-target="#addtrailers"
                      style={{ cursor: "pointer" }}
                    >
                      New Trailer
                    </p>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTrailer?.value !== ""
                            ? valueTrailer?.value?.numberPlate
                            : selectedTrailerOption
                            ? selectedTrailerOption?.value?.numberPlate
                            : "Number Plate"
                        }
                        readOnly
                      />
                    </div>

                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTrailer?.value !== ""
                            ? valueTrailer?.value?.modelYear?.slice(0, 10)
                            : selectedTrailerOption
                            ? selectedTrailerOption?.value?.modelYear?.slice(
                                0,
                                10
                              )
                            : "Model Year"
                        }
                        readOnly
                      />
                    </div>

                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTrailer?.value !== ""
                            ? valueTrailer?.value?.state
                            : selectedTrailerOption
                            ? selectedTrailerOption?.value?.state
                            : "Issued State"
                        }
                        readOnly
                      />
                    </div>

                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueTrailer?.value !== ""
                            ? valueTrailer?.value?.registrationExpiry?.slice(
                                0,
                                10
                              )
                            : selectedTrailerOption
                            ? selectedTrailerOption?.value?.registrationExpiry?.slice(
                                0,
                                10
                              )
                            : "Registration Expiry Date"
                        }
                        readOnly
                      />
                    </div>

                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        Save Trailer Info
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <Link to="/home">
                      <button
                        type="button"
                        className="btn btn-border me-3"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                    </Link>

                    <button
                      type="button"
                      className="btn"
                      onClick={firstStepNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Driver Info */}
            <div className="col-12">
              <div className="tabContent">
                <div className="row">
                  <div className="col-md-6">
                    <div className="inputField">
                      <Select
                        value={selectedDriverOption || valueDriver}
                        onChange={handleChangeDriverOptions}
                        options={driver.map((option) => ({
                          value: option,
                          label: option.fullName,
                        }))}
                        placeholder="Driver Name"
                        onBlur={handleDriverNameBlur}
                      />
                      {errors.driverId && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.driverId}
                        </h6>
                      )}
                    </div>
                    <p
                      className="text-primary mt-3"
                      data-bs-toggle="modal"
                      data-bs-target="#addDrivers"
                      style={{ cursor: "pointer" }}
                    >
                      New Driver
                    </p>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueDriver?.value !== ""
                            ? valueDriver?.value?.driverProtfolio?.licenseNo
                            : selectedDriverOption
                            ? selectedDriverOption?.value?.driverProtfolio
                                ?.licenseNo
                            : "License Number"
                        }
                        readOnly
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueDriver?.value !== ""
                            ? valueDriver?.value?.driverProtfolio?.issuedState
                            : selectedDriverOption
                            ? selectedDriverOption?.value?.driverProtfolio
                                ?.issuedState
                            : "Issued State"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueDriver?.value !== ""
                            ? valueDriver?.value?.id
                            : selectedDriverOption
                            ? selectedDriverOption?.value?.id
                            : "Hefson ID"
                        }
                        readOnly
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueDriver?.value !== ""
                            ? valueDriver?.value?.driverProtfolio?.licenseExp?.slice(
                                0,
                                10
                              )
                            : selectedDriverOption
                            ? selectedDriverOption?.value?.driverProtfolio?.licenseExp?.slice(
                                0,
                                10
                              )
                            : "License Expiry"
                        }
                        readOnly
                      />
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          valueDriver?.value !== ""
                            ? valueDriver?.value?.mobile?.number
                            : selectedDriverOption
                            ? selectedDriverOption?.value?.mobile?.number
                            : "Phone Number"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        Save driver Info
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      data-bs-dismiss="modal"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={secondStepNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* Trip Info  */}
            <div className="col-12">
              <div className="tabContent">
                <div className="row">
                  {/* // */}
                  <div className="col-md-6">
                    <div className="row">
                      {shipmentData?.shipper?.map((shipper, index) => (
                        <div className="col-12" key={index}>
                          <div className="spaceBetween">
                            <p>Shipper Info</p>
                          </div>

                          <div className="inputField">
                            <input
                              type="text"
                              placeholder="Pick Up Name"
                              className="form-control"
                              value={shipper?.pickupName}
                              onChange={(e) => {
                                setShipmentData((prevState) => {
                                  const updatedShippers = [
                                    ...prevState.shipper,
                                  ];
                                  updatedShippers[index].pickupName =
                                    e.target.value;
                                  return {
                                    ...prevState,
                                    shipper: updatedShippers,
                                  };
                                });

                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  shipper: [
                                    ...prevErrors.shipper?.slice(0, index), // Preserve existing errors before the current index
                                    {
                                      ...prevErrors.shipper[index], // Preserve existing errors for other fields of the current index
                                      pickupName: null, // Reset the pickupName error for the current index
                                    },
                                    ...prevErrors.shipper?.slice(index + 1), // Preserve existing errors after the current index
                                  ],
                                }));
                              }}
                              name="pickupName"
                              onBlur={() => handlePickupNameBlur(index)} // Pass the index to the blur handler by wrapping it in an arrow function
                              required
                            />
                          </div>
                          {index === Index && errors?.pickupName && (
                            <h6 className="text-danger validation-error mt-2">
                              {errors?.pickupName}
                            </h6>
                          )}
                          <div className="inputField">
                            <Autocomplete
                              apiKey={process.env.REACT_APP_MAP_API}
                              options={{
                                suppressDefaultStyles: true,
                                types: ["address"],
                              }}
                              placeholder="Pick Up Address"
                              onPlaceSelected={(place) =>
                                handlePlaceSelected(index, place)
                              }
                              onBlur={() => handlePickupAddressBlur(index)}
                              name="pickupAddress"
                              required
                              Value=""
                              defaultValue={
                                shipmentData?.shipper[index]?.pickupAddress !==
                                null
                                  ? shipmentData?.shipper[index]?.pickupAddress
                                  : "a"
                              } // Updated defaultValue
                              className="form-control"
                              onError={(error) =>
                                handleAutocompleteError(error)
                              }
                            />
                          </div>
                          {index === Index && errors.pickupAddress && (
                            <h6 className="text-danger validation-error mt-2">
                              {errors.pickupAddress}
                            </h6>
                          )}

                          <div className="inputField">
                            <DatePicker
                              className="form-control"
                              selected={
                                shipper.pickupDate
                                  ? new Date(shipper.pickupDate)
                                  : undefined
                              } // Use undefined when it's empty
                              onChange={(date) => {
                                handleDateChangePickupDate(date, index);
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  pickupDate: null,
                                }));
                              }}
                              placeholderText="Pickup Date"
                              onFocus={() => {
                                if (ref6.current) {
                                  ref6.current.input.readOnly = true;
                                }
                              }}
                              onBlur={() => {
                                if (ref6.current) {
                                  ref6.current.input.readOnly = false;
                                }
                              }}
                              ref={ref6}
                              required
                            />

                            <img
                              src={CalenderIcon}
                              className="cal"
                              alt="Calendar Icon"
                              onClick={openDatePickerPickupDate}
                            />
                          </div>
                          {index === Index && errors?.pickupDate && (
                            <div className="text-danger validation-error mt-2">
                              {errors?.pickupDate}
                            </div>
                          )}
                          <div className="inputField">
                            <TimePicker
                              className="form-control"
                              placeholder="Pick Up Time"
                              value={
                                shipper.pickupTime
                                  ? moment(shipper.pickupTime, "HH:mm")
                                  : null
                              } // Convert the "HH:mm" time to a moment object or handle null time
                              onChange={(time) => {
                                handleTimeChange(time, index);
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  pickupTime: null,
                                }));
                              }}
                              showSecond={showSecond} // Hide seconds
                              format={showSecond ? "HH:mm:ss" : "HH:mm"} // Set the format based on showSecond
                              onFocus={() => {
                                if (ref7.current) {
                                  ref7.current.input.readOnly = true;
                                }
                              }}
                              onBlur={() => {
                                if (ref7.current) {
                                  ref7.current.input.readOnly = false;
                                }
                                // Handle onBlur actions if needed
                              }}
                              required
                            />
                          </div>
                          {index === Index && errors?.pickupTime && (
                            <div className="text-danger validation-error mt-2">
                              {errors?.pickupTime}
                            </div>
                          )}
                          <div className="inputField">
                            <input
                              type="text"
                              placeholder="PO Number"
                              className="form-control"
                              value={
                                shipper?.poNumber === 0
                                  ? null
                                  : shipper?.poNumber
                              }
                              onChange={(e) => {
                                const newValue =
                                  parseFloat(e.target.value) || 0;
                                setShipmentData((prevState) => {
                                  const updatedShippers = [
                                    ...prevState.shipper,
                                  ];
                                  updatedShippers[index].poNumber =
                                    e.target.value;
                                  return {
                                    ...prevState,
                                    shipper: updatedShippers,
                                  };
                                });

                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  poNumber: null,
                                }));
                              }}
                              name="poNumber"
                              onBlur={() => handlePoNumberBlur(index)}
                              required
                            />
                          </div>
                          {index === Index && errors?.poNumber && (
                            <div className="text-danger validation-error mt-2">
                              {errors?.poNumber}
                            </div>
                          )}
                          <p
                            className="text-primary text-end"
                            onClick={() => handleRemoveShipper(shipper?.id)}
                            style={{ cursor: "pointer", marginTop: "20px" }}
                          >
                            Remove Shipper
                          </p>
                        </div>
                      ))}
                      <p
                        className="text-primary"
                        onClick={handleAddShipper}
                        style={{ cursor: "pointer", marginTop: "20px" }}
                      >
                        Add Shipper
                      </p>
                    </div>
                  </div>

                  {/* // */}
                  <div className="col-md-6">
                    <div className="row">
                      {shipmentData?.receiver.map((receiver, index) => (
                        <div className="col-12" key={index}>
                          <div className="spaceBetween">
                            <p>Receiver Info</p>
                            {/* <p className="text-primary">Add Receiver</p> */}
                          </div>

                          <div className="inputField">
                            <input
                              type="text"
                              placeholder="Delivery Name"
                              className="form-control"
                              value={receiver.deliveryName}
                              onChange={(e) => {
                                setShipmentData((prevState) => {
                                  const updatedShippers = [
                                    ...prevState.receiver,
                                  ];
                                  updatedShippers[index].deliveryName =
                                    e.target.value;
                                  return {
                                    ...prevState,
                                    receiver: updatedShippers,
                                  };
                                });
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  deliveryName: null,
                                }));
                              }}
                              name="deliveryName"
                              onBlur={() => handleDeliveryNameBlur(index)}
                              required
                            />
                          </div>
                          {index === Index && errors.deliveryName && (
                            <div className="text-danger validation-error mt-2">
                              {errors.deliveryName}
                            </div>
                          )}
                          <div className="inputField">
                            <Autocomplete
                              ref={inputRef}
                              apiKey={process.env.REACT_APP_MAP_API}
                              options={{
                                suppressDefaultStyles: true,
                                types: ["address"],
                              }}
                              placeholder="Delivery Address"
                              // onPlaceSelected={handlePlaceSelectedDelivery}
                              onPlaceSelected={(place) =>
                                handlePlaceSelectedDelivery(index, place)
                              }
                              onBlur={() => handleDeliveryAddressBlur(index)}
                              name="deliveryAddress"
                              required
                              Value=""
                              defaultValue={
                                shipmentData?.receiver[index]
                                  ?.deliveryAddress !== null
                                  ? shipmentData?.receiver[index]
                                      ?.deliveryAddress
                                  : "a"
                              }
                              className="form-control"
                            />
                          </div>
                          {index === Index && errors.deliveryAddress && (
                            <div className="text-danger validation-error mt-2">
                              {errors.deliveryAddress}
                            </div>
                          )}

                          <div className="inputField">
                            <DatePicker
                              className="form-control"
                              selected={
                                receiver.deliveryDate
                                  ? new Date(receiver.deliveryDate)
                                  : undefined
                              } // Use undefined when it's empty
                              onChange={(date) => {
                                handleDateChangeDeliveryDate(date, index);
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  deliveryDate: null,
                                }));
                              }}
                              placeholderText="Delivery Date"
                              onFocus={() => {
                                if (ref8.current) {
                                  ref8.current.input.readOnly = true;
                                }
                              }}
                              onBlur={() => {
                                if (ref8.current) {
                                  ref8.current.input.readOnly = false;
                                }
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  deliveryDate: null,
                                }));
                              }}
                              ref={ref8}
                              required
                            />

                            <img
                              src={CalenderIcon}
                              className="cal"
                              alt="Calendar Icon"
                              onClick={openDatePickerDeliveryDate}
                            />
                          </div>
                          {index === Index && errors.deliveryDate && (
                            <div className="text-danger validation-error mt-2">
                              {errors.deliveryDate}
                            </div>
                          )}
                          <div className="inputField">
                            <TimePicker
                              className="form-control"
                              placeholder="Delivery Time"
                              value={
                                receiver.deliveryTime
                                  ? moment(receiver.deliveryTime, "HH:mm")
                                  : null
                              } // Convert the "HH:mm" time to a moment object or handle null time
                              onChange={(time) => {
                                handleTimeChangeReceiver(time, index);
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  deliveryTime: null,
                                }));
                              }}
                              showSecond={showSecond} // Hide seconds
                              format={showSecond ? "HH:mm:ss" : "HH:mm"} // Set the format based on showSecond
                              onFocus={() => {
                                if (ref7.current) {
                                  ref7.current.input.readOnly = true;
                                }
                              }}
                              onBlur={() => {
                                if (ref7.current) {
                                  ref7.current.input.readOnly = false;
                                }
                                // Handle onBlur actions if needed
                              }}
                              required
                            />
                          </div>
                          {index === Index && errors.deliveryTime && (
                            <div className="text-danger validation-error mt-2">
                              {errors.deliveryTime}
                            </div>
                          )}
                          <div className="inputField">
                            <input
                              type="text"
                              placeholder="Delivery Number"
                              className="form-control"
                              value={
                                receiver.deliveryNumber === 0
                                  ? null
                                  : receiver.deliveryNumber
                              }
                              onChange={(e) => {
                                const newValue =
                                  parseFloat(e.target.value) || 0;

                                setShipmentData((prevState) => {
                                  const updatedShippers = [
                                    ...prevState.receiver,
                                  ];
                                  updatedShippers[index].deliveryNumber =
                                    e.target.value;
                                  return {
                                    ...prevState,
                                    receiver: updatedShippers,
                                  };
                                });
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  deliveryNumber: null,
                                }));
                              }}
                              name="deliveryNumber"
                              onBlur={() => handleDeliveryNumberBlur(index)}
                              required
                            />
                          </div>
                          {index === Index && errors.deliveryNumber && (
                            <div className="text-danger validation-error mt-2">
                              {errors.deliveryNumber}
                            </div>
                          )}
                          <p
                            className="text-primary text-end"
                            onClick={() => handleRemoveReceiver(receiver?.id)}
                            style={{ cursor: "pointer", marginTop: "20px" }}
                          >
                            Remove Receiver
                          </p>
                        </div>
                      ))}
                      <p
                        className="text-primary"
                        onClick={handleAddReceiver}
                        style={{ cursor: "pointer", marginTop: "20px" }}
                      >
                        Add Receiver
                      </p>
                    </div>
                  </div>

                  {/* // */}
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Required Temperature °F"
                        className="form-control"
                        value={shipmentData?.temperature.actual}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            temperature: {
                              ...prevState.temperature,
                              actual: e.target.value,
                            },
                          }));
                          Cookies.set(
                            "actual",
                            JSON.stringify(shipmentData?.temperature.actual)
                          );
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            temperatureActual: "",
                          }));
                        }}
                        name="actual"
                        onBlur={() => {
                          handleRequiredTempBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.temperatureActual && (
                      <div className="text-danger validation-error mt-2">
                        {errors.temperatureActual}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Minimum Threshold °F"
                        className="form-control"
                        value={shipmentData?.temperature.min}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            temperature: {
                              ...prevState.temperature,
                              min: e.target.value,
                            },
                          }));
                          Cookies.set(
                            "min",
                            JSON.stringify(shipmentData?.temperature.min)
                          );
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            temperatureMin: "",
                          }));
                        }}
                        name="min"
                        onBlur={() => {
                          handleRequiredMinTempBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.temperatureMin && (
                      <div className="text-danger validation-error mt-2">
                        {errors.temperatureMin}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Maximum Threshold °F"
                        className="form-control"
                        value={shipmentData?.temperature.max}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            temperature: {
                              ...prevState.temperature,
                              max: e.target.value,
                            },
                          }));
                          Cookies.set(
                            "max",
                            JSON.stringify(shipmentData?.temperature.max)
                          );
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            temperatureMax: "",
                          }));
                        }}
                        name="max"
                        onBlur={() => {
                          handleRequiredMaxTempBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.temperatureMax && (
                      <div className="text-danger validation-error mt-2">
                        {errors.temperatureMax}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Reference Number"
                        className="form-control"
                        value={shipmentData?.referenceNumber}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            referenceNumber: e.target.value,
                          }));
                          Cookies.set(
                            "referenceNumber",
                            JSON.stringify(shipmentData?.referenceNumber)
                          );
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            referenceNumber: null,
                          }));
                        }}
                        name="referenceNumber"
                        onBlur={() => {
                          handleReferenceNumberBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.referenceNumber && (
                      <div className="text-danger validation-error mt-2">
                        {errors.referenceNumber}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Comment"
                        className="form-control"
                        value={shipmentData?.comment}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            comment: e.target.value,
                          }));
                          Cookies.set(
                            "comment",
                            JSON.stringify(shipmentData?.comment)
                          );
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            comment: null,
                          }));
                        }}
                        name="comment"
                        onBlur={() => {
                          handleCommentTempBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.comment && (
                      <div className="text-danger validation-error mt-2">
                        {errors.comment}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      data-bs-dismiss="modal"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn"
                      // onClick={() => setCurrentStep(currentStep + 1)}
                      onClick={thirdStepNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            {/* Broker Info  */}
            <div className="col-12">
              <div className="tabContent">
                <div className="row">
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Broker"
                        className="form-control"
                        value={shipmentData?.broker.name}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            broker: {
                              ...prevState.broker,
                              name: e.target.value,
                            },
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            brokerName: "",
                          }));
                        }}
                        name="brokerName"
                        onBlur={() => {
                          handleBrokerNameBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.brokerName && (
                      <div className="text-danger validation-error mt-2">
                        {errors.brokerName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Broker Agent"
                        className="form-control"
                        value={shipmentData?.broker.brokerAgent}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            broker: {
                              ...prevState.broker,
                              brokerAgent: e.target.value,
                            },
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            brokerAgent: "",
                          }));
                        }}
                        name="brokerAgent"
                        onBlur={() => {
                          handleBrokerAgentBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.brokerAgent && (
                      <div className="text-danger validation-error mt-2">
                        {errors.brokerAgent}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="form-control"
                        value={shipmentData?.broker.brokerPhone}
                        onChange={(e) => {
                          const phoneNumber = e.target.value.trim();
                          // Allow only digits and limit to 10 characters
                          const sanitizedPhoneNumber = phoneNumber
                            .replace(/[^\d]/g, "")
                            .slice(0, 10);

                          setShipmentData((prevState) => ({
                            ...prevState,
                            broker: {
                              ...prevState.broker,
                              brokerPhone: sanitizedPhoneNumber,
                            },
                          }));
                          handleBrokerPhoneBlur(e);
                        }}
                        name="brokerPhone"
                        onBlur={() => {
                          handleBrokerPhoneBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.brokerPhone && (
                      <div className="text-danger validation-error mt-2">
                        {errors.brokerPhone}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Hefson ID"
                        className="form-control"
                        value={shipmentData?.broker.brokerhefsonId}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            broker: {
                              ...prevState.broker,
                              brokerhefsonId: e.target.value,
                            },
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            brokerhefsonId: "",
                          }));
                        }}
                        name="brokerhefsonId"
                        onBlur={() => {
                          handleBrokerhefsonIdBlur();
                        }}
                        required
                      />
                    </div>
                    {errors.brokerhefsonId && (
                      <div className="text-danger validation-error mt-2">
                        {errors.brokerhefsonId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      data-bs-dismiss="modal"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={forthStepNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            {/* Carrier Info */}
            <div className="col-12">
              {loading === true ? (
                <>
                  <PropagateLoader
                    cssOverride={override}
                    size={15}
                    color={"#000"}
                    loading={loading}
                  />
                </>
              ) : (
                <div className="tabContent">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="inputField">
                        <input
                          type="text"
                          placeholder="Carrier Name"
                          className="form-control"
                          value={
                            Cookies.get("fullName")
                              ? JSON.parse(Cookies.get("fullName"))
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="inputField">
                        <input
                          type="text"
                          placeholder="Carrier DOT Number"
                          className="form-control"
                          value={
                            Cookies.get("loginToken")
                              ? JSON.parse(Cookies.get("loginToken"))?.slice(
                                  0,
                                  10
                                )
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="inputField">
                        <input
                          type="text"
                          placeholder="Dispatch Name"
                          className="form-control"
                          value={
                            Cookies.get("businessName")
                              ? JSON.parse(Cookies.get("businessName"))
                              : ""
                          }
                          readOnly
                          name="dispatchName"
                          required
                        />
                      </div>
                      {errors.dispatchName && (
                        <div className="text-danger validation-error mt-2">
                          {errors.dispatchName}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="inputField">
                        <input
                          type="text"
                          placeholder="Phone Number"
                          className="form-control"
                          value={
                            Cookies.get("phone")
                              ? JSON.parse(Cookies.get("phone"))
                              : ""
                          }
                          readOnly
                          name="carrierPhone"
                          required
                        />
                      </div>
                      {errors.carrierPhone && (
                        <div className="text-danger validation-error mt-2">
                          {errors.carrierPhone}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="inputField">
                        <input
                          type="text"
                          placeholder="Emergency Contact Number"
                          className="form-control"
                          value={shipmentData?.carrierEmergencyPhone}
                          onChange={(e) => {
                            const phoneNumber = e.target.value.trim();

                            // Allow only digits and limit to 10 characters
                            const sanitizedPhoneNumber = phoneNumber
                              .replace(/[^\d]/g, "")
                              .slice(0, 10);

                            setShipmentData((prevState) => ({
                              ...prevState,
                              carrierEmergencyPhone: sanitizedPhoneNumber,
                            }));

                            Cookies.set(
                              "carrierEmergencyPhone",
                              JSON.stringify(sanitizedPhoneNumber)
                            );

                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              carrierEmergencyPhone: "",
                            }));
                          }}
                          name="carrierEmergencyPhone"
                          onBlur={handleCarrierEmergencyPhoneBlur}
                          required
                        />
                      </div>
                      {errors.carrierEmergencyPhone && (
                        <div className="text-danger validation-error mt-2">
                          {errors.carrierEmergencyPhone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row my-4">
                    <div className="col-12 text-end">
                      <button
                        type="button"
                        className="btn btn-border me-3"
                        data-bs-dismiss="modal"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={(e) => fifthStepNext(e)}
                      >
                        Confirm & Create Shipment
                      </button>
                      <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                        Create shipment will take around 10-15 sec
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="newShipment">
      <HeaderComponent titleProp="Create New Shipment" />

      <ToolBox />
      <div className="container">
        <div className="row">
          {/* <div className="col-12">
            <h2 className="text-center my-5">Create New Shipment</h2>
          </div> */}
          <div className="col-12">
            <div className="tabNavigation">
              <div
                className={`stepBox ${currentStep === 1 ? "activeStep" : ""}
                ${currentStep - 1 >= 1 ? "successStep" : ""}`}
              >
                <div className="step ">
                  <p className="mb-0">1</p>
                </div>
                <h6>Truck & Trailer</h6>
              </div>
              <div
                className={`stepBox ${currentStep === 2 ? "activeStep" : ""}
                  ${currentStep - 1 >= 2 ? "successStep" : ""}`}
              >
                <div className="step ">
                  <p className="mb-0">2</p>
                </div>
                <h6>Driver Info</h6>
              </div>
              <div
                className={`stepBox ${currentStep === 3 ? "activeStep" : ""}
                  ${currentStep - 1 >= 3 ? "successStep" : ""}`}
              >
                <div className="step">
                  <p className="mb-0">3</p>
                </div>
                <h6>Trip Info</h6>
              </div>
              <div
                className={`stepBox ${currentStep === 4 ? "activeStep" : ""}
                  ${currentStep - 1 >= 4 ? "successStep" : ""}`}
              >
                <div className="step">
                  <p className="mb-0">4</p>
                </div>
                <h6>Broker Info</h6>
              </div>
              <div
                className={`stepBox ${currentStep === 5 ? "activeStep" : ""}
                  ${currentStep - 1 >= 5 ? "successStep" : ""}`}
              >
                <div className="step">
                  <p className="mb-0">5</p>
                </div>
                <h6>Carrier Info</h6>
              </div>
              <div className="middleLine"></div>
            </div>
          </div>
          {renderFormFields()}
        </div>
      </div>

      {/* Popups */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Unit
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clearUnit()}
              >
                <i className="fa-solid fa-xmark"></i>
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
                      value={unitData.unitNumber}
                      onChange={(e) =>
                        setUnitData({ ...unitData, unitNumber: e.target.value })
                      }
                      onBlur={(e) => handleUnitNumberBlur(e)}
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
                    <input
                      type="text"
                      className="form-control date-picker"
                      placeholder="Model Year"
                      ref={ref2}
                      onFocus={() => (ref2.current.type = "date")}
                      onBlur={(e) => {
                        ref2.current.type = "text";
                        handleModelYearBlur(e);
                      }}
                      value={unitData.modelYear}
                      onChange={(e) =>
                        setUnitData({
                          ...unitData,
                          modelYear: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {errors.modelYear && (
                    <h6 className="text-danger mt-2 validation-error">
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
                      value={unitData.numberPlate}
                      onChange={(e) =>
                        setUnitData({
                          ...unitData,
                          numberPlate: e.target.value,
                        })
                      }
                      onBlur={(e) => handleNumberPlateBlur(e)}
                      required
                    />
                  </div>
                  {errors.numberPlate && (
                    <h6 className="text-danger mt-2 validation-error">
                      {errors.numberPlate}
                    </h6>
                  )}
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Registration Expiry Date"
                      ref={ref}
                      onClick={() => (ref.current.type = "date")}
                      onFocus={() => (ref.current.type = "date")}
                      onBlur={(e) => {
                        ref.current.type = "text";
                        handleRegistrationExpiryBlur(e);
                      }}
                      value={unitData.registrationExpiry}
                      onChange={(e) =>
                        setUnitData({
                          ...unitData,
                          registrationExpiry: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {errors.registrationExpiry && (
                    <h6 className="text-danger mt-2 validation-error">
                      {errors.registrationExpiry}
                    </h6>
                  )}
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <Select
                      value={selectedOptionState || valueState}
                      onChange={handleChangeOptionsState}
                      options={unitState?.flatMap((manu) =>
                        manu.states.map((state) => ({
                          value: state.name,
                          label: state.name,
                        }))
                      )}
                      placeholder="State/Province"
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
                </div>

                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <Select
                      value={selectedOptionColor || valueColor}
                      onChange={handleChangeOptionsColor}
                      options={
                        manufacture
                          .filter((manu) => manu._id === unitData.manufacture)
                          .flatMap((manu) =>
                            manu.feature.map((feature) => ({
                              value: feature,
                              label: feature.color,
                            }))
                          )
                        // .flatMap((option) => ({
                        //   value: option,
                        //   label: option.name,
                        // }))
                      }
                      placeholder="Unit Color"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border me-3"
                data-bs-dismiss="modal"
                onClick={() => clearUnit()}
              >
                Back
              </button>

              <div data-bs-dismiss="modal">
                <button type="button" className="btn" onClick={addUnitHandler}>
                  Add Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* add new trailer popup */}
      <div
        className="modal fade"
        id="addtrailers"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Trailer
              </h5>

              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clearTrailer()}
              >
                <i className="fa-solid fa-xmark"></i>
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
                      value={selectedOptionTrailer || valueTrailers}
                      onChange={handleChangeOptionsTrailer}
                      options={manufactureTrailer.map((option) => ({
                        value: option,
                        label: option.name,
                      }))}
                      placeholder="Manufacturer"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control date-picker"
                      placeholder="Model Year"
                      ref={ref2}
                      onFocus={() => (ref2.current.type = "date")}
                      onBlur={() => (ref2.current.type = "text")}
                      defaultValue={trailerData.modelYear}
                      onChange={(e) =>
                        setTrailerData({
                          ...trailerData,
                          modelYear: e.target.value,
                        })
                      }
                      required
                    />
                    {/* <img src="./assets/icons/CalendarDate.svg" alt="" /> */}
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Number Plate"
                      defaultValue={trailerData.numberPlate}
                      onChange={(e) =>
                        setTrailerData({
                          ...trailerData,
                          numberPlate: e.target.value,
                        })
                      }
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
                      placeholder={trailerData.engineHours || "Engine Hours"}
                      required
                      onBlur={(e) => handleEngineHoursBlur(e)}
                      defaultValue={trailerData.engineHours}
                      onChange={(e) =>
                        setTrailerData({
                          ...trailerData,
                          engineHours: e.target.value,
                        })
                      }
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
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Registration Expiry Date"
                      ref={ref}
                      onFocus={() => (ref.current.type = "date")}
                      onBlur={() => (ref.current.type = "text")}
                      defaultValue={trailerData.registrationExpiry}
                      onChange={(e) =>
                        setTrailerData({
                          ...trailerData,
                          registrationExpiry: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <Select
                      value={selectedOptionStates || valueStates}
                      onChange={handleChangeOptionsStates}
                      options={unitState?.flatMap((manu) =>
                        manu.states.map((state) => ({
                          value: state.name,
                          label: state.name,
                        }))
                      )}
                      placeholder="Select State"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="spaceBetween w-100">
                <button
                  type="button"
                  className="btn btn-border"
                  data-bs-dismiss="modal"
                  onClick={() => clearTrailer()}
                >
                  Back
                </button>

                <div data-bs-dismiss="modal">
                  <button
                    type="button"
                    className="btn"
                    onClick={addTrailerHandler}
                  >
                    Add Trailer
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

      {/* add new driver popup */}
      <div
        className="modal fade"
        id="addDrivers"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Driver
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clearDriver()}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <div className="">
                    <label htmlFor="uploadFile" className="uploadButton">
                      <div className="row">
                        {customerData?.image ? (
                          <div className="col">
                            <img
                              src={
                                customerData?.image ? customerData?.image : ""
                              }
                              className=" rounded-circle"
                              style={{
                                width: "50px",
                                height: "50px",
                                cursor: "pointer",
                              }}
                              alt={
                                customerData?.fullName
                                  ? customerData?.fullName
                                  : ""
                              }
                            />
                          </div>
                        ) : (
                          <div
                            className="col camera"
                            style={{ marginLeft: "20px" }}
                          >
                            <input
                              type="file"
                              className="form-control"
                              placeholder="Upload Image"
                              id="uploadFile"
                              onChange={(e) => uploadImageHandler(e)}
                              hidden
                              onBlur={(e) => handleImageBlur(e)}
                            />
                            <i className="fa-solid fa-camera"></i>
                          </div>
                        )}

                        <input
                          type="file"
                          className="form-control d-none"
                          placeholder="Upload Image"
                          id="uploadFile"
                          onChange={uploadImageHandler}
                          onBlur={(e) => handleImageBlur(e)}
                        />
                        <div className="col">
                          <ClipLoader
                            size={30}
                            color={"#000"}
                            loading={uploading}
                          />
                        </div>
                      </div>
                    </label>
                    {errors.image && (
                      <h6 className="text-danger validation-error">
                        {errors.image}
                      </h6>
                    )}
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Driver Name"
                      value={customerData.fullName}
                      onChange={(e) => {
                        setCustomerData({
                          ...customerData,
                          fullName: e.target.value,
                        });
                        handleFullNameBlur(e);
                      }}
                      onBlur={(e) => handleFullNameBlur(e)}
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <h6 className="text-danger validation-error">
                      {errors.fullName}
                    </h6>
                  )}
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      value={customerData.email}
                      onChange={(e) => {
                        setCustomerData({
                          ...customerData,
                          email: e.target.value,
                        });
                        handleEmailBlur(e);
                      }}
                      onBlur={(e) => handleEmailBlur(e)}
                      required
                    />
                  </div>
                  {errors.email && (
                    <h6 className="text-danger validation-error">
                      {errors.email}
                    </h6>
                  )}
                </div>

                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="License Number"
                      value={customerData.licenseNo}
                      onChange={(e) => {
                        setCustomerData({
                          ...customerData,
                          licenseNo: e.target.value,
                        });
                        handleLicenseBlur(e);
                      }}
                      onBlur={(e) => handleLicenseBlur(e)}
                      required
                    />
                  </div>
                  {errors.licenseNo && (
                    <h6 className="text-danger validation-error">
                      {errors.licenseNo}
                    </h6>
                  )}
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="License Expiry "
                      ref={ref2}
                      onFocus={() => (ref2.current.type = "date")}
                      onBlur={(e) => {
                        ref2.current.type = "text";
                        handleLicenseExpireBlur(e);
                      }}
                      value={customerData.licenseExp}
                      onChange={(e) => {
                        setCustomerData({
                          ...customerData,
                          licenseExp: e.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  {errors.licenseExp && (
                    <h6 className="text-danger validation-error">
                      {errors.licenseExp}
                    </h6>
                  )}
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <Select
                      value={selectedOptionState || valueState}
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
                </div>

                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone Number"
                      value={customerData?.mobile?.number}
                      onChange={(e) => {
                        const phoneNumber = e.target.value;
                        if (/^\d{0,10}$/.test(phoneNumber)) {
                          setCustomerData({
                            ...customerData,
                            mobile: {
                              ...customerData.mobile,
                              number: phoneNumber,
                            },
                          });
                          handleMobileBlur(e);
                        }
                      }}
                      onBlur={(e) => handleMobileBlur(e)}
                      required
                    />
                  </div>
                  {errors.mobile && (
                    <h6 className="text-danger validation-error">
                      {errors.mobile}
                    </h6>
                  )}
                </div>
                <div className="col-12 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address"
                      value={customerData.address}
                      onChange={(e) => {
                        setCustomerData({
                          ...customerData,
                          address: e.target.value,
                        });
                        handleAddressBlur(e);
                      }}
                      onBlur={(e) => handleAddressBlur(e)}
                      required
                    />
                  </div>
                  {errors.address && (
                    <h6 className="text-danger validation-error">
                      {errors.address}
                    </h6>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border"
                data-bs-dismiss="modal"
                onClick={() => clearDriver()}
              >
                Back
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn"
                onClick={addDriverHandler}
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewShipment;

import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listTrailer } from "../actions/trailer";
import { listTruck } from "../actions/truck";
import Select from "react-select";
import { listDriver } from "../actions/driver";
import { createShipment, updateShipment } from "../actions/shipment";
import Autocomplete from "react-google-autocomplete";
import { Link, useNavigate, useParams } from "react-router-dom";
import ToolBox from "./ToolBox";
import * as api from "../api/index";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const UpdateShipment = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  console.log("ID -=-=-=", id);// use this as current Id
  const navigate = useNavigate();
  // let unit = null;
  // let trailer = null;
  // let driver = null;
  useEffect(() => {
    if (loginToken === null) {
      window.location.replace("/login");
    }
    (async () => {
      try {
        const { data } = await api.getShipmentDetail(id);
        // setShipmentData(data.data);
        setLoading(false); // Set loading state to false after data is fetched

        setShipmentData({
          ...shipmentData,
          truckId: data.data.truckId,
          trailerId: data.data.trailerId,
          isDefaultTruck: data.data.isDefaultTruck,
          isDefaultTrailer: data.data.isDefaultTruck,
          driverId: data.data.driverId,
          isDefaultDriver: data.data.isDefaultDriver,
          shipper: [
            {
              ...shipmentData.shipper[0],
              pickupName: data.data.shipper[0].pickupName,
              pickupAddress: data.data.shipper[0].pickupAddress,
              latitude: data.data.shipper[0].latitude,
              longitude: data.data.shipper[0].longitude,
              pickupDate: data.data.shipper[0].pickupDate,
              pickupTime: data.data.shipper[0].pickupTime,
              poNumber: data.data.shipper[0].poNumber,
            },
          ],
          receiver: [
            {
              ...shipmentData.receiver[0],
              deliveryName: data.data.receiver[0].deliveryName,
              deliveryAddress: data.data.receiver[0].deliveryAddress,
              latitude: data.data.receiver[0].latitude,
              longitude: data.data.receiver[0].longitude,
              deliveryDate: data.data.receiver[0].deliveryDate,
              deliveryTime: data.data.receiver[0].deliveryTime,
              deliveryNumber: data.data.receiver[0].deliveryNumber,
            },
          ],
          temperature: {
            ...shipmentData.temperature,
            actual: data.data.temperature.actual,
            min: data.data.temperature.min,
            max: data.data.temperature.max,
          },
          referenceNumber: data.data.referenceNumber,
          comment: data.data.comment,
          broker: {
            ...shipmentData.broker,
            name: data.data.broker.name,
            brokerAgent: data.data.broker.brokerAgent,
            brokerPhone: data.data.broker.brokerPhone,
            brokerhefsonId: data.data.broker.brokerhefsonId,
          },
          dispatchName: data.data.dispatchName,
          carrierPhone: data.data.carrierPhone,
          carrierEmergencyPhone: data.data.carrierEmergencyPhone,
        });
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

    dispatch(listTruck(1, 100));
    dispatch(listTrailer(1, 100));
    dispatch(listDriver(1, 100, "createdAt", -1));
  }, []);

  const { unit } = useSelector((state) => state.truckReducer);
  const { trailer } = useSelector((state) => state.trailerReducer);
  const { driver } = useSelector((state) => state.driverReducer);

  console.log("Unit list =>  ", unit);
  console.log("trailer list =>  ", trailer);
  console.log("driver list =>  ", driver);

  const [errors, setErrors] = useState({});
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
    shipper: [
      {
        pickupName: Cookies.get("pickupName")
          ? JSON.parse(Cookies.get("pickupName"))
          : "",
        pickupAddress: Cookies.get("pickupAddress")
          ? JSON.parse(Cookies.get("pickupAddress"))
          : "",
        latitude: Cookies.get("latitudeShipper")
          ? JSON.parse(Cookies.get("latitudeShipper"))
          : 0,
        longitude: Cookies.get("longitudeShipper")
          ? JSON.parse(Cookies.get("longitudeShipper"))
          : 0,
        pickupDate: Cookies.get("pickupDate")
          ? JSON.parse(Cookies.get("pickupDate"))
          : "",
        pickupTime: Cookies.get("pickupTime")
          ? JSON.parse(Cookies.get("pickupTime"))
          : "",
        poNumber: Cookies.get("poNumber")
          ? JSON.parse(Cookies.get("poNumber"))
          : 0,
      },
    ],
    receiver: [
      {
        deliveryName: Cookies.get("deliveryName")
          ? JSON.parse(Cookies.get("deliveryName"))
          : "",
        deliveryAddress: Cookies.get("deliveryAddress")
          ? JSON.parse(Cookies.get("deliveryAddress"))
          : "",
        latitude: Cookies.get("latitudeReceiver")
          ? JSON.parse(Cookies.get("latitudeReceiver"))
          : 0,
        longitude: Cookies.get("longitudeReceiver")
          ? JSON.parse(Cookies.get("longitudeReceiver"))
          : 0,
        deliveryDate: Cookies.get("deliveryDate")
          ? JSON.parse(Cookies.get("deliveryDate"))
          : "",
        deliveryTime: Cookies.get("deliveryTime")
          ? JSON.parse(Cookies.get("deliveryTime"))
          : "",
        deliveryNumber: Cookies.get("deliveryNumber")
          ? JSON.parse(Cookies.get("deliveryNumber"))
          : 0,
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
      : 0,
  });
  // const [currentId, setCurrentId] = useState(0);

  const ref = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();
  const ref8 = useRef();
  const ref9 = useRef();

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

  if (shipmentData.truckId === "") {
    valueTruck = { value: "", label: "Unit Number" }; // Set custom placeholder option
  } else if (shipmentData.truckId !== "" && unit && unit.length !== 0) {
    const selectedUnit = unit.find((em) => em._id === shipmentData.truckId);
    valueTruck = {
      value: selectedUnit,
      label: selectedUnit.unitNumber,
    };

    console.log("value Truck ", valueTruck);
    console.log("selectedUnit", selectedUnit);
  } else {
    valueTruck = unit.find((option) => option.value === shipmentData.truckId);
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
  if (shipmentData.trailerId === "") {
    valueTrailer = { value: "", label: "Trailer Number" }; // Set custom placeholder option
  } else if (shipmentData.trailerId !== "" && trailer && trailer.length !== 0) {
    let selectedTrailer = trailer.find(
      (em) => em._id === shipmentData.trailerId
    );
    valueTrailer = {
      value: selectedTrailer,
      label: selectedTrailer.unitNumber,
    }; // Set custom placeholder option
  } else {
    valueTrailer = trailer.find(
      (option) => option.value === shipmentData.trailerId
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
  if (shipmentData.driverId === "") {
    valueDriver = { value: "", label: "Driver Name" }; // Set custom placeholder option
  } else if (shipmentData.driverId !== "" && driver.length !== 0) {
    console.log("shipmentData.driverId -- ", shipmentData.driverId);
    console.log("driver -- ", driver);
    // console.log(
    //   'value: driver.find((em) => em._id === shipmentData.driverId) = ',
    //   driver.find((em) => em._id === shipmentData.driverId)
    // );
    console.log(
      "driver.find((em) => em._id === shipmentData.driverId)?.fullName => ",
      driver.find((em) => em._id === shipmentData.driverId)
    );
    valueDriver = {
      value: driver.find((em) => em._id === shipmentData.driverId),
      label: driver.find((em) => em._id === shipmentData.driverId)?.fullName,
    };
  } else {
    valueDriver = driver.find(
      (option) => option.value === shipmentData.driverId
    );
  }
  // dropdown Drivers

  console.log("shipment data => ", shipmentData);

  // validation

  const handleUnitNumberBlur = (e) => {
    const value = shipmentData.truckId;
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
    const value = shipmentData.trailerId;
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
    const value = shipmentData.driverId;
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

  const handlePickupNameBlur = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Pickup name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handlePickupAddressBlur = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Pickup address is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handlePickupDateBlur = () => {
    if (shipmentData.shipper[0].pickupDate.trim() === "") {
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

  const handlePickupTimeBlur = () => {
    if (shipmentData.shipper[0].pickupTime.trim() === "") {
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

  const handlePoNumberBlur = (e) => {
    const poNumber = e.target.value;

    if (poNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: "PO Number is required.",
      }));
    } else if (!/^\d+$/.test(poNumber)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: "PO Number must be a valid number.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: "",
      }));
    }
  };

  const handleDeliveryNameBlur = () => {
    if (shipmentData.receiver[0].deliveryName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryName: "Delivery Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryName: "",
      }));
    }
  };

  const handleDeliveryAddressBlur = () => {
    if (shipmentData.receiver[0].deliveryAddress.trim() === "") {
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

  const handleDeliveryDateBlur = () => {
    if (shipmentData.receiver[0].deliveryDate.trim() === "") {
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

  const handleDeliveryTimeBlur = () => {
    if (shipmentData.receiver[0].deliveryTime.trim() === "") {
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

  const handleDeliveryNumberBlur = (e) => {
    const deliveryNumber = e.target.value;

    if (deliveryNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: "Delivery Number is required.",
      }));
    } else if (!/^-?\d*\.?\d+$/.test(deliveryNumber)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: "Delivery Number must be a valid number.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: "",
      }));
    }
  };

  const handleRequiredTempBlur = () => {
    if (shipmentData.temperature.actual.trim() === "") {
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
    if (shipmentData.temperature.min.trim() === "") {
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
    if (shipmentData.temperature.max.trim() === "") {
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
    if (shipmentData.referenceNumber.trim() === "") {
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
    if (shipmentData.comment.trim() === "") {
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
    if (shipmentData.broker.name.trim() === "") {
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
    if (shipmentData.broker.brokerAgent.trim() === "") {
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
    if (shipmentData.broker.brokerPhone.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: "Broker phone is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: "",
      }));
    }
  };

  const handleBrokerhefsonIdBlur = () => {
    if (shipmentData.broker.brokerhefsonId.trim() === "") {
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
    if (shipmentData.dispatchName.trim() === "") {
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

  const firstStepNext = (e) => {
    e.preventDefault();

    if (shipmentData.truckId === "" && shipmentData.trailerId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: "Unit number is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        trailerId: "Trailer Number is required.",
      }));
    } else if (shipmentData.truckId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckId: "Unit number is required.",
      }));
    } else if (shipmentData.trailerId === "") {
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
    if (shipmentData.truckId !== "" && shipmentData.trailerId !== "") {
      setCurrentStep(currentStep + 1);
      Cookies.set("truckId", JSON.stringify(shipmentData.truckId));
      Cookies.set("trailerId", JSON.stringify(shipmentData.trailerId));
    }
  };

  // google place api

  const [selectedPlace, setSelectedPlace] = useState(null);
  const handlePlaceSelected = (place) => {
    setSelectedPlace({
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });

    setShipmentData((prevState) => ({
      ...prevState,
      shipper: [
        {
          ...prevState.shipper[0],
          pickupAddress: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        },
      ],
    }));
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

  const handlePlaceSelectedDelivery = (place) => {
    setSelectedPlaceDelivery({
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });

    setShipmentData((prevState) => ({
      ...prevState,
      receiver: [
        {
          ...prevState.receiver[0],
          deliveryAddress: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        },
      ],
    }));

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
    if (shipmentData.driverId === "") {
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
    if (shipmentData.driverId !== "") {
      setCurrentStep(currentStep + 1);
      Cookies.set("driverId", JSON.stringify(shipmentData.driverId));
    }
  };

  const thirdStepNext = (e) => {
    e.preventDefault();
    // console.log(
    //   'dddddddddoooooo',
    //   shipmentData.receiver[0].deliveryName === '' &&
    //     shipmentData.receiver[0].deliveryAddress === '' &&
    //     shipmentData.receiver[0].deliveryDate === '' &&
    //     shipmentData.receiver[0].deliveryTime === '' &&
    //     shipmentData.receiver[0].deliveryNumber === 0
    // );
    if (
      shipmentData.shipper[0].pickupName === "" &&
      shipmentData.shipper[0].pickupAddress === "" &&
      shipmentData.shipper[0].pickupDate === "" &&
      shipmentData.shipper[0].pickupTime === "" &&
      shipmentData.shipper[0].poNumber === 0 &&
      shipmentData.receiver[0].deliveryName === "" &&
      shipmentData.receiver[0].deliveryAddress === "" &&
      shipmentData.receiver[0].deliveryDate === "" &&
      shipmentData.receiver[0].deliveryTime === "" &&
      shipmentData.receiver[0].deliveryNumber === 0 &&
      shipmentData.temperature.actual === "" &&
      shipmentData.temperature.min === "" &&
      shipmentData.temperature.max === "" &&
      shipmentData.referenceNumber === "" &&
      shipmentData.comment === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupName: "Pickup name is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupAddress: "Pickup address is required",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupDate: "Pickup date is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupTime: "Pickup time is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: "PO number is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryName: "Delivery name is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryAddress: "Delivery address is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryDate: "Delivery date is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: "Delivery time is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: "Delivery number is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureActual: "Temperature is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMin: "Min Temperature is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMax: "Max Temperature is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceNumber: "Reference number is required",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        comment: "Comment is required",
      }));
    } else if (shipmentData.shipper[0].pickupName === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupName: "Pickup name is required",
      }));
    } else if (shipmentData.shipper[0].pickupAddress === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupAddress: "Pickup address is required",
      }));
    } else if (shipmentData.shipper[0].pickupDate === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupDate: "Pickup date is required",
      }));
    } else if (shipmentData.shipper[0].pickupTime === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupTime: "Pickup time is required",
      }));
    } else if (shipmentData.shipper[0].poNumber === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: "PO number is required",
      }));
    } else if (shipmentData.receiver[0].deliveryName === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryName: "Delivery name is required",
      }));
    } else if (shipmentData.receiver[0].deliveryAddress === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryAddress: "Delivery address is required",
      }));
    } else if (shipmentData.receiver[0].deliveryDate === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryDate: "Delivery date is required",
      }));
    } else if (shipmentData.receiver[0].deliveryTime === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: "Delivery time is required",
      }));
    } else if (shipmentData.receiver[0].deliveryNumber === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: "Delivery number is required",
      }));
    } else if (shipmentData.temperature.actual === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureActual: "Temperature is required",
      }));
    } else if (shipmentData.temperature.min === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMin: "Min Temperature is required",
      }));
    } else if (shipmentData.temperature.max === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMax: "Max Temperature is required",
      }));
    } else if (shipmentData.referenceNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceNumber: "Reference number is required",
      }));
    } else if (shipmentData.comment === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        comment: "Comment is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupName: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupAddress: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupDate: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        pickupTime: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        poNumber: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryName: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryAddress: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryDate: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryTime: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        deliveryNumber: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureActual: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMin: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperatureMax: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceNumber: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        comment: null,
      }));
    }
    if (
      shipmentData.shipper[0].pickupName !== "" &&
      shipmentData.shipper[0].pickupAddress !== "" &&
      shipmentData.shipper[0].pickupDate !== "" &&
      shipmentData.shipper[0].pickupTime !== "" &&
      shipmentData.shipper[0].poNumber !== 0 &&
      shipmentData.receiver[0].deliveryName !== "" &&
      shipmentData.receiver[0].deliveryAddress !== "" &&
      shipmentData.receiver[0].deliveryDate !== "" &&
      shipmentData.receiver[0].deliveryTime !== "" &&
      shipmentData.receiver[0].deliveryNumber !== 0 &&
      shipmentData.temperature.actual !== "" &&
      shipmentData.temperature.min !== "" &&
      shipmentData.temperature.max !== "" &&
      shipmentData.referenceNumber !== "" &&
      shipmentData.comment !== ""
    ) {
      setCurrentStep(currentStep + 1);
      Cookies.set(
        "pickupName",
        JSON.stringify(shipmentData.shipper[0].pickupName)
      );
      Cookies.set(
        "pickupAddress",
        JSON.stringify(shipmentData.shipper[0].pickupAddress)
      );
      Cookies.set(
        "pickupDate",
        JSON.stringify(shipmentData.shipper[0].pickupDate)
      );
      Cookies.set(
        "pickupTime",
        JSON.stringify(shipmentData.shipper[0].pickupTime)
      );
      Cookies.set("poNumber", JSON.stringify(shipmentData.shipper[0].poNumber));
      Cookies.set(
        "deliveryName",
        JSON.stringify(shipmentData.receiver[0].deliveryName)
      );
      Cookies.set(
        "deliveryAddress",
        JSON.stringify(shipmentData.receiver[0].deliveryAddress)
      );
      Cookies.set(
        "deliveryDate",
        JSON.stringify(shipmentData.receiver[0].deliveryDate)
      );
      Cookies.set(
        "deliveryTime",
        JSON.stringify(shipmentData.receiver[0].deliveryTime)
      );
      Cookies.set(
        "deliveryNumber",
        JSON.stringify(shipmentData.receiver[0].deliveryNumber)
      );
      Cookies.set("actual", JSON.stringify(shipmentData.temperature.actual));
      Cookies.set("min", JSON.stringify(shipmentData.temperature.min));
      Cookies.set("max", JSON.stringify(shipmentData.temperature.max));
      Cookies.set(
        "referenceNumber",
        JSON.stringify(shipmentData.referenceNumber)
      );
      Cookies.set("comment", JSON.stringify(shipmentData.comment));
    }
  };

  const forthStepNext = (e) => {
    e.preventDefault();

    if (
      shipmentData.broker.name === "" &&
      shipmentData.broker.brokerAgent === "" &&
      shipmentData.broker.brokerPhone === "" &&
      shipmentData.broker.brokerhefsonId === ""
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
    } else if (shipmentData.broker.name === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerName: "Broker name is required.",
      }));
    } else if (shipmentData.broker.brokerAgent === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerAgent: "Broker agent is required.",
      }));
    } else if (shipmentData.broker.brokerPhone === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brokerPhone: "Broker phone is required.",
      }));
    } else if (shipmentData.broker.brokerhefsonId === "") {
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
      shipmentData.broker.name !== "" &&
      shipmentData.broker.brokerAgent !== "" &&
      shipmentData.broker.brokerPhone !== "" &&
      shipmentData.broker.brokerhefsonId !== ""
    ) {
      setCurrentStep(currentStep + 1);
      Cookies.set("name", JSON.stringify(shipmentData.broker.name));
      Cookies.set(
        "brokerAgent",
        JSON.stringify(shipmentData.broker.brokerAgent)
      );
      Cookies.set(
        "brokerPhone",
        JSON.stringify(shipmentData.broker.brokerPhone)
      );
      Cookies.set(
        "brokerhefsonId",
        JSON.stringify(shipmentData.broker.brokerhefsonId)
      );
    }
  };

  const fifthStepNext = (e) => {
    e.preventDefault();

    if (
      shipmentData.dispatchName === "" &&
      shipmentData.carrierPhone === 0 &&
      shipmentData.carrierEmergencyPhone === 0
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
    } else if (shipmentData.dispatchName === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dispatchName: "Dispatch name is required.",
      }));
    } else if (shipmentData.carrierPhone === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carrierPhone: "Carrier phone is required.",
      }));
    } else if (shipmentData.carrierEmergencyPhone === 0) {
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
      shipmentData.dispatchName !== "" &&
      shipmentData.carrierPhone !== 0 &&
      shipmentData.carrierEmergencyPhone !== 0
    ) {
      // setCurrentStep(currentStep + 1);
      console.log("Completed step -- ", shipmentData);
      Cookies.set("dispatchName", JSON.stringify(shipmentData.dispatchName));
      Cookies.set("carrierPhone", JSON.stringify(shipmentData.carrierPhone));
      Cookies.set(
        "carrierEmergencyPhone",
        JSON.stringify(shipmentData.carrierEmergencyPhone)
      );
      dispatch(updateShipment(id, shipmentData));
    }
  };
  console.log("vsssssssss => ", valueTruck);
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
                          label: option.unitNumber,
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
                    <p className="text-primary mt-3">New Unit</p>
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

                    <div class="form-check mt-4">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label class="form-check-label" for="flexCheckDefault">
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
                          label: option.unitNumber,
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
                    <p className="text-primary mt-3">New Trailer</p>
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

                    <div class="form-check mt-4">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label class="form-check-label" for="flexCheckDefault">
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
                    <p className="text-primary mt-3">New Driver</p>
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
                    <div class="form-check mt-4">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label class="form-check-label" for="flexCheckDefault">
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
                  <div className="col-md-6">
                    <div className="spaceBetween">
                      <p>Shipper Info</p>
                      <p className="text-primary">Add Shipper</p>
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Pick Up Name"
                        className="form-control"
                        value={shipmentData.shipper[0].pickupName}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            shipper: [
                              {
                                ...prevState.shipper[0],
                                pickupName: e.target.value,
                              },
                            ],
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            pickupName: null,
                          }));
                        }}
                        name="pickupName"
                        onBlur={handlePickupNameBlur}
                        required
                      />
                      {errors.pickupName && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.pickupName}
                        </h6>
                      )}
                    </div>
                    <div className="inputField">
                      <Autocomplete
                        apiKey={process.env.REACT_APP_MAP_API}
                        options={{
                          suppressDefaultStyles: true,
                          types: ["address"],
                        }}
                        placeholder="Pick Up Address"
                        onPlaceSelected={handlePlaceSelected}
                        onBlur={handlePickupAddressBlur}
                        name="pickupAddress"
                        required
                        defaultValue={shipmentData.shipper[0].pickupAddress}
                        className="form-control"
                      />
                    </div>
                    {errors.pickupAddress && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.pickupAddress}
                      </h6>
                    )}

                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Pick Up Date"
                        ref={ref6}
                        onFocus={() => (ref6.current.type = "date")}
                        value={shipmentData.shipper[0].pickupDate}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            shipper: [
                              {
                                ...prevState.shipper[0],
                                pickupDate: e.target.value,
                              },
                            ],
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            pickupDate: null,
                          }));
                        }}
                        name="pickupDate"
                        onBlur={() => {
                          ref6.current.type = "text";
                          handlePickupDateBlur();
                        }}
                        required
                      />
                      {errors.pickupDate && (
                        <div className="text-danger validation-error mt-2">
                          {errors.pickupDate}
                        </div>
                      )}
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Pick Up Time"
                        ref={ref7}
                        onFocus={() => (ref7.current.type = "time")}
                        value={shipmentData.shipper[0].pickupTime}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            shipper: [
                              {
                                ...prevState.shipper[0],
                                pickupTime: e.target.value,
                              },
                            ],
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            pickupTime: null,
                          }));
                        }}
                        name="pickupTime"
                        onBlur={() => {
                          ref7.current.type = "text";
                          handlePickupTimeBlur();
                        }}
                        required
                      />
                      {errors.pickupTime && (
                        <div className="text-danger validation-error mt-2">
                          {errors.pickupTime}
                        </div>
                      )}
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="PO Number"
                        className="form-control"
                        value={
                          shipmentData.shipper[0].poNumber === 0
                            ? null
                            : shipmentData.shipper[0].poNumber
                        }
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          setShipmentData((prevState) => ({
                            ...prevState,
                            shipper: [
                              {
                                ...prevState.shipper[0],
                                poNumber: newValue,
                              },
                            ],
                          }));

                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            poNumber: null,
                          }));
                        }}
                        name="poNumber"
                        onBlur={handlePoNumberBlur}
                        required
                      />

                      {errors.poNumber && (
                        <div className="text-danger validation-error mt-2">
                          {errors.poNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="spaceBetween">
                      <p>Receiver Info</p>
                      <p className="text-primary">Add Receiver</p>
                    </div>

                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Delivery Name"
                        className="form-control"
                        value={shipmentData.receiver[0].deliveryName}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            receiver: [
                              {
                                ...prevState.receiver[0],
                                deliveryName: e.target.value,
                              },
                            ],
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            deliveryName: null,
                          }));
                        }}
                        name="deliveryName"
                        onBlur={() => {
                          handleDeliveryNameBlur();
                        }}
                        required
                      />
                      {errors.deliveryName && (
                        <div className="text-danger validation-error mt-2">
                          {errors.deliveryName}
                        </div>
                      )}
                    </div>
                    <div className="inputField">
                      <Autocomplete
                        apiKey={process.env.REACT_APP_MAP_API}
                        options={{
                          suppressDefaultStyles: true,
                          types: ["address"],
                        }}
                        placeholder="Delivery Address"
                        onPlaceSelected={handlePlaceSelectedDelivery}
                        onBlur={handleDeliveryAddressBlur}
                        name="deliveryAddress"
                        required
                        defaultValue={shipmentData.receiver[0].deliveryAddress}
                        className="form-control"
                      />
                    </div>
                    {errors.deliveryAddress && (
                      <div className="text-danger validation-error mt-2">
                        {errors.deliveryAddress}
                      </div>
                    )}

                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Pick Up Date"
                        ref={ref8}
                        onFocus={() => (ref8.current.type = "date")}
                        value={shipmentData.receiver[0].deliveryDate}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            receiver: [
                              {
                                ...prevState.receiver[0],
                                deliveryDate: e.target.value,
                              },
                            ],
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            deliveryDate: null,
                          }));
                        }}
                        name="deliveryDate"
                        onBlur={() => {
                          ref8.current.type = "text";
                          handleDeliveryDateBlur();
                        }}
                        required
                      />
                      {errors.deliveryDate && (
                        <div className="text-danger validation-error mt-2">
                          {errors.deliveryDate}
                        </div>
                      )}
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Pick Up Time"
                        ref={ref9}
                        onFocus={() => (ref9.current.type = "time")}
                        value={shipmentData.receiver[0].deliveryTime}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            receiver: [
                              {
                                ...prevState.receiver[0],
                                deliveryTime: e.target.value,
                              },
                            ],
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            deliveryTime: null,
                          }));
                        }}
                        name="deliveryTime"
                        onBlur={() => {
                          ref9.current.type = "text";
                          handleDeliveryTimeBlur();
                        }}
                        required
                      />
                      {errors.deliveryTime && (
                        <div className="text-danger validation-error mt-2">
                          {errors.deliveryTime}
                        </div>
                      )}
                    </div>
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder={
                          shipmentData.receiver[0].deliveryNumber === 0
                            ? "Delivery Number"
                            : ""
                        }
                        className="form-control"
                        value={
                          shipmentData.receiver[0].deliveryNumber === 0
                            ? null
                            : shipmentData.receiver[0].deliveryNumber
                        }
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          setShipmentData((prevState) => ({
                            ...prevState,
                            receiver: [
                              {
                                ...prevState.receiver[0],
                                deliveryNumber: newValue,
                              },
                            ],
                          }));

                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            deliveryNumber: "",
                          }));
                        }}
                        name="deliveryNumber"
                        onBlur={handleDeliveryNumberBlur}
                        required
                      />
                      {errors.deliveryNumber && (
                        <div className="text-danger validation-error mt-2">
                          {errors.deliveryNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Required Temperature °F"
                        className="form-control"
                        value={shipmentData.temperature.actual}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            temperature: {
                              ...prevState.temperature,
                              actual: e.target.value,
                            },
                          }));
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
                      {errors.temperatureActual && (
                        <div className="text-danger validation-error mt-2">
                          {errors.temperatureActual}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Minimum Threshold °F"
                        className="form-control"
                        value={shipmentData.temperature.min}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            temperature: {
                              ...prevState.temperature,
                              min: e.target.value,
                            },
                          }));
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
                      {errors.temperatureMin && (
                        <div className="text-danger validation-error mt-2">
                          {errors.temperatureMin}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Maximum Threshold °F"
                        className="form-control"
                        value={shipmentData.temperature.max}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            temperature: {
                              ...prevState.temperature,
                              max: e.target.value,
                            },
                          }));
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
                      {errors.temperatureMax && (
                        <div className="text-danger validation-error mt-2">
                          {errors.temperatureMax}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Reference Number"
                        className="form-control"
                        value={shipmentData.referenceNumber}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            referenceNumber: e.target.value,
                          }));
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
                      {errors.referenceNumber && (
                        <div className="text-danger validation-error mt-2">
                          {errors.referenceNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Comment"
                        className="form-control"
                        value={shipmentData.comment}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            comment: e.target.value,
                          }));
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
                      {errors.comment && (
                        <div className="text-danger validation-error mt-2">
                          {errors.comment}
                        </div>
                      )}
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
                        value={shipmentData.broker.name}
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
                      {errors.brokerName && (
                        <div className="text-danger validation-error mt-2">
                          {errors.brokerName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Broker Agent"
                        className="form-control"
                        value={shipmentData.broker.brokerAgent}
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
                      {errors.brokerAgent && (
                        <div className="text-danger validation-error mt-2">
                          {errors.brokerAgent}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="form-control"
                        value={shipmentData.broker.brokerPhone}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            broker: {
                              ...prevState.broker,
                              brokerPhone: e.target.value,
                            },
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            brokerPhone: "",
                          }));
                        }}
                        name="brokerPhone"
                        onBlur={() => {
                          handleBrokerPhoneBlur();
                        }}
                        required
                      />
                      {errors.brokerPhone && (
                        <div className="text-danger validation-error mt-2">
                          {errors.brokerPhone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Hefson ID"
                        className="form-control"
                        value={shipmentData.broker.brokerhefsonId}
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
                      {errors.brokerhefsonId && (
                        <div className="text-danger validation-error mt-2">
                          {errors.brokerhefsonId}
                        </div>
                      )}
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
                        value={shipmentData.dispatchName}
                        onChange={(e) => {
                          setShipmentData((prevState) => ({
                            ...prevState,
                            dispatchName: e.target.value,
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            dispatchName: "",
                          }));
                        }}
                        name="dispatchName"
                        onBlur={() => {
                          handleDispatchNameBlur();
                        }}
                        required
                      />
                      {errors.dispatchName && (
                        <div className="text-danger validation-error mt-2">
                          {errors.dispatchName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="form-control"
                        value={
                          shipmentData.carrierPhone === 0
                            ? null
                            : shipmentData.carrierPhone
                        }
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          setShipmentData((prevState) => ({
                            ...prevState,
                            carrierPhone: newValue,
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            carrierPhone: "",
                          }));
                        }}
                        name="carrierPhone"
                        onBlur={handleCarrierPhoneBlur}
                        required
                      />
                      {errors.carrierPhone && (
                        <div className="text-danger validation-error mt-2">
                          {errors.carrierPhone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="inputField">
                      <input
                        type="text"
                        placeholder="Emergency Contact Number "
                        className="form-control"
                        value={
                          shipmentData.carrierEmergencyPhone === 0
                            ? null
                            : shipmentData.carrierEmergencyPhone
                        }
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          setShipmentData((prevState) => ({
                            ...prevState,
                            carrierEmergencyPhone: newValue,
                          }));

                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            carrierEmergencyPhone: "",
                          }));
                        }}
                        name="carrierEmergencyPhone"
                        onBlur={handleCarrierEmergencyPhoneBlur}
                        required
                      />
                      {errors.carrierEmergencyPhone && (
                        <div className="text-danger validation-error mt-2">
                          {errors.carrierEmergencyPhone}
                        </div>
                      )}
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
                      onClick={fifthStepNext}
                    >
                      Confirm & Update Shipment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="newShipment">
      <ToolBox />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center my-5">Update Shipment</h2>
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
          ) : (
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
          )}
          {loading === false && renderFormFields()}
        </div>
      </div>
    </div>
  );
};

export default UpdateShipment;

import { useDispatch, useSelector } from "react-redux";
import {
  createTrailer,
  deleteTrailer,
  list,
  listSearch,
  updateCheckbox,
  updateTrailer,
} from "../actions/trailer";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import React, { useEffect, useRef, useState } from "react";
import { ProgressCircular } from "ui-neumorphism";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import TrailerMap from "../components/TrailerMap/TrailerMap";
import { listDevice } from "../actions/device";
import Moment from "react-moment";
import swal from "sweetalert";
import Select from "react-select";
import { PropagateLoader } from "react-spinners";

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

let trailerToUpdate = {};

const Trailers = () => {
  const ref = useRef();
  const ref2 = useRef();
  const dispatch = useDispatch();
  const [manufacture, setManufacture] = useState([]);
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    dispatch(list(1, 100));
    dispatch(listDevice(1, 10));
    setMfgData();
    setSensorData();
    // Initialize tooltip when the component mounts
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);
  const { loading, trailer, Length } = useSelector(
    (state) => state.trailerReducer
  );

  const { device } = useSelector((state) => state.deviceReducer);
  async function setMfgData() {
    const getManufactur = await axios.get(
      `${baseURL}/manufacture/list?limit=10&page=1&type=2`,
      header
    );
    // setManufacture(getManufactur?.data?.data?.data);
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
    if (getSensor?.data?.data?.data.length > 0 && sensors.length === 0) {
      await setSensors(getSensor?.data?.data?.data);
    }
  }
  const [trailerData, setTrailerData] = useState({
    unitNumber: "",
    manufacturer: "",
    modelYear: "",
    numberPlate: "",
    registrationExpiry: "",
    state: "",
    image: "",
    engineHours: "",
    sensorId: "",
  });
  const [sensors, setSensors] = useState([]);

  const [uploading, setUploading] = useState(false);

  const uploadImageHandler = (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("uploadImage", file);
    bodyFormData.append("folderName", "trailer");
    setUploading(true);
    axios
      .post(`${baseURL}/file/upload-image`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: loginToken,
        },
      })
      .then((response) => {
        console.log("response.data => ", response.data.data);
        setTrailerData({ ...trailerData, image: response.data.data });

        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
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
      engineHours: trailerData.engineHours,
      sensorId: trailerData.sensorId,
    };
    const hasError = Object.values(errors).some((error) => error);
    if (!hasError) {
      if (currentId === 0) dispatch(createTrailer(createTrailerSendData));
      else {
        dispatch(updateTrailer(currentId, trailerData));
      }
      clear();
    }
  };

  const editHandler = async (e, ID) => {
    e.preventDefault();
    await setCurrentId(ID);
    const getDetailTrailer = await axios.get(
      `${baseURL}/trailer/getDetail/${ID}`,
      header
    );

    trailerToUpdate = getDetailTrailer?.data?.data[0];

    setTrailerData({
      unitNumber: trailerToUpdate?.unitNumber,
      manufacturer: trailerToUpdate?.manufacturer,
      modelYear: trailerToUpdate?.modelYear.slice(0, 10),
      numberPlate: trailerToUpdate?.numberPlate,
      registrationExpiry: trailerToUpdate?.registrationExpiry.slice(0, 10),
      state: trailerToUpdate?.state,
      engineHours: trailerToUpdate?.engineHours,
      sensorId: trailerToUpdate?.sensorId,
    });
  };

  const deleteHandler = async (e, ID, trailerToDelete) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: `You want to delete trailer ${trailerToDelete}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Trailer ${trailerToDelete} is deleted successfully`, {
          icon: "success",
        });
        dispatch(deleteTrailer(ID)); //delete action
        clear();
      }
    });
  };

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

  const handleCheckbox = async (checked, dataId, driverToDisable) => {
    swal({
      title: "Are you sure?",
      text: `You want to ${
        checked === false ? "disable" : "enable"
      } unit ${driverToDisable}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDisable) => {
      if (willDisable) {
        swal(
          `Unit ${driverToDisable} is ${
            checked === false ? "disabled" : "enabled"
          } successfully`,
          {
            icon: "success",
          }
        );
        dispatch(updateCheckbox(dataId, checked)); //update checkbox
      }
    });
  };

  const [currentId, setCurrentId] = useState(0);
  const clear = () => {
    setCurrentId(0);
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
    setSelectedOption(null);
    setSelectedOptionSensor(null);
    setSelectedOptionState(null);
  };
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
  };
  let value = null;
  if (currentId === 0 && trailerData.manufacturer === "") {
    value = { value: "", label: "Manufacturer" }; // Set custom placeholder option
  } else if (currentId !== 0 && trailerData.manufacturer !== "") {
    value = {
      value: trailerData.manufacturer,
      label: manufacture.find((em) => em._id === trailerData.manufacturer).name,
    }; // Set custom placeholder option
  } else {
    value = manufacture.find(
      (option) => option.value === trailerData.manufacturer
    );
  }
  // dropdown manufacturer

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
  if (currentId === 0 && trailerData.sensorId === "") {
    valueSensor = { value: "", label: "Sensor Id" }; // Set custom placeholder option
  } else if (currentId !== 0 && trailerData.sensorId !== "") {
    valueSensor = {
      value: trailerData.sensorId,
      label: sensors?.find((em) => em._id === trailerData.sensorId).FAssetID,
    }; // Set custom placeholder option
  } else {
    valueSensor = sensors.find(
      (option) => option.value === trailerData.sensorId
    );
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
  };
  let valueState = null;
  if (currentId === 0 && trailerData.state === "") {
    valueState = { value: "", label: "Select State" }; // Set custom placeholder option
  } else {
    valueState = { value: trailerData.state, label: trailerData.state };
  }
  // dropdown value state

  const [errors, setErrors] = useState({});

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
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sensorId: "Unit Number is required.",
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

  const validateNumberField = (myNumber) => {
    const numberRegEx = /\-?\d*\.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
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

  const [reloadMap, setReloadMap] = useState(false); // State for triggering map reload
  const handleReloadMap = () => {
    setReloadMap(!reloadMap); // Toggle reloadMap state to trigger map reload
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching --- ", e.target.value);
    dispatch(listSearch(1, 100, e.target.value));
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };
  return (
    <div className="dashboard">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} />
        <div className="row ms-sm-4 ms-0">
          <div className="col-lg-5">
            <div className="row">
              <div className="col-12">
                <div className="searchcontent mt-2 mt-md-5 mw-100">
                  <div className="searchBox">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      onChange={handleSearch}
                    />
                    <div className="searchIcon">
                      <img src="./assets/icons/Search.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-30 viewallContainer">
              <div className="col-12">
                <div className="row mb-3">
                  <div className="col">
                    <div className="spaceBetween">
                      <h5>Recent Trailers</h5>
                      <Link to="/TrailersList">
                        View All{" "}
                        <img src="./assets/icons/rightArrowBlue.svg" alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="homeNavigation">
                      {loading ? (
                        <div className="loader">
                          <PropagateLoader
                            cssOverride={override}
                            size={8}
                            color={"#000"}
                            loading={loading}
                          />
                        </div>
                      ) : trailer?.length === 0 ? (
                        <h5>No trailer found</h5>
                      ) : (
                        trailer &&
                        trailer.slice(0, 8).map((data) => (
                          <div className="navBtnBox">
                            <div className="navBtn">
                              <div className="navTools">
                                <div
                                  className={
                                    data?.isActive === true
                                      ? "onlineDot"
                                      : "offlineDot"
                                  }
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    await handleCheckbox(
                                      !data?.isActive,
                                      data?._id,
                                      data?.unitNumber
                                    );
                                  }}
                                  data-bs-toggle="tooltip"
                                  title={
                                    data?.isActive === true
                                      ? "Disable"
                                      : "Enable"
                                  }
                                ></div>

                                <div className="editBox">
                                  <i
                                    className="fa-solid fa-pencil"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addtrailers"
                                    onClick={async (e) =>
                                      await editHandler(e, data?._id)
                                    }
                                    title="Edit"
                                  ></i>
                                  <i
                                    className="fa-solid fa-trash-can"
                                    title="Delete"
                                    onClick={async (e) => {
                                      await deleteHandler(
                                        e,
                                        data?._id,
                                        data?.unitNumber
                                      );
                                    }}
                                  ></i>
                                </div>
                              </div>
                              <Link to={`/trailers-moreinfo/${data?._id}`}>
                                <img
                                  src={data?.manufactureInfo?.image}
                                  alt=""
                                />
                              </Link>
                            </div>
                            <p className="mt-15">{data?.unitNumber}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id="addtrailers"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered custom-width">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          {!currentId ? "Add New Trailer" : "Update Trailer"}
                        </h5>

                        <button
                          type="button"
                          className="btn-closed"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => clear()}
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
                                value={trailerData.unitNumber}
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
                                onBlur={(e) => handleSensorIdBlur(e)}
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
                                value={trailerData.modelYear}
                                onChange={(e) =>
                                  setTrailerData({
                                    ...trailerData,
                                    modelYear: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="inputField">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Number Plate"
                                value={trailerData.numberPlate}
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
                                placeholder={
                                  trailerData.engineHours || "Engine Hours"
                                }
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
                                value={trailerData.registrationExpiry}
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
                                value={selectedOptionState || valueState}
                                onChange={handleChangeOptionsState}
                                options={stateOptions}
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
                            onClick={() => clear()}
                          >
                            Back
                          </button>

                          <button
                            type="button"
                            className="btn"
                            data-bs-dismiss="modal"
                            onClick={async (e) => {
                              await deleteHandler(
                                e,
                                currentId,
                                trailerData.unitNumber
                              );
                            }}
                          >
                            Delete
                          </button>
                          {!uploading && (
                            <div data-bs-dismiss="modal">
                              <button
                                type="button"
                                className="btn"
                                onClick={submitHandler}
                              >
                                {!currentId ? "Add Trailer" : "Update Trailer"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ToolBox />
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
                      <h6>{sensor?.realTimeData?.FTemperature1.toFixed(1)}</h6>

                      <div className="iconBox">
                        <img src="./assets/icons/battery.svg" alt="" />
                      </div>
                      <h6>{sensor?.realTimeData?.FBattery}%</h6>
                      <div className="locaion">
                        <img src="./assets/icons/gps.svg" alt="" />
                      </div>
                      {!sensor?.trailerData?.unitNumber ? (
                        ""
                      ) : (
                        <div className="back" title="Trailer detail">
                          <Link
                            to={`/trailers-moreinfo/${sensor?.trailerData?._id}`}
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

          {device ? (
            <div className="col-lg-7 mapSection">
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
          ) : (
            <h4>Sensor coordinates not available</h4>
          )}
        </div>
        <div className="container graphRow">
          <div className="row my-5">
            <div className="col-12 text-center ">
              <h3>Total Trip Hours</h3>
            </div>
            <div className="col-12">
              <div className="row">
                {trailer.map((data) => (
                  <div className="col-lg-2 col-md-3 col-sm-4 col-6 my-5">
                    <div className="graphBox">
                      <ProgressCircular
                        size={134}
                        width={3}
                        value={(data.currentHours / 4000) * 100}
                        color={
                          data.currentHours < 2500
                            ? "var(--success)"
                            : data.currentHours > 2500 &&
                              data.currentHours < 3000
                            ? "var(--warning)"
                            : data.currentHours > 3000
                            ? "var(--error)"
                            : "var(--error)"
                        }
                      />
                      <div className="textBox text-center">
                        <p className="mb-0">Trip</p>
                        <h2 className="mb-0 text-center">
                          {data.currentHours}
                        </h2>
                        <p className="mb-0">Hours</p>
                      </div>
                      <h4 className="mt-20">{data.unitNumber}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trailers;

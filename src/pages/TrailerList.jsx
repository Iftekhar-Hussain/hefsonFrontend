import { useEffect, useRef, useState } from "react";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { useDispatch, useSelector } from "react-redux";
import {
  createTrailer,
  deleteTrailer,
  list,
  updateCheckbox,
  updateTrailer,
} from "../actions/trailer";
import Cookies from "js-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CalenderIcon from "../assets/icons/CalendarDate.svg";
import HeaderComponentTrailer from "../components/Header/HeaderComponentTrailer";
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

const TrailerList = () => {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [unitState, setUnitState] = useState([]);

  const dispatch = useDispatch();
  const loginToken = Cookies.get("loginToken")
    ? JSON.parse(Cookies.get("loginToken"))
    : null;

  // let trailer = null;

  useEffect(() => {
    if (loginToken === null) {
      window.location.replace("/login");
    }

    dispatch(list(1, 10));
    setMfgData();
    setSensorData();
    setUnitStateData();
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

  const [manufacture, setManufacture] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [posts, setPosts] = useState(trailer?.data?.data || []);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(2);
  const [currentId, setCurrentId] = useState(0);
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
      clear();
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

  // State/Provice

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
  } else if (currentId != 0 && trailerData.state != "") {
    valueStates = {
      value: trailerData.state,
      label: trailerData.state,
    }; // Set custom placeholder option
  } else {
    valueStates = unitState.find(
      (option) => option.value === trailerData.state
    );
  }
  // dropdown State

  async function setInitialData() {
    if (trailer?.data?.data?.length > 0 && posts.length === 0) {
      await setPosts((prev) => [...prev, ...trailer?.data?.data]);
    }
  }
  setInitialData();
  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(pageNumber * (pageNumber - 1))) {
        setHasMore(false);
      } else {
        setHasMore(true); //false
        dispatch(list(pageNumber, 10));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };

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
      engineHours: "",
      sensorId: "",
    });
    setSelectedOption(null);
    setSelectedOptionSensor(null);
    setSelectedOptionState(null);
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
      if (currentId === 0) {
        dispatch(createTrailer(createTrailerSendData));
      } else {
        dispatch(updateTrailer(currentId, trailerData));
      }
      clear();
      closePopup();
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
  } else if (currentId !== 0 && trailerData.manufacturer !== "") {
    value = {
      value: trailerData.manufacturer,
      label: manufacture?.find((em) => em._id === trailerData.manufacturer)?.name,
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      sensorId: null,
    }));
  };
  let valueSensor = null;
  if (currentId === 0 && trailerData.sensorId === "") {
    valueSensor = { value: "", label: "Sensor Id" }; // Set custom placeholder option
  } else if (currentId !== 0 && trailerData.sensorId !== "") {
    valueSensor = {
      value: trailerData.sensorId,
      label: sensors?.find((em) => em._id === trailerData.sensorId)?.FAssetID,
    }; // Set custom placeholder option
  } else {
    valueSensor = sensors?.find(
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

  const handleCheckbox = async (checked, dataId, unitToDisable) => {
    swal({
      title: "Are you sure?",
      text: `You want to ${
        checked === false ? "disable" : "enable"
      } unit ${unitToDisable}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDisable) => {
      if (willDisable) {
        swal(
          `Unit ${unitToDisable} is ${
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
  let titleProp = "Trailers";

  const override = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "50px ",
    borderColor: "red",
  };

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <HeaderComponentTrailer
          titleProp={titleProp}
          searching={true}
          shipment={false}
          driver={true}
        />
        <div className="row">
          <div className="col-12">
            <div className="spaceBetween">
              <div className=""></div>
              <button type="button" className="btn" onClick={openPopup}>
                Add New Trailer
              </button>
            </div>
          </div>
        </div>
        <div className="row ms-4">
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
            manufacture &&
            sensors &&
            unitState && (
              <InfiniteScroll
                dataLength={trailer?.length}
                hasMore={hasMore}
                next={() => fetchDataOnScroll()}
                loader={
                  trailer?.length === 0 || trailer?.length === Length ? (
                    ""
                  ) : (
                    <h4>Loading...</h4>
                  )
                }
                endMessage={
                  <div className="row">
                    <div className="col text-center">
                      <p style={{ textAlign: "center" }}>
                        <b>
                          {trailer?.length === 0
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
                {trailer?.length === 0 ? (
                  <h4>No trailers to list. Please add some trailer to show</h4>
                ) : (
                  trailer.map((data) => (
                    <div className="col-md-2 col-sm-3 col-4 mt-3 text-center">
                      <div className="devices">
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
                                !data.isActive,
                                data._id,
                                data.unitNumber
                              );
                            }}
                            data-bs-toggle="tooltip"
                            title={
                              data?.isActive === true ? "Disable" : "Enable"
                            }
                          ></div>

                          <div className="editBox">
                            <i
                              class="fa-solid fa-pencil"
                              onClick={async (e) => {
                                await editHandler(e, data?._id);
                                openPopup();
                              }}
                              title="Edit"
                            ></i>
                            <i
                              class="fa-solid fa-trash-can"
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
                            className="mt-3"
                          />
                        </Link>
                      </div>
                      <h6 className="mt-3">{data.unitNumber}</h6>
                    </div>
                  ))
                )}
              </InfiniteScroll>
            )
          )}
        </div>

        {isOpen && (
          <div className="popup-container" onClick={closePopupBlur}>
            <div className="popup" ref={popupRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {!currentId ? "Add New Trailer" : "Update Trailer"}
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

                    {currentId !== 0 && (
                      <button
                        type="button"
                        className="btn"
                        onClick={async (e) => {
                          await deleteHandler(
                            e,
                            currentId,
                            trailerData.unitNumber
                          );
                          closePopup();
                        }}
                      >
                        Delete
                      </button>
                    )}
                    {!uploading && (
                      <div>
                        <button
                          type="button"
                          className="btn"
                          onClick={(e) => {
                            submitHandler(e);
                          }}
                        >
                          {!currentId ? "Add Trailer" : "Update Trailer"}
                        </button>
                      </div>
                    )}
                  </div>
                  {/* <button type="button" className="btn">
                Save changes
              </button> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToolBox />
    </div>
  );
};

export default TrailerList;

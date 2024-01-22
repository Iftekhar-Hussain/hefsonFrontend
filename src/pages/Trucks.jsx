import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createUnit,
  deleteUnit,
  list,
  update,
  updateCheckbox,
} from "../actions/truck";
import axios from "axios";
import Cookies from "js-cookie";
import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import Select from "react-select";
import swal from "sweetalert";
import { PropagateLoader, ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CalenderIcon from "../assets/icons/CalendarDate.svg";

import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";

const baseURL = process.env.REACT_APP_BASEURL;
const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;
const header = {
  headers: {
    Authorization: loginToken,
  },
};
let unitToUpdate = {};
const Trucks = () => {
  const ref = useRef(null);
  const ref2 = useRef(null);

  const titleProp = JSON.parse(Cookies.get("businessName"));

  //infinite scroll
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(list(1, 10));
    setMfgData();
    setUnitStateData();

    // Initialize tooltip when the component mounts
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const { loading, unit, Length } = useSelector((state) => state.truckReducer);

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [currentId, setCurrentId] = useState(0);
  const [manufacture, setManufacture] = useState([]);
  const [unitState, setUnitState] = useState([]);
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

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(10 * (pageNumber - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(list(pageNumber, 10));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };

  const [unitData, setUnitData] = useState({
    unitNumber: "",
    manufacture: "",
    modelYear: null,
    truckColor: "",
    numberPlate: "",
    registrationExpiry: null,
    state: "",
  });

  const handleDateChangeModelYear = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setUnitData({
        ...unitData,
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
      setUnitData({
        ...unitData,
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

  const clear = () => {
    setCurrentId(0);
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

  const [uploading, setUploading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      unitData?.unitNumber === "" &&
      unitData?.manufacture === "" &&
      unitData?.modelYear === null &&
      unitData?.truckColor === "" &&
      unitData?.numberPlate === "" &&
      unitData?.registrationExpiry === null &&
      unitData?.state === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: "Unit number is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        manufacture: "Manufacturer is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: "Model year is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckColor: "Unit color is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: "Number plate is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: "Registration expiry is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required.",
      }));
    } else if (unitData?.unitNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: "Unit number is required.",
      }));
    } else if (unitData?.modelYear === null) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: "Model year is required.",
      }));
    } else if (unitData?.numberPlate === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: "Number plate is required.",
      }));
    } else if (unitData?.state === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required.",
      }));
    } else if (unitData?.registrationExpiry === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: "Registration expiry is required.",
      }));
    } else if (unitData?.manufacture === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        manufacture: "Manufacturer is required.",
      }));
    } else if (unitData?.truckColor === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckColor: "Unit color is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        manufacture: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        modelYear: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckColor: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationExpiry: "Registration expiry is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: null,
      }));
    }

    if (
      unitData?.unitNumber !== "" &&
      unitData?.manufacture !== "" &&
      unitData?.modelYear !== null &&
      unitData?.truckColor !== "" &&
      unitData?.numberPlate !== "" &&
      unitData?.registrationExpiry !== null &&
      unitData?.state !== ""
    ) {
      // Submit the form
      if (currentId === 0) {
        dispatch(createUnit(unitData));
        closePopup();
      } else {
        dispatch(update(currentId, unitData));
        closePopup();
      }
      clear();
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

  //fill update data on click of pencil icon
  const editHandler = async (e, ID) => {
    e.preventDefault();
    setErrors({});
    await setCurrentId(ID);
    const getDetailUnit = await axios.get(
      `${baseURL}/truck/getDetail/${ID}`,
      header
    );

    unitToUpdate = getDetailUnit?.data?.data[0];

    setUnitData({
      ...unitData,
      unitNumber: unitToUpdate.unitNumber,
      manufacture: unitToUpdate.manufacture,
      modelYear: unitToUpdate.modelYear.substring(0, 10),
      truckColor: unitToUpdate.truckColor,
      numberPlate: unitToUpdate.numberPlate,
      registrationExpiry: unitToUpdate.registrationExpiry.substring(0, 10),
      state: unitToUpdate.state,
    });
  };

  const deleteHandler = async (e, ID, unitToDelete) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: `You want to delete unit ${unitToDelete}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Unit ${unitToDelete} is deleted successfully`, {
          icon: "success",
        });
        dispatch(deleteUnit(ID)); //delete action
      }
    });
  };

  // validation
  const [errors, setErrors] = useState({});

  const handleUnitNumberBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: "Unit number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        unitNumber: null,
      }));
    }
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

  const handleStateBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: null,
      }));
    }
  };

  // validation end

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      truckColor: null,
    }));
  };
  let valueColor = null;
  if (currentId === 0 && unitData.manufacture === "") {
    valueColor = { value: "", label: "Unit Color" }; // Set custom placeholder option
  } else if (currentId != 0 && unitData.manufacture != "") {
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
    // valueColor = { value: "", label: "Unit Color" };
  }
  // dropdown manufacturer color

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      manufacture: null,
    }));
    setSelectedOptionColor({ value: "", label: "Unit Color" });
    setErrors((prevErrors) => ({
      ...prevErrors,
      truckColor: "Unit color is required.",
    }));
    // valueColor = { value: "", label: "Unit Color" };
  };
  let value = null;
  if (currentId === 0 && unitData.manufacture === "") {
    value = { value: "", label: "Manufacturer" }; // Set custom placeholder option
  } else if (currentId != 0 && unitData.manufacture != "") {
    value = {
      value: unitData.manufacture,
      label: manufacture.find((em) => em._id === unitData.manufacture).name,
    }; // Set custom placeholder option
  } else {
    value = manufacture.find((option) => option.value === unitData.manufacture);
  }
  // dropdown manufacturer

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      state: null,
    }));
  };

  let valueState = null;
  if (currentId === 0 && unitData.state === "") {
    valueState = { value: "", label: "State/Provice" }; // Set custom placeholder option
  } else if (currentId != 0 && unitData.state != "") {
    valueState = {
      value: unitData.state,
      label: unitData.state,
    }; // Set custom placeholder option
  } else {
    valueState = unitState.find((option) => option.value === unitData.state);
  }
  // dropdown manufacturer color

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  return (
    <div className="units">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} />
        <div className="row mx-sm-2 mx-0">
          <div className="col-12">
            <div className="UnitTop spaceBetween">
              <h4 className="text-capitalize">
                {JSON.parse(Cookies.get("businessName"))
                  .charAt(0)
                  .toUpperCase() +
                  JSON.parse(Cookies.get("businessName")).slice(1)}
              </h4>
              <button type="button" className="btn" onClick={openPopup}>
                Add New Unit
              </button>
            </div>
          </div>
        </div>

        <div className="row mx-sm-2 mx-0">
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
            <InfiniteScroll
              dataLength={unit?.length}
              hasMore={hasMore}
              next={() => fetchDataOnScroll()}
              loader={
                unit?.length === 0 || unit?.length === Length ? null : (
                  <div className="loader">
                    <ClipLoader size={30} color={"#000"} loading={loading} />
                  </div>
                )
              }
              endMessage={
                <div className="row">
                  <div className="col text-center">
                    <p style={{ textAlign: "center" }}>
                      <b>
                        {unit?.length === 0 ? "" : "Yay! You have seen it all"}
                      </b>
                    </p>
                  </div>
                </div>
              }
              style={{ display: "flex", flexWrap: "wrap" }} //define style here
              className="row"
            >
              {unit?.length === 0 ? (
                <h4 className="mt-4">
                  No unit to list. Please add some unit to show
                </h4>
              ) : (
                unit.map((data, index) => (
                  <div className="col-lg-4 col-md-6 my-3" key={index}>
                    <div className="unitBox">
                      <div className="row mb-2">
                        <div className="col-12">
                          <div className="spaceBetween">
                            <div>
                              <div
                                className={
                                  data.isActive === true
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
                                  data.isActive === true ? "Disable" : "Enable"
                                }
                              ></div>
                            </div>
                            <div className="row">
                              <div className="col-12 spaceBetween editBox">
                                <i
                                  class="fa-solid fa-pencil"
                                  onClick={async (e) => {
                                    await editHandler(e, data._id);
                                    openPopup();
                                  }}
                                  title="Edit"
                                ></i>
                                <i
                                  class="fa-solid fa-trash-can"
                                  onClick={async (e) => {
                                    await deleteHandler(
                                      e,
                                      data._id,
                                      data.unitNumber
                                    );
                                  }}
                                  title="Delete"
                                ></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <h5>{data.unitNumber}</h5>
                          <div className="UnitModel">
                            <div>
                              <p>Manufacturer</p>
                              <h5>{data?.manufactureInfo?.name}</h5>
                            </div>
                            <div>
                              <p>Model Year</p>
                              <h5>
                                <Moment format="YYYY">{data.modelYear}</Moment>
                              </h5>
                            </div>
                          </div>
                          <div className="unitNumber">
                            <div className="spaceBetween">
                              <h3 className="month">
                                <Moment format="MMM">
                                  {data.registrationExpiry}
                                </Moment>
                              </h3>
                              <h3
                                title={data.state}
                                style={{ cursor: "pointer" }}
                              >
                                {data.state.length > 16
                                  ? `${data.state.slice(0, 12)}..`
                                  : data.state}
                              </h3>

                              <h3>
                                <Moment format="YYYY">
                                  {data.registrationExpiry}
                                </Moment>
                              </h3>
                            </div>
                            <h2 className="mb-0">{data.numberPlate}</h2>
                          </div>
                        </div>

                        <div className="col-md-6 mt-3 mt-md-0 centerMid">
                          <img
                            src={
                              data.manufactureInfo.feature.find(
                                (feature) => feature._id === data.truckColor
                              )?.image
                            }
                            alt=""
                            className="truck w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </InfiniteScroll>
          )}
          <ToolBox />
        </div>
      </div>

      {isOpen && (
        <div className="popup-container" onClick={closePopupBlur}>
          <div className="popup" ref={popupRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {currentId === 0 ? "Add New Unit" : "Update New Unit"}
                </h5>
                <button
                  type="button"
                  className="btn-closed"
                  // data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    clear();
                    closePopup();
                  }}
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
                        onChange={(e) => {
                          setUnitData({
                            ...unitData,
                            unitNumber: e.target.value,
                          });
                          handleUnitNumberBlur(e);
                        }}
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
                      <DatePicker
                        className="form-control"
                        selected={
                          unitData.modelYear
                            ? new Date(unitData.modelYear)
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
                        onChange={(e) => {
                          setUnitData({
                            ...unitData,
                            numberPlate: e.target.value,
                          });
                          handleNumberPlateBlur(e);
                        }}
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
                      <DatePicker
                        className="form-control"
                        selected={
                          unitData.registrationExpiry
                            ? new Date(unitData.registrationExpiry)
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
                      <h6 className="text-danger mt-2 validation-error">
                        {errors.registrationExpiry}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <Select
                        value={valueState}
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
                    {errors.manufacture && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.manufacture}
                      </h6>
                    )}
                  </div>

                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <Select
                        value={selectedOptionColor || valueColor}
                        onChange={handleChangeOptionsColor}
                        options={manufacture
                          .filter((manu) => manu._id === unitData.manufacture)
                          .flatMap((manu) =>
                            manu.feature.map((feature) => ({
                              value: feature,
                              label: feature.color,
                            }))
                          )}
                        placeholder="Unit Color"
                      />
                    </div>
                    {errors.truckColor && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.truckColor}
                      </h6>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-border me-3"
                  onClick={(e) => {
                    clear();
                    closePopup(e);
                  }}
                >
                  Back
                </button>
                {!uploading && (
                  <div data-bs-dismiss="modal">
                    <button
                      type="button"
                      className="btn"
                      onClick={submitHandler}
                    >
                      {currentId === 0 ? "Add Unit" : "Update Unit"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trucks;

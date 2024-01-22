import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../components/Header/HeaderComponent";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Moment from "react-moment";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import swal from "sweetalert";
import { ClipLoader, PropagateLoader } from "react-spinners";
import ToolBoxAdmin from "./ToolBoxAdmin";
import {
  createCustomer,
  createDriverCustomer,
  deleteCustomer,
  listCustomer,
  updateCheckboxCustomer,
  updateCustomer,
  updateDriver,
} from "../actions/customer";
import * as api from "../api/index";

const baseURL = process.env.REACT_APP_BASEURL;
const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;
const header = {
  headers: {
    Authorization: loginToken,
  },
};

let driverToUpdate = {};

const stateOptions = [
  { value: "2", label: "CARRIER" },
  { value: "4", label: "DRIVER" },
  { value: "3", label: "BROKER" },
  { value: "5", label: "COMPANY" },
];

const Customer = () => {
  const dispatch = useDispatch();

  const titleProp = JSON.parse(Cookies.get("businessName"));

  useEffect(() => {
    dispatch(listCustomer(1, 100, 0));

    setUnitStateData();
    setCarriersData();
    // Initialize tooltip when the component mounts
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const { loading, customer, Length } = useSelector(
    (state) => state.customerReducer
  );

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [currentId, setCurrentId] = useState(0);
  const [userRole, setUserRole] = useState(0);
  const [customerDetail, setCustomerDetail] = useState({});
  const [searchRole, setSearchRole] = useState(1);
  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    role: "", // is need to display for both driver and others
    dotNumber: "", // is not needed for driver but needed for others

    mobile: {
      code: "91",
      number: "",
    },
    address: "",
    licenseNo: "",
    licenseExp: "",
    issuedState: "",
    image: "",
    carrierId: "",
  });

  const [driverData, setDriverData] = useState({
    fullName: "",
    email: "",
    mobile: {
      code: "91",
      number: "",
    },
    address: "",
    licenseNo: "",
    licenseExp: "",
    issuedState: "",
    image: "",
  });

  const [nonDriverData, setNonDriverData] = useState({
    fullName: "",
    email: "",
    role: "",
    dotNumber: "",
    businessName: "",
  });

  // console.log("customerData ===== ", customerData);

  const [customerUpdateData, setCustomerUpdateData] = useState({
    fullName: "",
    businessName: "",
    dotNumber: "",

    mobile: {
      code: "91",
      number: "",
    },
    address: "",
    licenseNo: "",
    licenseExp: "",
    issuedState: "",
    image: "",
  });

  console.log("customerUpdateData === ", customerUpdateData);

  const [driverUpdate, setDriverUpdate] = useState({
    fullName: "",
    mobile: {
      code: "91",
      number: "",
    },
    address: "",
    licenseNo: "",
    licenseExp: "",
    issuedState: "",
    image: "",
  });

  const [nonDriverUpdate, setNonDriverUpdate] = useState({
    fullName: "",
    businessName: "",
    dotNumber: "",
  });

  console.log("nonDriverUpdate --- ", nonDriverUpdate);
  console.log("driverUpdate --- ", driverUpdate);

  const clear = () => {
    setCurrentId(0);
    setCustomerData({
      ...customerData,
      fullName: "",
      email: "",
      role: "", // is need to display for both driver and others
      dotNumber: "", // is not needed for driver but needed for others

      mobile: {
        code: "91",
        number: "",
      },
      address: "",
      licenseNo: "",
      licenseExp: "",
      issuedState: "",
      image: "",
      carrierId: "",
    });
    setDriverData({
      ...driverData,
      fullName: "",
      email: "",
      mobile: {
        code: "91",
        number: "",
      },
      address: "",
      licenseNo: "",
      licenseExp: "",
      issuedState: "",
      image: "",
    });

    setNonDriverData({
      ...nonDriverData,
      fullName: "",
      email: "",
      role: "",
      dotNumber: "",
    });
    setCustomerUpdateData({
      ...customerUpdateData,
      fullName: "",
      businessName: "",
      dotNumber: "",

      mobile: {
        code: "91",
        number: "",
      },
      address: "",
      licenseNo: "",
      licenseExp: "",
      issuedState: "",
      image: "",
    });

    setDriverUpdate({
      ...driverUpdate,
      fullName: "",
      mobile: {
        code: "91",
        number: "",
      },
      address: "",
      licenseNo: "",
      licenseExp: "",
      issuedState: "",
      image: "",
    });
    setNonDriverUpdate({
      ...nonDriverUpdate,
      fullName: "",
      businessName: "",
      dotNumber: "",
    });
    setSelectedOption(null);
    setSelectedOptionCarrier(null);
  };

  const [unitState, setUnitState] = useState([]);

  async function setUnitStateData() {
    const states = await axios.get(
      `${baseURL}/states/list?limit=100&page=1`,
      header
    );
    if (states?.data?.data?.stateList.length > 0) {
      await setUnitState(states?.data?.data?.stateList);
    }
  }

  const [carriers, setCarriers] = useState([]);

  async function setCarriersData() {
    const carrierData = await api.fetchCustomers(1, 1000, 2);
    if (carrierData?.data?.data?.data?.length > 0) {
      await setCarriers(carrierData?.data?.data?.data);
    }
  }

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
        !currentId
          ? await setCustomerData({
              ...customerData,
              image: response.data.data,
            })
          : await setCustomerUpdateData({
              ...customerUpdateData,
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

  console.log("customerData ---- 0 ", customerData);
  const submitHandler = async (e) => {
    e.preventDefault();

    let updatedDriverData = null;
    let updatedNonDriverData = null;

    let updateddDriverData = null;
    let updateddNonDriverData = null;

    if (customerData?.role === "4") {
      updatedDriverData = {
        ...driverData,
        fullName: customerData?.fullName,
        email: customerData?.email,
        mobile: {
          code: "91",
          number: customerData?.mobile?.number,
        },
        address: customerData?.address,
        licenseNo: customerData?.licenseNo,
        licenseExp: customerData?.licenseExp,
        issuedState: customerData?.issuedState,
        image: customerData?.image,
        carrierId: customerData?.carrierId,
      };
    } else {
      updatedNonDriverData = {
        ...nonDriverData,
        fullName: customerData?.fullName,
        email: customerData?.email,
        role: customerData?.role,
        dotNumber: customerData?.dotNumber,
        businessName: customerData?.businessName,
      };
    }

    if (userRole === 4) {
      updateddDriverData = {
        ...driverUpdate,
        fullName: customerUpdateData?.fullName,
        mobile: {
          code: "91",
          number: customerUpdateData?.mobile?.number,
        },
        address: customerUpdateData?.address,
        licenseNo: customerUpdateData?.licenseNo,
        licenseExp: customerUpdateData?.licenseExp,
        issuedState: customerUpdateData?.issuedState,
        image: customerUpdateData?.image,
      };

      await setDriverUpdate((prevDriverUpdate) =>
        updateddDriverData
          ? { ...prevDriverUpdate, ...updateddDriverData }
          : prevDriverUpdate
      );
    }

    if (userRole !== 0 && userRole !== 4) {
      updateddNonDriverData = {
        ...nonDriverUpdate,
        fullName: customerUpdateData?.fullName,
        dotNumber: customerUpdateData?.dotNumber,
        businessName: customerUpdateData?.businessName,
      };
    }

    await setDriverData((prevDriverData) =>
      updatedDriverData
        ? { ...prevDriverData, ...updatedDriverData }
        : prevDriverData
    );

    await setNonDriverData((prevNonDriverData) =>
      updatedNonDriverData
        ? { ...prevNonDriverData, ...updatedNonDriverData }
        : prevNonDriverData
    );

    await setDriverUpdate((prevDriverUpdate) =>
      updateddDriverData
        ? { ...prevDriverUpdate, ...updateddDriverData }
        : prevDriverUpdate
    );

    await setNonDriverUpdate((prevNonDriverUpdate) =>
      updateddNonDriverData
        ? { ...prevNonDriverUpdate, ...updateddNonDriverData }
        : prevNonDriverUpdate
    );

    console.log("updateddNonDriverData --- ", updateddNonDriverData);
    console.log("nonDriverUpdate == ", nonDriverUpdate);

    const hasError = Object.values(errors).some((error) => error);
    console.log("hasError => ", hasError);
    // ...

    if (!hasError) {
      console.log("customerData => ", customerData);
      console.log("driverData -- ", updatedDriverData || driverData);
      if (currentId === 0) {
        if (customerData?.role === "4") {
          dispatch(createDriverCustomer(updatedDriverData || driverData));
        } else {
          dispatch(createCustomer(updatedNonDriverData || nonDriverData));
        }
      } else {
        // dispatch(updateCustomer(currentId, customerUpdateData));
        if (userRole !== 4) {
          console.log(">>>", nonDriverUpdate);
          dispatch(
            updateCustomer(currentId, updateddNonDriverData || nonDriverUpdate)
          );
        }
        if (userRole === 4) {
          console.log(">>>", driverUpdate);
          dispatch(updateDriver(currentId, updateddDriverData || driverUpdate));
        }
      }
    }

    clear();
  };

  const deleteHandler = async (e, ID, driverToDelete) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: `You want to delete customer ${driverToDelete}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Customer ${driverToDelete} is deleted successfully`, {
          icon: "success",
        });
        dispatch(deleteCustomer(ID)); //delete action
      }
    });
  };

  //update
  const editHandler = async (e, ID) => {
    e.preventDefault();
    await setCurrentId(ID);

    const getDetailDriver = await axios.get(
      `${baseURL}/user/getDetail/${ID}`,
      header
    );

    driverToUpdate = getDetailDriver?.data?.data[0];

    console.log(
      ("getDetailDriver?.data?.data[0] => ", getDetailDriver?.data?.data[0])
    );
    await setUserRole(driverToUpdate?.role);

    setCustomerUpdateData({
      ...customerUpdateData,
      fullName: driverToUpdate?.fullName,
      businessName: driverToUpdate?.businessName,
      dotNumber: driverToUpdate?.dotNumber,

      image: driverToUpdate?.image,
      mobile: driverToUpdate?.mobile,
      address: driverToUpdate?.address,
      licenseNo: driverToUpdate?.protfolioInfo?.licenseNo,
      licenseExp: driverToUpdate?.protfolioInfo?.licenseExp.slice(0,10),
      issuedState: driverToUpdate?.protfolioInfo?.issuedState,
    });
  };

  console.log("customerUpdateData ---- ", customerUpdateData);

  // validation
  const [errors, setErrors] = useState({});

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

  const handleBusinessNameBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessName: "Business name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessName: null,
      }));
    }
  };

  const handleRoleBlur = (e) => {
    const value = customerData.role.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "Role is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: null,
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

  const handleDeviceIdBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deviceId: "Device id is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deviceId: null,
      }));
    }
  };

  const handleDeviceTypeBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deviceType: "Device type is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deviceType: null,
      }));
    }
  };

  const handleDotNumberBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dotNumber: "DOT Number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dotNumber: null,
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

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(10 * (pageNumber - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listCustomer(pageNumber, 10));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };

  const getDetailHandler = async (e, ID) => {
    e.preventDefault();
    const getDetailUnit = await axios.get(
      `${baseURL}/user/getDetail/${ID}`,
      header
    );
    setCustomerDetail(getDetailUnit.data.data[0]);
  };

  // setting selected option for dropdown
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChangeOptions = (selectedOption) => {
    setSelectedOption(selectedOption);
    // Update customerData with selected value
    const selectedValue = selectedOption ? selectedOption.value : "";
    // ...
    if (currentId === 0) {
      setCustomerData({
        ...customerData,
        role: selectedValue,
      });
    } else {
      setCustomerUpdateData({
        ...customerUpdateData,
        role: selectedValue,
      });
    }
  };
  let value = null;
  if (currentId === 0 && customerData.role === "") {
    value = { value: "", label: "Select Role" }; // Set custom placeholder option
  } else {
    value = stateOptions.find((option) => option.value === customerData.role);
  }
  // dropdown value

  const handleCheckbox = async (checked, dataId, driverToDisable) => {
    console.log("valu =>", checked);
    swal({
      title: "Are you sure?",
      text: `You want to ${
        checked === false ? "disable" : "enable"
      } driver ${driverToDisable}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDisable) => {
      if (willDisable) {
        swal(
          `Customer ${driverToDisable} is ${
            checked === false ? "disabled" : "enabled"
          } successfully`,
          {
            icon: "success",
          }
        );
        console.log(dataId, "----", checked);
        dispatch(updateCheckboxCustomer(dataId, checked)); //update checkbox
      }
    });
  };

  // State/Provice

  // setting state dropdown
  const [selectedOptionState, setSelectedOptionState] = useState(null);

  const handleChangeOptionsState = (selectedOptionState) => {
    setSelectedOptionState(selectedOptionState);
    // Access the selected value using selectedOptionState.value._id
    const selectedValue = selectedOptionState ? selectedOptionState.value : "";
    // ...
    setCustomerData({
      ...customerData,
      issuedState: selectedValue,
    });
    setCustomerUpdateData({
      ...customerUpdateData,
      issuedState: selectedValue,
    });
  };

  let valueState = null;
  if (currentId === 0) {
    if (customerData.issuedState === "") {
      valueState = { value: "", label: "Select State" }; // Set custom placeholder option
    }

    if (customerUpdateData.issuedState === "") {
      valueState = { value: "", label: "Select State" }; // Set custom placeholder option
    }
  } else if (currentId != 0) {
    if (customerData.issuedState != "") {
      valueState = {
        value: customerData.issuedState,
        label: customerData.issuedState,
      }; // Set custom placeholder option
    }
    if (customerUpdateData.issuedState != "") {
      valueState = {
        value: customerUpdateData.issuedState,
        label: customerUpdateData.issuedState,
      }; // Set custom placeholder option
    }
  } else {
    // valueState = unitState.find(
    //   (option) => option.value === customerData.issuedState
    // );
    valueState = unitState.find(
      (option) =>
        option.value ===
        (customerData.issuedState || customerUpdateData.issuedState)
    );
  }

  // setting state dropdown
  const [selectedOptionCarrier, setSelectedOptionCarrier] = useState(null);

  const handleChangeOptionsCarrier = (selectedOptionCarrier) => {
    setSelectedOptionCarrier(selectedOptionCarrier);
    // Access the selected value using selectedOptionCarrier.value._id
    const selectedValue = selectedOptionCarrier
      ? selectedOptionCarrier.value
      : "";
    // ...
    setCustomerData({
      ...customerData,
      carrierId: selectedValue,
    });
  };

  let valueCarrier = null;
  if (currentId === 0 && customerData.carrierId === "") {
    valueCarrier = { value: "", label: "Select Carrier" }; // Set custom placeholder option
  } else if (currentId != 0 && customerData.carrierId != "") {
    valueCarrier = {
      value: customerData.carrierId,
      label: customerData.carrierId,
    }; // Set custom placeholder option
  } else {
    valueCarrier = carriers.find(
      (option) => option.value === customerData.carrierId
    );
  }

  const ref2 = useRef();
  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  const [activeTab, setActiveTab] = useState("all");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "all") {
      setSearchRole("");
      dispatch(listCustomer(1, 100, 0));
    }

    if (tabId === "carrier") {
      setSearchRole(2);
      dispatch(listCustomer(1, 100, 2));
    }

    if (tabId === "driver") {
      setSearchRole(4);
      dispatch(listCustomer(1, 100, 4));
    }

    if (tabId === "broker") {
      setSearchRole(3);
      dispatch(listCustomer(1, 100, 3));
    }

    if (tabId === "company") {
      setSearchRole(5);
      dispatch(listCustomer(1, 100, 5));
    }
    setSearchRole();
  };

  return (
    <div className="drivers">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} />
        <div className="row mx-sm-4 mx-0">
          <div className="col-12">
            <div className="UnitTop spaceBetween">
              <h4 className="text-capitalize">
                {JSON.parse(Cookies.get("businessName"))
                  .charAt(0)
                  .toUpperCase() +
                  JSON.parse(Cookies.get("businessName")).slice(1)}
              </h4>
              <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#addDrivers"
              >
                Add New Customer
              </button>
            </div>
          </div>
        </div>

        <ul class="nav nav-tabs">
          <li class="nav-item">
            <div
              className={`nav-link ${
                activeTab === "all" ? "active" : "inactive"
              }`}
              onClick={() => {
                handleTabClick("all");
              }}
              style={{ cursor: "pointer" }}
            >
              All
            </div>
          </li>
          <li class="nav-item">
            <div
              className={`nav-link ${
                activeTab === "carrier" ? "active" : "inactive"
              }`}
              onClick={() => {
                handleTabClick("carrier");
                // Add code to handle the "carrier" tab click
              }}
              style={{ cursor: "pointer" }}
            >
              Carrier
            </div>
          </li>
          <li class="nav-item">
            <div
              className={`nav-link ${
                activeTab === "driver" ? "active" : "inactive"
              }`}
              onClick={() => {
                handleTabClick("driver");
                // Add code to handle the "driver" tab click
              }}
              style={{ cursor: "pointer" }}
            >
              Driver
            </div>
          </li>
          <li class="nav-item">
            <div
              className={`nav-link ${
                activeTab === "broker" ? "active" : "inactive"
              }`}
              onClick={() => {
                handleTabClick("broker");
                // Add code to handle the "broker" tab click
              }}
              style={{ cursor: "pointer" }}
            >
              Broker
            </div>
          </li>
          <li class="nav-item">
            <div
              className={`nav-link ${
                activeTab === "company" ? "active" : "inactive"
              }`}
              onClick={() => {
                handleTabClick("company");
                // Add code to handle the "company" tab click
              }}
              style={{ cursor: "pointer" }}
            >
              Company
            </div>
          </li>
        </ul>

        <div className="row mx-sm-4 mx-0">
          <div className="col-12">
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
              // <InfiniteScroll
              //   dataLength={customer?.length}
              //   hasMore={hasMore}
              //   next={() => fetchDataOnScroll()}
              //   loader={
              //     customer?.length === 0 || customer?.length === Length ? (
              //       ""
              //     ) : (
              //       <h4>Loading...</h4>
              //     )
              //   }
              //   endMessage={
              //     <div className="row mt-4">
              //       <div className="col text-center">
              //         <p style={{ textAlign: "center" }}>
              //           <b>
              //             {customer?.length === 0
              //               ? ""
              //               : "Yay! You have seen it all"}
              //           </b>
              //         </p>
              //       </div>
              //     </div>
              //   }
              //   style={{ display: "flex", flexWrap: "wrap" }} //define style here
              //   className="row"
              // >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {customer?.length === 0 ? (
                  <h4 className="mt-4">
                    No customers to list. Please add some customer to show
                  </h4>
                ) : (
                  customer.map((data, index) => (
                    <div className="col-lg-4 col-md-6 my-3" key={index}>
                      <div
                        className="driverBox"
                        // data-bs-toggle="modal"
                        // data-bs-target="#driverInformation"
                        onClick={async (e) =>
                          await getDetailHandler(e, data._id)
                        }
                      >
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
                                  data.fullName
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
                              <div>
                                <i
                                  class="fa-solid fa-pencil"
                                  title="Edit"
                                  data-bs-toggle="modal"
                                  data-bs-target="#updateDrivers"
                                  data-bs-dismiss="modal"
                                  onClick={async (e) => {
                                    // await getDetailHandler(e, data._id);
                                    await editHandler(e, data._id);
                                  }}
                                ></i>
                              </div>
                              <div>
                                <i
                                  class="fa-solid fa-trash-can"
                                  title="Delete"
                                  onClick={async (e) => {
                                    // await getDetailHandler(e, data._id);
                                    await deleteHandler(
                                      e,
                                      data._id,
                                      data?.fullName
                                    );
                                  }}
                                ></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="spaceBetween mt-3"
                          data-bs-toggle="modal"
                          data-bs-target="#driverInformation"
                        >
                          <div className="driverProfile">
                            <div className="image">
                              <img
                                src={
                                  data.image === ""
                                    ? "assets/driver.png"
                                    : data.image
                                }
                                alt={data.fullName}
                              />
                            </div>
                            <h3>{data.fullName}</h3>
                          </div>
                          <div className="dataBox">
                            <p className="mb-0">ID</p>
                            <h4>{data.id}</h4>
                          </div>
                          <div className="dataBox">
                            <p className="mb-0">Phone Number</p>
                            <h4>
                              ({data?.mobile?.code}) {data?.mobile?.number}
                            </h4>
                          </div>
                        </div>
                        {data?.protfolioInfo && (
                          <div
                            className="spaceBetween mt-3"
                            data-bs-toggle="modal"
                            data-bs-target="#driverInformation"
                          >
                            <div className="dataBox">
                              <p className="mb-0">License</p>
                              <h4>{data?.protfolioInfo?.licenseNo}</h4>
                            </div>
                            <div className="dataBox">
                              <p className="mb-0">License Expiry </p>
                              <h4>
                                <Moment format="YYYY">
                                  {data?.protfolioInfo?.createdAt}
                                </Moment>
                              </h4>
                            </div>
                            <div className="dataBox">
                              <p className="mb-0">Issued State</p>
                              <h4>{data?.protfolioInfo?.issuedState}</h4>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              // </InfiniteScroll>
            )}
          </div>
          <ToolBoxAdmin />
        </div>
      </div>

      {/* add new driver popup */}
      <div
        className="modal fade"
        id="addDrivers"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {currentId === 0 ? "Add New Customer" : "Update Customer"}
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clear()}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                {customerData.role === "4" && (
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
                                class=" rounded-circle"
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
                              <i class="fa-solid fa-camera"></i>
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
                )}

                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <Select
                      value={selectedOption || value}
                      onChange={handleChangeOptions}
                      options={stateOptions}
                      placeholder="Select Role"
                      className="custom-select"
                      onBlur={handleRoleBlur}
                    />
                  </div>
                  {errors.role && (
                    <h6 className="text-danger validation-error">
                      {errors.role}
                    </h6>
                  )}
                </div>

                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
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
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          email: e.target.value,
                        })
                      }
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

                {customerData.role !== "4" && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="DOT Number"
                        onBlur={(e) => {
                          handleDotNumberBlur(e);
                        }}
                        value={customerData.dotNumber}
                        onChange={(e) => {
                          setCustomerData({
                            ...customerData,
                            dotNumber: e.target.value,
                          });
                          handleDotNumberBlur(e);
                        }}
                        required
                      />
                    </div>
                    {errors.dotNumber && (
                      <h6 className="text-danger validation-error">
                        {errors.dotNumber}
                      </h6>
                    )}
                  </div>
                )}

                {customerData.role !== "4" && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Business Name"
                        value={customerData.businessName}
                        onChange={(e) => {
                          setCustomerData({
                            ...customerData,
                            businessName: e.target.value,
                          });
                          handleBusinessNameBlur(e);
                        }}
                        onBlur={(e) => handleBusinessNameBlur(e)}
                        required
                      />
                    </div>
                    {errors.businessName && (
                      <h6 className="text-danger validation-error">
                        {errors.businessName}
                      </h6>
                    )}
                  </div>
                )}

                {customerData.role === "4" && (
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
                )}

                {customerData.role === "4" && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="License Number"
                        value={customerData.licenseNo}
                        onChange={(e) => {
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            licenseNo: e.target.value,
                          });
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
                )}

                {customerData.role === "4" && (
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
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            licenseExp: e.target.value,
                          });
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
                )}

                {customerData.role === "4" && (
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
                            setCustomerUpdateData({
                              ...customerUpdateData,
                              mobile: {
                                ...customerData.mobile,
                                number: phoneNumber,
                              },
                            });
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
                )}

                {customerData.role === "4" && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <Select
                        value={selectedOptionCarrier || valueCarrier}
                        onChange={handleChangeOptionsCarrier}
                        options={carriers?.map((state) => ({
                          value: state?._id,
                          label: state?.fullName,
                        }))}
                        placeholder="Select State"
                      />
                    </div>
                  </div>
                )}

                {customerData.role === "4" && (
                  <div className="col-12 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        value={customerData.address}
                        onChange={(e) => {
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            address: e.target.value,
                          });
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
                )}
              </div>
            </div>
            <div className="modal-footer">
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
                data-bs-dismiss="modal"
                className="btn"
                onClick={submitHandler}
              >
                {currentId === 0 ? "Add Customer" : "Update Customer"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* update driver popup */}
      <div
        className="modal fade"
        id="updateDrivers"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {currentId === 0 ? "Add New Customer" : "Update Customer"}
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clear()}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                {userRole === 4 && (
                  <div className="col-12">
                    <div className="">
                      <label htmlFor="uploadFile" className="uploadButton">
                        <div className="row">
                          {customerUpdateData?.image ? (
                            <div className="col">
                              <img
                                src={
                                  customerUpdateData?.image
                                    ? customerUpdateData?.image
                                    : ""
                                }
                                class=" rounded-circle"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  cursor: "pointer",
                                }}
                                alt={
                                  customerUpdateData?.fullName
                                    ? customerUpdateData?.fullName
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
                              <i class="fa-solid fa-camera"></i>
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
                )}

                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      value={customerUpdateData.fullName}
                      onChange={(e) => {
                        setCustomerUpdateData({
                          ...customerUpdateData,
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

                {userRole !== 4 && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Business Name"
                        value={customerUpdateData.businessName}
                        onChange={(e) => {
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            businessName: e.target.value,
                          });

                          handleBusinessNameBlur(e);
                        }}
                        onBlur={(e) => handleBusinessNameBlur(e)}
                        required
                      />
                    </div>
                    {errors.businessName && (
                      <h6 className="text-danger validation-error">
                        {errors.businessName}
                      </h6>
                    )}
                  </div>
                )}

                {userRole !== 4 && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="DOT Number"
                        value={customerUpdateData.dotNumber}
                        onChange={(e) => {
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            dotNumber: e.target.value,
                          });

                          handleDotNumberBlur(e);
                        }}
                        onBlur={(e) => handleDotNumberBlur(e)}
                        required
                      />
                    </div>
                    {errors.dotNumber && (
                      <h6 className="text-danger validation-error">
                        {errors.dotNumber}
                      </h6>
                    )}
                  </div>
                )}

                {userRole === 4 && (
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
                )}

                {userRole === 4 && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="License Number"
                        value={customerUpdateData.licenseNo}
                        onChange={(e) => {
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            licenseNo: e.target.value,
                          });
                          // setCustomerData({
                          //   ...customerData,
                          //   licenseNo: e.target.value,
                          // });
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
                )}

                {userRole === 4 && (
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
                        value={customerUpdateData.licenseExp.slice(0, 10)}
                        onChange={(e) => {
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            licenseExp: e.target.value,
                          });
                          // setCustomerData({
                          //   ...customerData,
                          //   licenseExp: e.target.value,
                          // });
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
                )}

                {userRole === 4 && (
                  <div className="col-12 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        value={customerUpdateData.address}
                        onChange={(e) => {
                          setCustomerUpdateData({
                            ...customerUpdateData,
                            address: e.target.value,
                          });
                          // setCustomerData({
                          //   ...customerData,
                          //   address: e.target.value,
                          // });
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
                )}

                {userRole === 4 && (
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone Number"
                        value={customerUpdateData?.mobile?.number}
                        onChange={(e) => {
                          const phoneNumber = e.target.value;
                          if (/^\d{0,10}$/.test(phoneNumber)) {
                            setCustomerUpdateData({
                              ...customerUpdateData,
                              mobile: {
                                ...customerUpdateData.mobile,
                                number: phoneNumber,
                              },
                            });
                            // setCustomerData({
                            //   ...customerUpdateData,
                            //   mobile: {
                            //     ...customerUpdateData.mobile,
                            //     number: phoneNumber,
                            //   },
                            // });
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
                )}
              </div>
            </div>
            <div className="modal-footer">
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
                data-bs-dismiss="modal"
                className="btn"
                onClick={submitHandler}
              >
                {currentId === 0 ? "Add Customer" : "Update Customer"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Information  */}
      <div
        className="modal fade"
        id="driverInformation"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Customer Information
              </h5>

              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setCustomerDetail({})}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body br-bottom">
              <div className="row">
                <div className="col-12">
                  <div className="driverBox">
                    <div className="row">
                      <div className="col-sm-6 driverProfile">
                        <div className="image">
                          <img
                            src={
                              customerDetail?.image
                                ? customerDetail?.image
                                : "assets/driver.png"
                            }
                            alt={customerDetail?.fullName}
                          />
                        </div>
                        <h3>{customerDetail?.fullName}</h3>
                      </div>
                      <div className="col-sm-6 mt-2 mt-sm-0">
                        <div className="row">
                          <div className="col-4">
                            <div className="dataBox">
                              <p className="mb-0">ID</p>
                              <h4>{customerDetail?.id}</h4>
                            </div>
                          </div>
                          <div className="col-8">
                            <div className="dataBox">
                              <p className="mb-0">Phone Number</p>
                              <h4>
                                ({customerDetail?.mobile?.code}){" "}
                                {customerDetail?.mobile?.number}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {customerDetail?.protfolioInfo && (
                      <div className="row mt-2">
                        <div className="col-sm-5 mt-2 mt-sm-0">
                          <div className="dataBox">
                            <p className="mb-0">License</p>
                            <h4>{customerDetail?.protfolioInfo?.licenseNo}</h4>
                          </div>
                        </div>
                        <div className="col-sm-4 mt-2 mt-sm-0">
                          <div className="dataBox">
                            <p className="mb-0">License Expiry </p>
                            <h4>
                              <Moment format="YYYY">
                                {customerDetail?.protfolioInfo?.createdAt}
                              </Moment>
                            </h4>
                          </div>
                        </div>
                        <div className="col-sm-3 mt-2 mt-sm-0">
                          <div className="dataBox">
                            <p className="mb-0">Issued State</p>
                            <h4>
                              {customerDetail?.protfolioInfo?.issuedState}
                            </h4>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="row mt-2">
                      <div className="col">
                        <div className="dataBox">
                          <p className="mb-0">Address</p>
                          <h4>{customerDetail?.address}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {customerDetail?.protfolioInfo && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="dataBox2">
                      <p>Total Shipment </p>
                      <h1>{customerDetail?.protfolioInfo?.totalShipment}</h1>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="dataBox2">
                      <p>Total Miles Driven </p>
                      <h1>{customerDetail?.protfolioInfo?.totalMiles} Miles</h1>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="dataBox2">
                      <p>Incidents </p>
                      <h1>
                        {customerDetail?.protfolioInfo?.incidentCount?.length}
                      </h1>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="dataBox2">
                      <p>Total Pay </p>
                      <h1>${customerDetail?.protfolioInfo?.totalPay}</h1>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <div className="spaceBetween w-100">
                <button
                  className="btn me-3"
                  data-bs-toggle="modal"
                  data-bs-target="#updateDrivers"
                  data-bs-dismiss="modal"
                  onClick={async (e) =>
                    await editHandler(e, customerDetail._id)
                  }
                >
                  Edit <i class="fa-solid fa-pencil ms-2"></i>
                </button>
                <button
                  className="btn"
                  data-bs-dismiss="modal"
                  onClick={async (e) => {
                    await deleteHandler(
                      e,
                      customerDetail._id,
                      customerDetail?.fullName
                    );
                  }}
                >
                  Delete <i class="fa-solid fa-trash-can ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;

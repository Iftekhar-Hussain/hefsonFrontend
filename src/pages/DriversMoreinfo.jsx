import { useDispatch, useSelector } from "react-redux";
import {
  createDriver,
  deleteDriver,
  listSearch,
  updateCheckbox,
  updateDriver,
} from "../actions/driver";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Moment from "react-moment";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import swal from "sweetalert";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { useParams } from "react-router-dom";

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
  { value: "California", label: "California" },
  { value: "Sacramanto", label: "Sacramanto" },
  { value: "Ontario", label: "Ontario" },
];

const DriversMoreinfo = () => {
  const { name } = useParams();

  const dispatch = useDispatch();

  const titleProp = JSON.parse(Cookies.get("businessName"));

  //useEffect
  useEffect(() => {
    if (Number(Length) > Number(driver?.length)) {
      dispatch(listSearch(1, 100, "createdAt", -1, name));
    }
    if (driver?.length === 0) {
      dispatch(listSearch(1, 100, "createdAt", -1, name));
    }

    setUnitStateData();

    // Initialize tooltip when the component mounts
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const { loading, driver, Length } = useSelector(
    (state) => state.driverReducer
  );

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [currentId, setCurrentId] = useState(0);
  const [customerDetail, setCustomerDetail] = useState({});
  const [unitState, setUnitState] = useState([]);
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

  const [customerUpdateData, setCustomerUpdateData] = useState({
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

  const clear = () => {
    setCurrentId(0);
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
    setCustomerUpdateData({
      ...customerUpdateData,
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
    setSelectedOption(null);
  };

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

  // setting manufacturer for color dropdown
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
  };

  let valueState = null;
  if (currentId === 0 && customerData.issuedState === "") {
    valueState = { value: "", label: "Select State" }; // Set custom placeholder option
  } else if (currentId != 0 && customerData.issuedState != "") {
    valueState = {
      value: customerData.issuedState,
      label: customerData.issuedState,
    }; // Set custom placeholder option
  } else {
    valueState = unitState.find(
      (option) => option.value === customerData.issuedState
    );
  }
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
      .post(
        `${baseURL}/file/upload-image`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: loginToken,
          },
        }
      )
      .then(async (response) => {
        console.log("response.data => ", response.data.data);
        !currentId
          ? await setCustomerData({
              ...customerData,
              image: response.data.data,
            })
          : setCustomerUpdateData({
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

  const submitHandler = (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((error) => error);
    console.log("hasError => ", hasError);
    if (!hasError) {
      console.log("customerData => ", customerData);
      if (currentId === 0) dispatch(createDriver(customerData));
      else {
        dispatch(updateDriver(currentId, customerUpdateData));
      }
      clear();
    }
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
        swal(`Driver ${driverToDelete} is deleted successfully`, {
          icon: "success",
        });
        dispatch(deleteDriver(ID)); //delete action
      }
    });
  };

  //update
  const editHandler = async (e, ID) => {
    e.preventDefault();
    await setCurrentId(ID);
    const getDetailDriver = await axios.get(
      `${baseURL}/driver/detail-driver/${ID}`,
      header
    );

    driverToUpdate = getDetailDriver?.data?.data[0];

    setCustomerData({
      ...customerData,
      fullName: driverToUpdate.fullName,
      mobile: {
        code: driverToUpdate.mobile.code,
        number: driverToUpdate.mobile.number,
      },
      email: driverToUpdate.email,
      address: driverToUpdate.address,
      licenseNo: driverToUpdate.driverProtfolio.licenseNo,
      licenseExp: driverToUpdate.driverProtfolio.licenseExp.slice(0, 10),
      issuedState: driverToUpdate.driverProtfolio.issuedState,
      image: driverToUpdate.image,
    });

    setCustomerUpdateData({
      ...customerUpdateData,
      fullName: driverToUpdate.fullName,
      mobile: {
        code: driverToUpdate.mobile.code,
        number: driverToUpdate.mobile.number,
      },
      address: driverToUpdate.address,
      licenseNo: driverToUpdate.driverProtfolio.licenseNo,
      licenseExp: driverToUpdate.driverProtfolio.licenseExp.slice(0, 10),
      issuedState: driverToUpdate.driverProtfolio.issuedState,
      image: driverToUpdate.image,
    });
  };

  // validation
  const [errors, setErrors] = useState({});

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

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(10 * (pageNumber - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listSearch(1, 100, "createdAt", -1, name));

        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };

  const getDetailHandler = async (e, ID) => {
    e.preventDefault();
    // await setCurrentId(ID);
    const getDetailUnit = await axios.get(
      `${baseURL}/driver/detail-driver/${ID}`,
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
        issuedState: selectedValue,
      });
    } else {
      setCustomerUpdateData({
        ...customerUpdateData,
        issuedState: selectedValue,
      });
    }
  };
  let value = null;
  if (currentId === 0 && customerData.issuedState === "") {
    value = { value: "", label: "Select State" }; // Set custom placeholder option
  } else {
    value = stateOptions.find(
      (option) => option.value === customerData.issuedState
    );
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
          `Driver ${driverToDisable} is ${
            checked === false ? "disabled" : "enabled"
          } successfully`,
          {
            icon: "success",
          }
        );
        console.log(dataId, "----", checked);
        dispatch(updateCheckbox(dataId, checked)); //update checkbox
      }
    });
  };

  const ref2 = useRef();
  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };
  return (
    <div className="drivers">
      <div className="container-fluid">
        <HeaderComponent titleProp={titleProp} searching={true} />
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
                Add New Driver
              </button>
            </div>
          </div>
        </div>

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
              <InfiniteScroll
                dataLength={driver?.length}
                hasMore={hasMore}
                next={() => fetchDataOnScroll()}
                loader={
                  driver?.length === 0 || driver?.length === Length ? (
                    ""
                  ) : (
                    <h4>Loading...</h4>
                  )
                }
                endMessage={
                  <div className="row mt-4">
                    <div className="col text-center">
                      <p style={{ textAlign: "center" }}>
                        <b>
                          {driver?.length === 0
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
                {driver?.length === 0 ? (
                  <h4 className="mt-4">
                    No drivers to list. Please add some driver to show
                  </h4>
                ) : (
                  driver?.map((data, index) => (
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
                                  data-bs-target="#addDrivers"
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
                        <div
                          className="spaceBetween mt-3"
                          data-bs-toggle="modal"
                          data-bs-target="#driverInformation"
                        >
                          <div className="dataBox">
                            <p className="mb-0">License</p>
                            <h4>{data.driverProtfolio.licenseNo}</h4>
                          </div>
                          <div className="dataBox">
                            <p className="mb-0">License Expiry </p>
                            <h4>
                              <Moment format="YYYY">
                                {data.driverProtfolio.createdAt}
                              </Moment>
                            </h4>
                          </div>
                          <div className="dataBox">
                            <p className="mb-0">Issued State</p>
                            <h4>{data?.driverProtfolio?.issuedState}</h4>
                            {/* <h4>California</h4> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </InfiniteScroll>
            )}
          </div>
          <ToolBox />
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
                {currentId === 0 ? "Add New Driver" : "Update Driver"}
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
                <div className="col-12">
                  <div className="">
                    <label htmlFor="uploadFile" className="uploadButton">
                      <div className="row">
                        {customerUpdateData?.image ? (
                          <div className="col">
                            <img
                              // src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
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
                        ) : customerData?.image ? (
                          <div className="col">
                            <img
                              // src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
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
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Driver Name"
                      value={customerData.fullName}
                      onChange={(e) => {
                        setCustomerUpdateData({
                          ...customerUpdateData,
                          fullName: e.target.value,
                        });
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
                {currentId === 0 ? "Add Driver" : "Update Driver"}
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
                Driver Information
              </h5>

              {/* <div className=" spaceBetween editBox">
                <div
                  onClick={async (e) => await editHandler(e, customerDetail._id)}
                >
                  <i class="fa-solid fa-pencil"></i>
                </div>

                <i class="fa-solid fa-trash-can"></i>
              </div> */}

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
                              customerDetail?.image === ""
                                ? "assets/driver.png"
                                : customerDetail?.image
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
                    <div className="row mt-2">
                      <div className="col-sm-5 mt-2 mt-sm-0">
                        <div className="dataBox">
                          <p className="mb-0">License</p>
                          <h4>{customerDetail?.driverProtfolio?.licenseNo}</h4>
                        </div>
                      </div>
                      <div className="col-sm-4 mt-2 mt-sm-0">
                        <div className="dataBox">
                          <p className="mb-0">License Expiry </p>
                          <h4>
                            <Moment format="YYYY">
                              {customerDetail?.driverProtfolio?.createdAt}
                            </Moment>
                          </h4>
                        </div>
                      </div>
                      <div className="col-sm-3 mt-2 mt-sm-0">
                        <div className="dataBox">
                          <p className="mb-0">Issued State</p>
                          <h4>
                            {customerDetail?.driverProtfolio?.issuedState}
                          </h4>
                        </div>
                      </div>
                    </div>
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
              <div className="row">
                <div className="col-md-6">
                  <div className="dataBox2">
                    <p>Total Shipment </p>
                    <h1>{customerDetail?.driverProtfolio?.totalShipment}</h1>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dataBox2">
                    <p>Total Miles Driven </p>
                    <h1>{customerDetail?.driverProtfolio?.totalMiles} Miles</h1>
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="dataBox2">
                    <p>Total Miles Driven </p>
                    <h1>52450 Miles</h1>
                  </div>
                </div> */}
                <div className="col-md-6">
                  <div className="dataBox2">
                    <p>Incidents </p>
                    <h1>
                      {customerDetail?.driverProtfolio?.incidentCount?.length}
                    </h1>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dataBox2">
                    <p>Total Pay </p>
                    <h1>${customerDetail?.driverProtfolio?.totalPay}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="spaceBetween w-100">
                <button
                  className="btn me-3"
                  data-bs-toggle="modal"
                  data-bs-target="#addDrivers"
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

export default DriversMoreinfo;

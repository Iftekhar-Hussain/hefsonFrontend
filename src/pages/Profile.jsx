import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import React, { useEffect, useRef, useState } from "react";
import profileImg from "../assets/profile.png";
import Moment from "react-moment";
import { PropagateLoader, ClipLoader } from "react-spinners";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { detailProfile, updateProfile } from "../actions/profile";
import { logout } from "../actions/user";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_BASEURL;

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const Profile = () => {
  const ref = useRef();
  const dispatch = useDispatch();

  const [profileUpdateData, setProfileUpdateData] = useState({
    fullName: "",
    // dob: "",
    emergencyPhone: 0,
    businessName: "",
    // gender: "",
    phone: "",
    address: "",
    dotNumber: "",
    image: "",
  });

  const clear = () => {
    setProfileUpdateData({
      ...profileUpdateData,
      fullName: "",
      // dob: "",
      emergencyPhone: 0,
      businessName: "",
      // gender: "",
      phone: "",
      address: "",
      dotNumber: "",
      image: "",
    });
  };

  useEffect(() => {
    dispatch(detailProfile());
  }, []);
  const profilData = useSelector((state) => state.profileReducer);
  const { profile, loading } = profilData;
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const uploadImageHandler = async (e) => {
    console.log("profile image upload");
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
        setProfileUpdateData({
          ...profileUpdateData,
          image: response.data.data,
        });
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
    console.log("profileUpdateData => ", profileUpdateData);
  };

  // validation
  const [errors, setErrors] = useState({});

  const handleFullnameBlur = (e) => {
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

  const handleDobBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dob: "Date of birth is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dob: null,
      }));
    }
  };

  const handlePhoneBlur = (e) => {
    const value = e.target.value.trim();

    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Phone is required.",
      }));
    } else if (!/^\d{1,10}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Phone must be a number with a maximum of 10 digits.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: null,
      }));
    }
  };

  const handleEmergencyPhoneBlur = (e) => {
    const value = e.target.value.trim();

    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emergencyPhone: "Emergency phone is required.",
      }));
    } else if (!/^\d{1,10}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emergencyPhone:
          "Emergency phone must be a number with a maximum of 10 digits.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emergencyPhone: null,
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

  const handleEmailBlur = (e) => {
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

  const editHandler = async (e, ID) => {
    e.preventDefault();

    setProfileUpdateData({
      fullName: profile.fullName,
      // dob: profile.dob.slice(0, 10),
      emergencyPhone: profile.emergencyPhone,
      businessName: profile.businessName,
      // gender: profile.gender,
      phone: profile.phone,
      address: profile.address,
      dotNumber: profile.dotNumber,
      image: profile.image,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((error) => error);
    console.log("hasError => ", hasError);
    if (!hasError) {
      dispatch(updateProfile(profileUpdateData));
      clear();
    }
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  //dropdown

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  // setting selected option for gender dropdown
  // const [selectedOption, setSelectedOption] = useState(null);

  // const handleChangeOptions = (selectedOption) => {
  //   setSelectedOption(selectedOption);
  //   // Update driverData with selected value
  //   const selectedValue = selectedOption ? selectedOption.value : "";
  //   // ...
  //   setProfileUpdateData({
  //     ...profileUpdateData,
  //     gender: selectedValue,
  //   });
  // };
  // let value = null;

  // if (profileUpdateData.gender === "") {
  //   value = { value: "", label: "Gender" }; // Set custom placeholder option
  // } else {
  //   value = genderOptions.find(
  //     (option) => option.value === profileUpdateData.gender
  //   );
  // }
  // dropdown value

  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelected = (place) => {
    setSelectedPlace({
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });
    Cookies.set("Address", JSON.stringify(place.formatted_address));

    setProfileUpdateData({
      ...profileUpdateData,
      address: place.formatted_address,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      address: null,
    }));
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="profile">
      <HeaderComponent titleProp="profile" />
      <ToolBox />
      {loading && profile === null ? (
        <div className="loader">
          <PropagateLoader
            cssOverride={override}
            size={15}
            color={"#000"}
            loading={loading}
          />
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row profileData ms-4 me-md-4 me-1">
            <div className="col-12">
              <div className="dataRow">
                <div className="userdata">
                  <div className="imageBox">
                    <img
                      src={profile?.image === "" ? profileImg : profile?.image}
                      alt={profile?.fullName}
                    />
                    <div className="data">
                      <h6>Full Name</h6>
                      <p className="text-capitalize">
                        {profile?.fullName === "" ? "N/A" : profile?.fullName}
                      </p>
                    </div>
                  </div>
                  {/* <div className="data">
                    <h6>Gender</h6>
                    <p>{profile?.gender === "" ? "N/A" : profile?.gender}</p>
                  </div> */}
                  {/* <div className="data">
                    <h6>Date of Birth</h6>
                    <p>
                      <Moment format="DD-MM-YYYY">
                        {profile?.dob === null ? "N/A" : profile?.dob}
                      </Moment>
                    </p>
                  </div> */}
                  <div className="data">
                    <h6>Emergency Phone Number</h6>
                    <p>(+1) {profile?.emergencyPhone}</p>
                  </div>
                  <div className="data">
                    <h6>Phone Number</h6>
                    <p>(+1) {profile?.phone}</p>
                  </div>
                  <div className="data">
                    <h6>Business Name</h6>
                    <p>
                      {profile?.businessName === ""
                        ? "N/A"
                        : profile?.businessName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn mb-4 mb-lg-0"
                  data-bs-toggle="modal"
                  data-bs-target="#editProfile"
                  onClick={editHandler}
                >
                  Edit Profile
                </button>
              </div>
              <div className="dataRow mt-4">
                <div className="userdata">
                  <div className="data border-start-0 ps-0">
                    <h6>DOT Number</h6>
                    <p>
                      {profile?.dotNumber === "" ? "N/A" : profile?.dotNumber}
                    </p>
                  </div>
                  <div className="data">
                    <h6>Address</h6>
                    <p>{profile?.address === "" ? "N/A" : profile?.address}</p>
                  </div>
                  <div className="data">
                    <h6>ID</h6>
                    <p>{profile?.id === "" ? "N/A" : profile?.id}</p>
                  </div>
                  <div className="data">
                    <h6>Email</h6>
                    <p>{profile?.email === "" ? "N/A" : profile?.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="logout" onClick={() => logoutHandler()}>
              <img src="./assets/icons/logOut.svg" alt="" />
              <p className="mb-0">Log Out</p>
            </button>
          </div>
        </div>
      )}
      <div
        className="modal fade"
        id="editProfile"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Profile
              </h5>
              <button
                type="button"
                className="btn"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={clear}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <div className="uploadImage">
                    <img
                      src={
                        profileUpdateData?.image === ""
                          ? profileImg
                          : profileUpdateData?.image
                      }
                      alt=""
                      className="profile"
                    />
                    <label htmlFor="uploadProfile">
                      <div className="iconBox">
                        <img
                          src="./assets/icons/editImage.svg"
                          alt=""
                          className="icon"
                        />
                      </div>
                      <input
                        type="file"
                        name=""
                        id="uploadProfile"
                        className="d-none"
                        onChange={uploadImageHandler}
                        onBlur={(e) => handleImageBlur(e)}
                      />
                      {uploading && (
                        <div className="loader">
                          <ClipLoader
                            size={30}
                            color={"#000"}
                            loading={uploading}
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      value={profileUpdateData.fullName}
                      onChange={(e) => {
                        setProfileUpdateData({
                          ...profileUpdateData,
                          fullName: e.target.value,
                        });
                        handleFullnameBlur(e);
                      }}
                      onBlur={(e) => handleFullnameBlur(e)}
                    />
                  </div>
                  {errors.fullName && (
                    <h6 className="text-danger validation-error">
                      {errors.fullName}
                    </h6>
                  )}
                </div>
                {/* <div className="col-md-6">
                  <div className="inputField">
                    <Select
                      value={value || selectedOption}
                      onChange={handleChangeOptions}
                      options={genderOptions}
                      placeholder="Gender"
                      className="custom-select"
                    />
                  </div>
                </div> */}
                {/* <div className="col-md-6">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Date of Birth"
                      ref={ref}
                      onFocus={() => (ref.current.type = "date")}
                      onBlur={(e) => {
                        ref.current.type = "text";
                        handleDobBlur(e);
                      }}
                      value={profileUpdateData.dob}
                      onChange={(e) => {
                        setProfileUpdateData({
                          ...profileUpdateData,
                          dob: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {errors.dob && (
                    <h6 className="text-danger validation-error">
                      {errors.dob}
                    </h6>
                  )}
                </div> */}
                <div className="col-md-6">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Emergency phone Number"
                      value={profileUpdateData.emergencyPhone}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        if (value.length <= 10) {
                          setProfileUpdateData({
                            ...profileUpdateData,
                            emergencyPhone: value,
                          });
                        }
                        handleEmergencyPhoneBlur(e);
                      }}
                      onBlur={(e) => handleEmergencyPhoneBlur(e)}
                    />
                  </div>
                  {errors.emergencyPhone && (
                    <h6 className="text-danger validation-error">
                      {errors.emergencyPhone}
                    </h6>
                  )}
                </div>

                <div className="col-md-6">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone Number"
                      value={profileUpdateData.phone}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        if (value.length <= 10) {
                          setProfileUpdateData({
                            ...profileUpdateData,
                            phone: value,
                          });
                        }
                        handlePhoneBlur(e);
                      }}
                      onBlur={(e) => handlePhoneBlur(e)}
                    />
                  </div>
                  {errors.phone && (
                    <h6 className="text-danger validation-error">
                      {errors.phone}
                    </h6>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Business Name"
                      value={profileUpdateData.businessName}
                      onChange={(e) => {
                        setProfileUpdateData({
                          ...profileUpdateData,
                          businessName: e.target.value,
                        });
                        handleBusinessNameBlur(e);
                      }}
                      onBlur={(e) => handleBusinessNameBlur(e)}
                      disabled
                    />
                  </div>
                  {errors.businessName && (
                    <h6 className="text-danger validation-error">
                      {errors.businessName}
                    </h6>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="DOT Number"
                      value={profileUpdateData.dotNumber}
                      onChange={(e) => {
                        setProfileUpdateData({
                          ...profileUpdateData,
                          dotNumber: e.target.value,
                        });
                        handleEmailBlur(e);
                      }}
                      onBlur={(e) => handleEmailBlur(e)}
                      disabled
                    />
                  </div>
                  {errors.dotNumber && (
                    <h6 className="text-danger validation-error">
                      {errors.dotNumber}
                    </h6>
                  )}
                </div>
                <div className="col-12">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address"
                      value={profileUpdateData.address}
                      onChange={(e) => {
                        setProfileUpdateData({
                          ...profileUpdateData,
                          address: e.target.value,
                        });
                        handleAddressBlur(e);
                      }}
                      onBlur={(e) => handleAddressBlur(e)}
                    />
                    {/* <Autocomplete
                      apiKey={process.env.REACT_APP_MAP_API}
                      options={{
                        suppressDefaultStyles: true,
                        types: ["address"],
                      }}
                      placeholder="Address"
                      onPlaceSelected={handlePlaceSelected}
                      onBlur={handleAddressBlur}
                      name="Address"
                      required
                      defaultValue={profileUpdateData.address}
                      className="form-control"
                    /> */}
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
                className="btn btn-border me-3"
                data-bs-dismiss="modal"
                onClick={clear}
              >
                CANCEL
              </button>
              <button
                data-bs-dismiss="modal"
                type="button"
                className="btn"
                onClick={submitHandler}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  approveSoiltableCatagory,
  approveSoiltableCatagoryStatus,
  createSoiltableCategory,
  deleteSoiltableCatagory,
  editRequestCategory,
  listRequestSoiltableCategory,
  listRequestSoiltableCategoryAdmin,
  updateSoiltableCatagory,
} from "../actions/soiltableCategory";
import { ClipLoader } from "react-spinners";
import Cookies from "js-cookie";
import ToolBoxAdmin from "./ToolBoxAdmin";
import profileImg from "../assets/mango.png";
import axios from "axios";
import swal from "sweetalert";

const baseURL = process.env.REACT_APP_BASEURL;

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const AdminSoiltableList = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [currentId, setCurrentId] = useState(0);

  const [categoryData, setCategoryData] = useState({
    name: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  const handleNameBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: null,
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
  // image upload
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
        console.log("response.data => ", response?.data?.data);
        setCategoryData({
          ...categoryData,
          image: response?.data?.data,
        });
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
    console.log("categoryData image => ", categoryData);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((error) => error);
    console.log("hasError => ", hasError);
    if (!hasError) {
      // Submit the form

      if (currentId === 0) dispatch(createSoiltableCategory(categoryData));
      else {
        console.log("updateeeeeeeeeeeee => ", categoryData);
        dispatch(updateSoiltableCatagory(currentId, categoryData));
      }
      clear();
    }
  };

  const approveHandler = (e, data) => {
    e.preventDefault();
    setCurrentId(data?._id);
    setCategoryData((prevCategoryData) => ({
      ...prevCategoryData,
      name: data?.name,
      image: data?.image,
    }));

    swal({
      title: "Are you sure?",
      text: `You want to approve category ${data?.name}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(approveSoiltableCatagory(currentId, categoryData));

        swal(`Category ${data?.name} is approved successfully`, {
          icon: "success",
        });
        console.log("d ----", data);
      }
    });

    // console.log("d ----", data);
    // setCategoryData({ ...categoryData, name: data?.name, image: data?.image });
  };

  const editRequestCategoryHandler = (e, data) => {
    e.preventDefault();
    setCurrentId(data?._id);
    setCategoryData((prevCategoryData) => ({
      ...prevCategoryData,
      name: data?.name,
      image: data?.image,
    }));
    dispatch(editRequestCategory(currentId, categoryData));
    clear();
    // dispatch(listRequestSoiltableCategory(1, 1000));
  };

  const approveStatusHandler = (e, data) => {
    e.preventDefault();
    setCurrentId(data?._id);
    const status = data?.isActive === true ? false : true;
    const approveStatus = {
      id: data?._id,
      // status: status,
    };

    swal({
      title: "Are you sure?",
      text: `You want to ${
        data?.isActive === true ? "approve" : "disprove"
      } category ${data?.name}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(
          `Category ${data?.name} is ${
            data?.isActive === true ? "approved" : "disproved"
          } successfully`,
          {
            icon: "success",
          }
        );

        dispatch(approveSoiltableCatagoryStatus(approveStatus));
        dispatch(listRequestSoiltableCategoryAdmin(1, 1000));
      }
    });

    // console.log("d ----", data);
    // setCategoryData({ ...categoryData, name: data?.name, image: data?.image });
  };

  const redirectHandler = (e, Id, name) => {
    e.preventDefault();
    Cookies.set("CategoryId", JSON.stringify(Id));
    Cookies.set("CategoryName", JSON.stringify(name));

    navigate(`/SolitableDetailList/${Id}`);
  };

  const updateHandler = (e) => {
    e.preventDefault();
    console.log("currernt id ", currentId);
  };
  const clear = () => {
    setCurrentId(0);
    setCategoryData({
      name: "",
      image: "",
    });
  };

  const deleteHandler = async (e, ID, categoryName) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: `You want to delete category ${categoryName}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Category ${categoryName} is deleted successfully`, {
          icon: "success",
        });
        dispatch(deleteSoiltableCatagory(ID)); //delete action
      }
    });
  };

  useEffect(() => {
    dispatch(listRequestSoiltableCategoryAdmin(1, 1000));
    dispatch(listRequestSoiltableCategory(1, 1000));
  }, []);

  const soiltableCategoryData = useSelector(
    (state) => state.soiltableCategoryReducer
  );
  const {
    soiltableRequestCategoryAdmin,
    soiltableRequestCategory,
    loading,
    Length,
  } = soiltableCategoryData;

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(10 * (pageNumber - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listRequestSoiltableCategory(pageNumber, 10));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };
  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  const [activeTab, setActiveTab] = useState("complete");
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="SoiltableList">
      <div className="container-fluid">
        <HeaderComponent />
        <div className="row mx-sm-4 mx-0">
          <div className="col-12">
            <div className="UnitTop spaceBetween">
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <div
                    className={`nav-link ${
                      activeTab === "complete" ? "active" : "inactive"
                    }`}
                    onClick={() => {
                      handleTabClick("complete");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Requested Category
                  </div>
                </li>
                <li class="nav-item">
                  <div
                    // className="nav-link inactive"
                    className={`nav-link ${
                      activeTab === "cancel" ? "active" : "inactive"
                    }`}
                    onClick={() => {
                      handleTabClick("cancel");
                      // dispatch(listShipmentCancel(1, 10, "createdAt", -1));
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Categories{" "}
                  </div>
                </li>
              </ul>
              {activeTab !== "complete" && (
                <button
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#addNewCategory"
                >
                  Add New Category
                </button>
              )}
            </div>
          </div>
        </div>
        {activeTab === "complete" ? (
          <div className="row mt-4 mx-sm-4 mx-0">
            <div className="col-12">
              <div className="row">
                {soiltableRequestCategory.length === 0 && (
                  <h4 className="mt-4 text-center">
                    No requested category to show
                  </h4>
                )}
                {soiltableRequestCategory &&
                  soiltableRequestCategory.map((data, index) => (
                    <div
                      key={index}
                      className="col-lg-2 col-md-3 col-sm-4 col-6 mt-30 text-center SolitableBox"
                    >
                      <div className="SolitableImage">
                        <div className="flexEnd editBtns">
                          <div
                            className="checkIcon"
                            data-bs-toggle="modal"
                            data-bs-target="#editRequestCategory"
                            onClick={(e) => {
                              setCurrentId(data?._id);
                              setCategoryData({
                                ...categoryData,
                                name: data?.name,
                                image: data?.image,
                              });
                            }}
                          >
                            <i
                              class="fa-solid fa-pen editIcon"
                              title="Edit"
                            ></i>
                          </div>
                          <div
                            onClick={(e) => approveHandler(e, data)}
                            className="checkIcon"
                            title="approve/disprove"
                          >
                            <i
                              class="fa-regular fa-circle-check text-success"
                              className={`fa-regular text-success ${
                                data?.isActive === true
                                  ? "fa-circle-check"
                                  : "fa-circle"
                              }`}
                            ></i>
                          </div>
                        </div>
                        <img src={data?.image} alt="" />
                      </div>
                      <p className="mb-0 mt-15">{data?.name}</p>
                    </div>
                  ))}

                {/* <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Category Name</th>
                      <th scope="col">Image</th>

                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soiltableRequestCategory &&
                      soiltableRequestCategory.map((data, index) => (
                        <tr key={index}>
                          <th scope="row">{data?.name}</th>
                          <td>
                            <img
                              src={data?.image}
                              alt={data?.name}
                              width={200}
                              height={100}
                            />
                          </td>

                          <td>
                            <div className="actionBox">
                              <div
                                className="icon"
                                onClick={(e) => approveHandler(e, data)}
                              >
                                <i
                                  class="fa-regular fa-circle-check text-success"
                                  className={`fa-regular text-success ${
                                    data?.isActive === true
                                      ? "fa-circle-check"
                                      : "fa-circle"
                                  }`}
                                ></i>
                              </div>

                              <div
                                className="icon"
                                onClick={async (e) => {
                                  await deleteHandler(e, data?._id, data?.name);
                                }}
                              >
                                <i class="fa-solid fa-trash text-danger"></i>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="row mt-4 mx-sm-4 mx-0">
            <div className="col-12">
              <div className="row">
                {soiltableRequestCategoryAdmin.length === 0 && (
                  <h4 className="mt-4 text-center">
                    No requested category to show
                  </h4>
                )}
                {soiltableRequestCategoryAdmin &&
                  soiltableRequestCategoryAdmin.map((data, index) => (
                    <div
                      key={index}
                      className="col-lg-2 col-md-3 col-sm-4 col-6 mt-30 text-center SolitableBox"
                    >
                      <div className="SolitableImage">
                        <div className="spaceBetween editBtns">
                          <div className="d-flex align-items-center mGap">
                            <div
                              className="icon"
                              data-bs-toggle="modal"
                              data-bs-target="#addNewCategory"
                              onClick={(e) => {
                                setCurrentId(data?._id);
                                setCategoryData({
                                  ...categoryData,
                                  name: data?.name,
                                  image: data?.image,
                                });

                                updateHandler(e);
                              }}
                              title="Edit"
                            >
                              <i class="fa-solid fa-pen"></i>
                            </div>

                            <div
                              className="icon"
                              onClick={async (e) => {
                                await deleteHandler(e, data?._id, data?.name);
                              }}
                              title="Delete"
                            >
                              <i class="fa-solid fa-trash"></i>
                            </div>
                          </div>
                          <div
                            onClick={(e) => approveHandler(e, data)}
                            className="checkIcon"
                            title="Approve/Disprove"
                          >
                            <i
                              class="fa-regular fa-circle-check text-success"
                              className={`fa-regular ${
                                data?.isActive === true
                                  ? "fa-circle-check"
                                  : "fa-circle"
                              }`}
                            ></i>
                          </div>
                        </div>
                        <div
                          onClick={(e) =>
                            redirectHandler(e, data?._id, data?.name)
                          }
                        >
                          <img src={data?.image} alt="" />
                        </div>
                        {/* <Link to={`/SolitableDetailList/${data?._id}`}>
                          <img src={data?.image} alt="" />
                        </Link> */}
                      </div>
                      <p className="mb-0 mt-15">{data?.name}</p>
                    </div>
                  ))}

                {/* <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Category Name</th>
                      <th scope="col">Image</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soiltableRequestCategoryAdmin &&
                      soiltableRequestCategoryAdmin.map((data, index) => (
                        <tr key={index}>
                          <th scope="row">{data?.name}</th>
                          <td>
                            <img
                              src={data?.image}
                              alt={data?.name}
                              width={200}
                              height={100}
                            />
                          </td>
                          <td>
                            <div className="actionBox">
                              <div
                                className="icon"
                                onClick={(e) => approveStatusHandler(e, data)}
                              >
                                <i
                                  class="fa-regular fa-circle-check text-success"
                                  className={`fa-regular text-success ${
                                    data?.isActive === true
                                      ? "fa-circle-check"
                                      : "fa-circle"
                                  }`}
                                ></i>
                              </div>
                              <div
                                className="icon"
                                data-bs-toggle="modal"
                                data-bs-target="#addNewCategory"
                                onClick={(e) => {
                                  setCurrentId(data?._id);
                                  setCategoryData({
                                    ...categoryData,
                                    name: data?.name,
                                    image: data?.image,
                                  });

                                  updateHandler(e);
                                }}
                              >
                                <i class="fa-solid fa-pen text-primary"></i>
                              </div>

                              <div
                                className="icon"
                                onClick={async (e) => {
                                  await deleteHandler(e, data?._id, data?.name);
                                }}
                              >
                                <i class="fa-solid fa-trash text-danger"></i>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table> */}
              </div>
            </div>
          </div>
        )}
      </div>
      {JSON.parse(Cookies.get("role")) === 1 ? <ToolBoxAdmin /> : <ToolBox />}
      <div
        className="modal fade"
        id="addNewCategory"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {currentId === 0
                  ? "Add New Soiltable Category"
                  : "Update Soiltable Category"}
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
                  <div className="uploadImage">
                    {categoryData?.image !== "" && (
                      <img
                        src={categoryData?.image}
                        alt=""
                        className="profile"
                        width={200}
                        height={200}
                      />
                    )}

                    {categoryData?.image === "" && (
                      <div
                        className="col camera"
                        style={{ marginLeft: "20px" }}
                        onClick={(e) => uploadImageHandler(e)}
                      >
                        <i class="fa-solid fa-camera"></i>
                      </div>
                    )}

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
                  {errors.image && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.image}
                    </h6>
                  )}
                </div>
                <div className="col-12 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={categoryData.name}
                      onChange={(e) => {
                        setCategoryData({
                          ...categoryData,
                          name: e.target.value,
                        });
                        handleNameBlur(e);
                      }}
                      onBlur={handleNameBlur}
                      required
                    />
                  </div>
                  {errors.name && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.name}
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
                // onClick={() => clear()}
              >
                Back
              </button>

              <div data-bs-dismiss="modal">
                <button type="button" className="btn" onClick={submitHandler}>
                  {currentId === 0 ? "Add Category" : "Update Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="editRequestCategory"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Soiltable Request
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
                  <div className="uploadImage">
                    {categoryData?.image !== "" && (
                      <img
                        src={categoryData?.image}
                        alt=""
                        className="profile"
                        width={200}
                        height={200}
                      />
                    )}

                    {categoryData?.image === "" && (
                      <div
                        className="col camera"
                        style={{ marginLeft: "20px" }}
                        onClick={(e) => uploadImageHandler(e)}
                      >
                        <i class="fa-solid fa-camera"></i>
                      </div>
                    )}

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
                  {errors.image && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.image}
                    </h6>
                  )}
                </div>
                <div className="col-12 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={categoryData.name}
                      onChange={(e) => {
                        setCategoryData({
                          ...categoryData,
                          name: e.target.value,
                        });
                        handleNameBlur(e);
                      }}
                      onBlur={handleNameBlur}
                      required
                    />
                  </div>
                  {errors.name && (
                    <h6 className="text-danger validation-error mt-2">
                      {errors.name}
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
                // onClick={() => clear()}
              >
                Back
              </button>

              <div data-bs-dismiss="modal">
                <button
                  type="button"
                  className="btn"
                  onClick={(e) => editRequestCategoryHandler(e, categoryData)}
                >
                  {currentId === 0 ? "Add Category" : "Update Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSoiltableList;

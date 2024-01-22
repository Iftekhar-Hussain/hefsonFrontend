import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createUnit, list } from "../actions/unit";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Moment from "react-moment";

import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";

const baseURL = process.env.REACT_APP_BASEURL;

const Units = () => {
  const navigate = useNavigate();
  const ref = useRef();
  const ref2 = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(list(1, 10));
  }, [dispatch]);

  const [unitData, setUnitData] = useState({
    unitNumber: "",
    manufacturer: "",
    modelYear: "",
    truckColor: "",
    numberPlate: "",
    registrationExpiry: "",
    state: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  const loginToken = JSON.parse(Cookies.get("loginToken"));

  const uploadImageHandler = (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("uploadImage", file);
    bodyFormData.append("folderName", "unit");
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
        setUnitData({ ...unitData, image: response.data.data });

        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
    console.log("unitData => ", unitData);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("unitData form => ", unitData);
    dispatch(createUnit(unitData));
    // window.location.reload();
    // navigate("/units");
  };

  const unit = useSelector((state) => state.unitReducer);

  //pagination
  const [page, setPage] = useState(1);
  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= unit?.data?.length / 10 &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };

  return (
    <div className="units">
      <div className="container">
        <HeaderComponent />
        <div className="row">
          <div className="col-12">
            <div className="UnitTop spaceBetween">
              <h4 className="text-capitalize">ABC Logistic</h4>
              <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Add New Unit
              </button>
            </div>
          </div>
        </div>

        <div className="row ms-4 ms-md-0">
          {unit?.data?.slice(page * 10 - 10, page * 10).map((data) => (
            <div className="col-lg-4 col-md-6 mt-4">
              <div className="unitBox">
                <div className="row">
                  <div className="col-md-6">
                    <h5>{data.unitNumber}</h5>
                    <div className="UnitModel">
                      <div>
                        <p>Manufacturer</p>
                        <h5>{data.manufacturer}</h5>
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
                        <h3>
                          <Moment format="MMM">
                            {data.registrationExpiry}
                          </Moment>
                        </h3>
                        <h3>{data.state}</h3>
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
                    <img src={data.image} alt="" className="truck w-100" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <ToolBox />
        </div>
        {/* pagination */}
        {unit?.data?.length > 0 && (
          <div className="row mt-4">
            <div className="col">
              <nav
                aria-label="Page navigation example"
                className="paginationBox"
              >
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" aria-label="Previous">
                      <span
                        onClick={() => selectPageHandler(page - 1)}
                        aria-hidden="true"
                      >
                        <i class="fa-solid fa-caret-left"></i>
                      </span>
                    </Link>
                  </li>

                  {[...Array(unit?.data?.length / 10)].map((_, i) => {
                    return (
                      <span
                        key={i}
                        className={page === i + 1 ? "pagination__selected" : ""}
                        onClick={() => selectPageHandler(i + 1)}
                      >
                        {i + 1}
                      </span>
                    );
                  })}

                  {/* <li className="page-item">
                    <Link className="page-link">1</Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link">2</Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link">3</Link>
                  </li> */}

                  <li className="page-item">
                    <Link className="page-link" aria-label="Next">
                      <span
                        onClick={() => selectPageHandler(page + 1)}
                        aria-hidden="true"
                      >
                        <i class="fa-solid fa-caret-right"></i>
                      </span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
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
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Manufacturer"
                      value={unitData.manufacturer}
                      onChange={(e) =>
                        setUnitData({
                          ...unitData,
                          manufacturer: e.target.value,
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
                      placeholder="Model Year"
                      ref={ref2}
                      onFocus={() => (ref2.current.type = "date")}
                      onBlur={() => (ref2.current.type = "text")}
                      value={unitData.modelYear}
                      onChange={(e) =>
                        setUnitData({ ...unitData, modelYear: e.target.value })
                      }
                      required
                    />
                    <img
                      src="./assets/icons/CalendarDate.svg"
                      className="cal"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Truck Color"
                      value={unitData.truckColor}
                      onChange={(e) =>
                        setUnitData({ ...unitData, truckColor: e.target.value })
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
                      value={unitData.numberPlate}
                      onChange={(e) =>
                        setUnitData({
                          ...unitData,
                          numberPlate: e.target.value,
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
                      placeholder="Registration Expiry Date"
                      ref={ref}
                      onFocus={() => (ref.current.type = "date")}
                      onBlur={() => (ref.current.type = "text")}
                      value={unitData.registrationExpiry}
                      onChange={(e) =>
                        setUnitData({
                          ...unitData,
                          registrationExpiry: e.target.value,
                        })
                      }
                      required
                    />
                    <img
                      src="./assets/icons/CalendarDate.svg"
                      className="cal"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="State/Province"
                      value={unitData.state}
                      onChange={(e) =>
                        setUnitData({ ...unitData, state: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="inputField">
                    {uploading ? (
                      <div className="inputField">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="uploading..."
                        />
                      </div>
                    ) : (
                      <label htmlFor="uploadFile" className="uploadImages">
                        Upload Images
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Upload Image"
                          id="uploadFile"
                          onChange={uploadImageHandler}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {!uploading && (
                <button type="button" className="btn" onClick={submitHandler}>
                  Save changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Units;

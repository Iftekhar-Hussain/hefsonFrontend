import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { createSoiltableProduct, detailSoiltable } from "../actions/soiltable";
import SoiltableImg from "../assets/Soiltable.png";
import Select from "react-select";
import Moment from "react-moment";

const Soiltable = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailSoiltable(id));
  }, []);
  const { soiltableDetail, loading, Length } = useSelector(
    (state) => state.soiltableReducer
  );

  const [soiltableData, setSoiltableData] = useState({
    processingDate: "",
    processingTime: "",
    status: "",
    location: "",
  });

  //validation
  const [errors, setErrors] = useState({});

  const handleProcessingTimeBlur = () => {
    if (soiltableData.processingTime === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        processingTime: "Processing Time is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        processingTime: "",
      }));
    }
  };

  const handleProcessingDateBlur = () => {
    if (soiltableData.processingTime === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        processingDate: "Processing Date is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        processingDate: "",
      }));
    }
  };

  const ref = useRef();
  const ref2 = useRef();
  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  const handleLocationBlur = () => {
    if (soiltableData.location.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "Location is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "",
      }));
    }
  };

  //theme dropdown

  const statusOptions = [
    { value: "Picked Up", label: "Picked Up" },
    { value: "Delivered", label: "Delivered" },
  ];
  const [selectedStatus, setselectedStatus] = useState(null);
  const handleStatusChange = (selectedOption) => {
    setselectedStatus(selectedOption);

    setSoiltableData({
      ...soiltableData,
      status: selectedStatus?.value,
    });
    if (errors !== undefined)
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: null,
      }));
  };

  const handleStatus = (e) => {
    const value = soiltableData.status;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: "Status is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: null,
      }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createSoiltableProduct(id, soiltableData));
    clear();
  };

  const clear = () => {
    setSoiltableData({
      ...soiltableData,
      processingDate: "",
      processingTime: "",
      status: "",
      location: "",
    });
  };

  return (
    <>
      {loading ? (
        <div className="loader">
          <PropagateLoader
            cssOverride={override}
            size={15}
            color={"#000"}
            loading={loading}
          />
        </div>
      ) : Object.keys(soiltableDetail[0] || {}).length === 0 ? (
        <h4 className="mt-4 text-center">Data not found</h4>
      ) : (
        <div className="Soiltable">
          <div className="container-fluid">
            <div className="row vh-100">
              <div className="col-12 centerMid">
                <div>
                  <img src={SoiltableImg} alt="" />
                  <div className="fruitBox text-center">
                    <img
                      src={soiltableDetail[0]?.image}
                      style={{ paddingTop: "20px", paddingBottom: "20px" }}
                      alt=""
                    />
                    <h4>{soiltableDetail[0]?.name}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row vh-100">
              <div className="col-12 centerMid">
                <div className="text-center">
                  <h1>Organic</h1>
                  <p>{soiltableDetail[0]?.isOrganic}</p>
                  {/* <p>{soiltableDetail[0]?.isOrganic === true ? "Yes" : "No"}</p> */}
                </div>
              </div>
            </div>
            {/* <div className="row vh-100">
              <div className="col-12 centerMid">
                <div className="text-center">
                  <h1>Origin</h1>
                  <p>{soiltableDetail[0]?.origin}</p>
                </div>
              </div>
            </div> */}
            <div className="row vh-100">
              <div className="col-12 centerMid">
                <div className="text-center">
                  <h1>Nutrients</h1>
                  <p>
                    Calories:{" "}
                    {soiltableDetail[0]?.calories
                      ? soiltableDetail[0]?.calories
                      : 0}{" "}
                    cal
                  </p>
                  <p>
                    Water:{" "}
                    {soiltableDetail[0]?.water
                      ? soiltableDetail[0]?.calories
                      : 0}
                    %
                  </p>
                  <p>
                    Protein:{" "}
                    {soiltableDetail[0]?.protien
                      ? soiltableDetail[0]?.protien
                      : 0}{" "}
                    grams
                  </p>
                  <p>
                    Carbs:{" "}
                    {soiltableDetail[0]?.crabs ? soiltableDetail[0]?.crabs : 0}{" "}
                    grams
                  </p>
                  <p>
                    Sugar:{" "}
                    {soiltableDetail[0]?.sugar ? soiltableDetail[0]?.sugar : 0}{" "}
                    grams
                  </p>
                  <p>
                    Fiber:{" "}
                    {soiltableDetail[0]?.fiber ? soiltableDetail[0]?.fiber : 0}{" "}
                    grams
                  </p>
                  <p>
                    Fat: {soiltableDetail[0]?.fat ? soiltableDetail[0]?.fat : 0}{" "}
                    grams
                  </p>
                </div>
              </div>
            </div>
            <div className="row vh-100">
              <div className="col-12 centerMid">
                <div className="text-center">
                  <h1>Organic Description</h1>
                  <p>{soiltableDetail[0]?.organicDescription}</p>
                </div>
              </div>
            </div>
            <div className="row vh-100">
              <div className="col-12 centerMid">
                <div className="text-center">
                  <h1>Timeline</h1>
                  <div className="timeLineBox">
                    {soiltableDetail[0]?.timeline?.map((data, index) => (
                      <div className="detailRow" key={index}>
                        <div className="checkBox">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="details">
                          <h6>
                            {data?.processingTime} -{" "}
                            <Moment format="MMMM D YYYY">
                              {data?.processingDate}
                            </Moment>
                          </h6>
                          <p>
                            {data?.status} - Farm - {data?.location}
                          </p>
                        </div>
                        {index !== soiltableDetail[0]?.timeline.length - 1 && (
                          <div className="line"></div>
                        )}
                      </div>
                    ))}

                    {/* <div className="detailRow">
                      <div className="checkBox">
                        <i class="fa-solid fa-check"></i>
                      </div>
                      <div className="details">
                        <h6>16:30 - Jan 14 2023</h6>
                        <p>
                          Picked Up - Farm - Sacramento, CA, USA - 34F/1.11 C
                        </p>
                      </div>
                      <div className="line"></div>
                    </div>
                    <div className="detailRow">
                      <div className="checkBox">
                        <i class="fa-solid fa-check"></i>
                      </div>
                      <div className="details">
                        <h6>16:30 - Jan 14 2023</h6>
                        <p>
                          Picked Up - Farm - Sacramento, CA, USA - 34F/1.11 C
                        </p>
                      </div>
                      <div className="line"></div>
                    </div>
                    <div className="detailRow">
                      <div className="checkBox">
                        <i class="fa-solid fa-check"></i>
                      </div>
                      <div className="details">
                        <h6>16:30 - Jan 14 2023</h6>
                        <p>
                          Picked Up - Farm - Sacramento, CA, USA - 34F/1.11 C
                        </p>
                      </div>
                      <div className="line lightLine"></div>
                    </div>
                    <div className="detailRow">
                      <div className="timeBox">
                        <img src="./assets/icons/time_icon.svg" alt="" />
                      </div>
                      <div className="details">
                        <h6>16:30 - Jan 14 2023</h6>
                        <p>
                          Picked Up - Farm - Sacramento, CA, USA - 34F/1.11 C
                        </p>
                      </div>
                      <div className="line lightLine"></div>
                    </div>
                    <div className="detailRow">
                      <div className="timeBox">
                        <img src="./assets/icons/time_icon.svg" alt="" />
                      </div>
                      <div className="details textDim">
                        <h6>16:30 - Jan 14 2023</h6>
                        <p>
                          Picked Up - Farm - Sacramento, CA, USA - 34F/1.11 C
                        </p>
                      </div>
                      <div className="line d-none"></div>
                    </div> */}
                  </div>
                  {/* <button
                    className="btn"
                    data-bs-toggle="modal"
                    data-bs-target="#addTimeline"
                  >
                    Add Timeline
                  </button> */}
                </div>
              </div>
            </div>
            <div className="row vh-100">
              <div className="col-12 centerMid">
                <div className="text-center">
                  <h1>At Sobey’s – </h1>
                  <p>
                    We are a family nurturing families – is our collective
                    passion and mission to nurture the things that make life
                    better, including great experiences, families, communities
                    and the lives of our employees.
                  </p>
                </div>
              </div>
            </div>
            <div className="row vh-100">
              <div className="col-12 centerMid">
                <div className="text-center">
                  <h1>Product Details</h1>
                  <p>{soiltableDetail[0]?.productDetail}</p>
                </div>
              </div>
            </div>
            <div className="row imageGallery">
              {soiltableDetail[0]?.productImages?.map((data, index) => (
                <div className="col-md-4 my-4" key={index}>
                  <div className="imageBox">
                    <img src={data} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="modal fade"
            id="addTimeline"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered custom-width">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title " id="exampleModalLabel">
                    Add New Product
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
                          placeholder="Processing Time"
                          ref={ref}
                          onFocus={() => (ref.current.type = "time")}
                          value={soiltableData.processingTime}
                          onChange={(e) => {
                            setSoiltableData({
                              ...soiltableData,
                              processingTime: e.target.value,
                            });
                            handleProcessingTimeBlur(e);
                          }}
                          onBlur={(e) => {
                            ref.current.type = "text";
                            handleProcessingTimeBlur(e);
                          }}
                        />
                      </div>
                      {errors.processingTime && (
                        <div className="text-danger validation-error mt-2">
                          {errors.processingTime}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mt-3">
                      <div className="inputField">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Processing Date"
                          ref={ref2}
                          onFocus={() => (ref2.current.type = "date")}
                          value={soiltableData.processingDate}
                          onChange={(e) => {
                            setSoiltableData({
                              ...soiltableData,
                              processingDate: e.target.value,
                            });
                            handleProcessingDateBlur(e);
                          }}
                          onBlur={(e) => {
                            ref2.current.type = "text";
                            handleProcessingDateBlur(e);
                          }}
                        />
                      </div>
                      {errors.processingDate && (
                        <div className="text-danger validation-error mt-2">
                          {errors.processingDate}
                        </div>
                      )}
                    </div>
                    <div className="col-12 mt-3">
                      <div className="inputField">
                        {/* <Autocomplete
                          apiKey={process.env.REACT_APP_MAP_API}
                          options={{
                            suppressDefaultStyles: true,
                            types: ["address"],
                          }}
                          placeholder="Location"
                          onPlaceSelected={handleLocation}
                          onBlur={handleLocationBlur}
                          name="location"
                          required
                          defaultValue={soiltableData.location}
                          className="form-control"
                        /> */}
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location"
                          value={soiltableData.location}
                          onChange={(e) => {
                            setSoiltableData({
                              ...soiltableData,
                              location: e.target.value,
                            });
                            handleLocationBlur(e);
                          }}
                          onBlur={handleLocationBlur}
                        />
                      </div>
                      {errors.location && (
                        <div className="text-danger validation-error mt-2">
                          {errors.location}
                        </div>
                      )}
                    </div>

                    <div className="col-12 mt-3">
                      <div className="inputField">
                        <Select
                          name="status"
                          id="status"
                          value={selectedStatus}
                          onChange={handleStatusChange}
                          placeholder="Select Status"
                          options={statusOptions}
                          onBlur={handleStatus}
                        />
                      </div>
                      {errors.status && (
                        <h6 className="text-danger validation-error">
                          {errors.status}
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
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={submitHandler}
                    data-bs-dismiss="modal"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Soiltable;

import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { list } from "../actions/device";
import { useDispatch, useSelector } from "react-redux";
import ToolBoxAdmin from "./ToolBoxAdmin";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const DeviceList = () => {
  const ref = useRef();
  const ref2 = useRef();
  const dispatch = useDispatch();

  // let device = null;
  useEffect(() => {
    if (loginToken === null) {
      window.location.replace("/login");
    }
    dispatch(list(1, 10));
  }, []);

  const { loading, device, Length } = useSelector(
    (state) => state.deviceReducer
  );

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <HeaderComponent />
        <div className="row">
          <div className="col-12">
            <div className="spaceBetween">
              <div className=""></div>
              {/* <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#addtrailers"
              >
                Add New Devices
              </button> */}
            </div>
          </div>
        </div>
        <div className="row ms-4">
          {!device ? (
            <h4>No device to list. Please add some devices to show</h4>
          ) : (
            device.map((data) => (
              <div
                className="col-lg-1 col-md-2 col-sm-3 col-4 mt-3 text-center"
                style={{ width: "200px" }}
              >
                <div className="devices">
                  <Link to={`/Devices-moreinfo/${data?._id}`}>
                    <img src="./assets/device.png" alt="" />
                  </Link>
                </div>
                <h6 className="mt-3">{data.FAssetID}</h6>
              </div>
            ))
          )}
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
                  Add New Device
                </h5>
                <button
                  type="button"
                  className="btn-closed"
                  data-bs-dismiss="modal"
                  aria-label="Close"
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
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sensor ID"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Manufacturer"
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
                        onChange={(e) => console.log(e.target.value)}
                        onFocus={() => (ref2.current.type = "date")}
                        onBlur={() => (ref2.current.type = "text")}
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
                        placeholder="Number Plate"
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
                        onChange={(e) => console.log(e.target.value)}
                        onFocus={() => (ref.current.type = "date")}
                        onBlur={() => (ref.current.type = "text")}
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
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="inputField">
                      <label htmlFor="uploadFile" className="uploadImages">
                        Upload Images
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Upload Image"
                          id="uploadFile"
                        />
                      </label>
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
                  Back
                </button>
                <button type="button" className="btn">
                  Add Device
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {JSON.parse(Cookies.get("role")) === 1 ? <ToolBoxAdmin /> : <ToolBox />}
    </div>
  );
};

export default DeviceList;

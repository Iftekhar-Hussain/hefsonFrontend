import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import searchIcon from "../../assets/icons/Search.svg";
import headerImg from "../../assets/hefson.svg";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { list, listSearch } from "../../actions/driver";
import { listShipment, listShipmentSearch } from "../../actions/shipment";
import * as api from "../../api/index";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const loginRole = Cookies.get("role") ? JSON.parse(Cookies.get("role")) : null;

const HeaderComponentNoLogin = ({
  titleProp,
  searching,
  temp,
  shipment,
  driver,
}) => {
  const [typedWord, setTypedWord] = useState(null);

  let { id } = useParams();
  const [sendmail, setSendmail] = useState("");

  const handleSendMail = async (e) => {
    e.preventDefault();
    console.log("send mail", sendmail);

    const { data } = await api.sendShipmentMail(id, sendmail, temp);
    console.log("send mail ", data);
    toast(data.message);
    if (data.status === 200) {
      clearSendMail();
    }
  };

  const clearSendMail = () => {
    setSendmail("");
  };

  const navigate = useNavigate();

  // console.log("notificationData -- ", notificationData);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    setTypedWord(e.target.value);
    if (driver === true) {
      if (e.target.value.length >= 1) {
        dispatch(listSearch(1, 100, "createdAt", -1, e.target.value));
      } else {
        dispatch(list(1, 10, "createdAt", -1));
      }
    }

    if (shipment === true) {
      if (e.target.value.length >= 1) {
        dispatch(listShipmentSearch(1, 10, "createdAt", -1, e.target.value));
      } else {
        dispatch(listShipment(1, 10, "createdAt", -1));
      }
    }
  };

  return (
    <div className="header">
      <div className="container">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <div className="slider">
              <OwlCarousel
                autoplay={true}
                items={1}
                className="owl-theme"
                loop
                margin={8}
                dots={false}
              >
                {titleProp && (
                  <div>
                    <h2 className="text-capitalize">{titleProp}</h2>
                  </div>
                )}
              </OwlCarousel>
            </div>
          </div>

          {searching && (
            <div className="col-2 ">
              <div
                style={{
                  background: "white",
                  paddingRight: "10px",
                  borderRadius: "20px",
                }}
                className="search text-end cursor-pointer d-flex align-items-center"
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={handleSearch}
                />
                <img src={searchIcon} alt="" className="ms-2" />
              </div>
            </div>
          )}

          {!searching && (
            <div className="icon col-2 text-end">
              <i
                title="Send Link"
                className="fa-solid fa-paper-plane"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                style={{
                  marginRight: "20px",
                  fontSize: "25px",
                  cursor: "pointer",
                }}
              ></i>
            </div>
          )}
        </div>
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
                Send shipment link
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
                // onClick={() => clear()}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-10 mt-3">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      value={sendmail}
                      onChange={(e) => setSendmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-border me-3"
                    data-bs-dismiss="modal"
                    onClick={handleSendMail}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponentNoLogin;

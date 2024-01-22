import { useDispatch } from "react-redux";
import { logout } from "../actions/user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import SettingIcon from "../assets/icons/setting_icon.svg";
import SubtractIcon from "../assets/icons/Subtract_icon.svg";
import EditIcon from "../assets/icons/editImage_icon.svg";
import ChatIcon from "../assets/icons/chat_icon.svg";
import HomeIcon from "../assets/icons/home_icon.svg";
import Cookies from "js-cookie";

const ToolBoxAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = Cookies.get("role");

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };
  useEffect(() => {
    // Initialize tooltip when the component mounts
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, [Cookies.get("role")]);
  return (
    <div className="toolBox">
      <div
        className="icon"
        onClick={() => {
          role == 1
            ? navigate("/admin-dashboard")
            : role == 2
            ? navigate("/home")
            : navigate("/login");
        }}
        title="Dashboard"
      >
        <img src={HomeIcon} alt="" />
      </div>
      <div
        className="icon"
        onClick={() => navigate("/customer")}
        title="Customer"
      >
        <i class="fa-solid fa-user-group"></i>
      </div>
      <div className="icon" onClick={() => navigate("/Chat")} title="Chat">
        <img src={ChatIcon} alt="" />
      </div>

      <div
        className="icon"
        onClick={() => navigate("/admin-soiltablelist")}
        title="Soiltable"
      >
        <img src={EditIcon} alt="" />
      </div>

      <div
        className="icon"
        onClick={() => navigate("/Devices")}
        title="Devices"
      >
        <img src={SubtractIcon} alt="" />
      </div>
      <div
        className="icon"
        onClick={() => navigate("/Settings")}
        title="Settings"
      >
        <img src={SettingIcon} alt="" />
      </div>
      <div className="icon" onClick={() => logoutHandler()} title="Logout">
        <i className="fa-solid fa-right-from-bracket"></i>
      </div>
    </div>
  );
};

export default ToolBoxAdmin;

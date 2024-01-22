import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const loginToken = Cookies.get("loginToken");

  return loginToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;

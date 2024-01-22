import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const RequireDriver = () => {
  const role = Cookies.get("role");
  // eslint-disable-next-line
  return role == 4 ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default RequireDriver;

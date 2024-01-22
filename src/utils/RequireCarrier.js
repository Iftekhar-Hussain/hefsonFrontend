import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const RequireCarrier = () => {
  const role = Cookies.get("role");
  // eslint-disable-next-line
  return role == 2 ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default RequireCarrier;
